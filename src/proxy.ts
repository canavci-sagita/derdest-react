import { NextRequest, NextResponse } from "next/server";
import {
  publicRoutes,
  matchesProtectedRoute,
  protectedRoutes,
} from "./config/route.config";
import { COOKIE_CONSTANTS } from "./lib/constants/cookie.constants";
import { HEADER_CONSTANTS } from "./lib/constants/header.constants";
import { AppSession, getSession } from "./lib/session";
import { NextURL } from "next/dist/server/web/next-url";
import { CurrentUser } from "./types/user.types";
import { ApiResponseOf } from "./services/common/ApiResponse";
import { SignInResponse } from "./services/auth/auth.types";
import { refreshToken } from "./services/auth/auth.service";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, mapJwtToCurrentUser } from "./lib/utils/auth.utils";

type RefreshResult = {
  accessToken: string;
  refreshToken: string;
  refreshExpires?: Date;
  session: AppSession;
} | null;

let refreshPromise: Promise<RefreshResult> | null = null;

// TODO: Should eventually come from API
const SUPPORTED_LANGS = ["en", "et", "tr"];
const DEFAULT_LANG = "tr";
const DEFAULT_LOGIN_REDIRECT = "/";

const getRedirectUrl = (nextUrl: NextURL) => {
  const signInUrl = new URL("/auth/sign-in", nextUrl);
  signInUrl.searchParams.set("returnUrl", nextUrl.pathname);
  return signInUrl;
};

export async function proxy(request: NextRequest) {
  const refreshTokenCookie = request.cookies.get(
    COOKIE_CONSTANTS.REFRESH_TOKEN
  );
  let session = await getSession();
  let refreshResult: RefreshResult = null;
  let shouldAttemptRefresh = false;

  if (session?.token) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiryBuffer = 5 * 60;

    if (session.token.exp - nowInSeconds < expiryBuffer) {
      shouldAttemptRefresh = true;
    }
  } else if (refreshTokenCookie) {
    shouldAttemptRefresh = true;
  }

  if (shouldAttemptRefresh) {
    if (!refreshPromise) {
      refreshPromise = handleTokenExpiration(request)
        .then((res) => {
          setTimeout(() => {
            refreshPromise = null;
          }, 5000 /*1000*/);
          return res;
        })
        .catch(() => {
          refreshPromise = null;
          return null;
        });
    }
    refreshResult = await refreshPromise;
  }

  if (refreshResult) {
    request.headers.set(
      HEADER_CONSTANTS.AUTHORIZATION,
      `Bearer ${refreshResult.accessToken}`
    );
    session = refreshResult.session;
  } else if (shouldAttemptRefresh) {
    const isApiRoute = request.nextUrl.pathname.startsWith("/api");
    const isServerAction = request.headers.has("next-action");
    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

    if (isAuthPage) {
      const response = NextResponse.next();

      response.cookies.delete(COOKIE_CONSTANTS.AUTH_TOKEN);
      response.cookies.delete(COOKIE_CONSTANTS.REFRESH_TOKEN);

      return response;
    }

    if (isServerAction) {
      const response = NextResponse.next();
      response.headers.set("x-middleware-auth-error", "true");

      return response;
    }

    if (isApiRoute) {
      return NextResponse.json(
        { message: "Session expired", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const signInUrl = getRedirectUrl(request.nextUrl);

    const response = NextResponse.redirect(signInUrl);

    response.cookies.delete(COOKIE_CONSTANTS.AUTH_TOKEN);
    response.cookies.delete(COOKIE_CONSTANTS.REFRESH_TOKEN);

    return response;
  }

  const redirectResponse = handleRedirects(request, session?.user);

  const response =
    redirectResponse ||
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

  if (refreshResult) {
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set(
      COOKIE_CONSTANTS.AUTH_TOKEN,
      refreshResult.accessToken,
      {
        path: "/",
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        expires: new Date(refreshResult.session.token.exp * 1000),
      }
    );

    if (refreshResult.refreshToken) {
      response.cookies.set(
        COOKIE_CONSTANTS.REFRESH_TOKEN,
        refreshResult.refreshToken,
        {
          path: "/",
          httpOnly: true,
          secure: isProduction,
          sameSite: "strict",
          expires: refreshResult.refreshExpires,
        }
      );
    }
  }

  handleLanguage(request, response);

  return response;
}

/**
 * Handles token expiration logic based on refresh token.
 */
async function handleTokenExpiration(
  request: NextRequest
): Promise<RefreshResult> {
  const cookieStore = request.cookies;
  const authTokenRaw = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;
  const refreshTokenRaw = cookieStore.get(
    COOKIE_CONSTANTS.REFRESH_TOKEN
  )?.value;

  if (!authTokenRaw || !refreshTokenRaw) {
    return null;
  }

  try {
    const headersForRefresh = new Headers(request.headers);
    headersForRefresh.set(
      "Cookie",
      `${COOKIE_CONSTANTS.REFRESH_TOKEN}=${refreshTokenRaw}`
    );

    const response = await refreshToken(headersForRefresh, authTokenRaw);

    if (!response.ok) return null;

    const jsonResponse = await response.json();
    const apiResponse = jsonResponse as ApiResponseOf<SignInResponse>;

    if (apiResponse.isSuccess && apiResponse.result) {
      const setCookieHeader = response.headers.get("set-cookie");
      let newRefreshToken = "";
      let refreshExpires: Date | undefined;

      if (setCookieHeader) {
        const parts = setCookieHeader.split(";");
        const tokenKey = `${COOKIE_CONSTANTS.REFRESH_TOKEN}=`;
        const tokenPart = parts.find((p) => p.trim().startsWith(tokenKey));
        if (tokenPart)
          newRefreshToken = tokenPart.trim().substring(tokenKey.length);

        const expiresPart = parts.find((p) =>
          p.trim().toLowerCase().startsWith("expires=")
        );
        if (expiresPart)
          refreshExpires = new Date(
            expiresPart.trim().substring("expires=".length)
          );
      }
      const newToken = apiResponse.result.token;
      const decoded = jwtDecode<DecodedToken & { exp: number }>(newToken);
      const user = mapJwtToCurrentUser(decoded);

      return {
        accessToken: apiResponse.result.token,
        refreshToken: newRefreshToken,
        refreshExpires,
        session: {
          token: decoded,
          user,
        },
      };
    }
  } catch (error) {
    console.error("Token refresh failed", error);
  }
  return null;
}

/**
 * Handles all redirection logic based on authentication and route permissions.
 * Returns a NextResponse (redirect) or null (continue).
 */
export function handleRedirects(
  request: NextRequest,
  currentUser?: CurrentUser
) {
  const { nextUrl } = request;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const protectedRoute = matchesProtectedRoute(nextUrl.pathname);

  if (currentUser) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (protectedRoute) {
      const requiredRoles = protectedRoutes[protectedRoute];
      const isWildcard = requiredRoles[0] === "*";

      if (
        !isWildcard &&
        (!currentUser.role || !requiredRoles.includes(currentUser.role))
      ) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      if (nextUrl.pathname === "/settings") {
        return NextResponse.redirect(new URL("/settings/profile", nextUrl));
      }
    }

    return null;
  }

  if (isPublicRoute || isAuthRoute) {
    return null;
  }

  if (protectedRoute) {
    const redirectUrl = getRedirectUrl(nextUrl);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
}

/**
 * Checks for a valid language cookie. If missing or invalid, detects
 * language from headers and sets the cookie on the response.
 */
export function handleLanguage(request: NextRequest, response: NextResponse) {
  let currentLang = request.cookies.get(COOKIE_CONSTANTS.LANGUAGE)?.value;
  let langToSet = currentLang;
  let shouldSetCookie = false;

  if (!currentLang || !SUPPORTED_LANGS.includes(currentLang)) {
    shouldSetCookie = true;

    const acceptLang = request.headers.get(HEADER_CONSTANTS.ACCEPT_LANGUAGE);

    langToSet = DEFAULT_LANG;

    if (acceptLang) {
      const browserLang = acceptLang.split(",")[0].split("-")[0];

      if (SUPPORTED_LANGS.includes(browserLang)) {
        langToSet = browserLang;
      }
    }
  }

  if (shouldSetCookie && langToSet) {
    response.cookies.set(COOKIE_CONSTANTS.LANGUAGE, langToSet, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  //matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
