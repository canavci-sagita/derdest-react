import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, protectedRoutes } from "./config/route.config";
import { COOKIE_CONSTANTS } from "./lib/constants/cookie.constants";
import { HEADER_CONSTANTS } from "./lib/constants/header.constants";
import { getSession } from "./lib/session";

//TODO: Will be fetched from API
const SUPPORTED_LANGS = ["en", "et", "tr"];
const DEFAULT_LANG = "tr";
const DEFAULT_LOGIN_REDIRECT = "/";

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  if (
    nextUrl.pathname.includes("/hubs/") ||
    nextUrl.pathname.includes("/notifications")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  let session;
  try {
    session = await getSession();
  } catch {
    session = { user: null, token: null };
  }

  const initialToken = request.cookies.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;

  if (session?.token && session.token !== initialToken) {
    request.cookies.set(COOKIE_CONSTANTS.AUTH_TOKEN, session.token);
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (session?.token && session.token !== initialToken) {
    response.cookies.set(COOKIE_CONSTANTS.AUTH_TOKEN, session.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  // if (isApiAuthRoute) {
  //   return NextResponse.next();
  // }
  if (isApiRoute) {
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return response;
  }

  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;

  if (isLoggedIn) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const protectedRoute = Object.keys(protectedRoutes)
      .sort((a, b) => {
        const aIsDynamic = a.includes("[");
        const bIsDynamic = b.includes("[");
        if (aIsDynamic && !bIsDynamic) return 1;
        if (!aIsDynamic && bIsDynamic) return -1;
        return b.length - a.length; // Longest first
      })
      .find((routePattern) => {
        if (routePattern === nextUrl.pathname) return true;

        // NOTE: Convert Next.js route pattern to Regex for dynamic matching
        // Escape slashes and replace [param] with a capture group that stops at the next slash
        const regexSource =
          "^" +
          routePattern.replace(/\//g, "\\/").replace(/\[.*?\]/g, "([^/]+)") +
          "$";

        return new RegExp(regexSource).test(nextUrl.pathname);
      });

    if (protectedRoute) {
      const requiredRoles = protectedRoutes[protectedRoute];
      const isWildcard = requiredRoles[0] === "*";

      if (!isWildcard && (!userRole || !requiredRoles.includes(userRole))) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      if (request.nextUrl.pathname === "/settings") {
        return NextResponse.redirect(new URL("/settings/profile", request.url));
      }
    }
  } else {
    if (!isPublicRoute && !isAuthRoute) {
      const signInUrl = new URL("/auth/sign-in", nextUrl);
      signInUrl.searchParams.set("returnUrl", nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  const langCookie = request.cookies.get(COOKIE_CONSTANTS.LANGUAGE)?.value;

  if (!langCookie || !SUPPORTED_LANGS.includes(langCookie)) {
    const acceptLang = request.headers.get(HEADER_CONSTANTS.ACCEPT_LANGUAGE);
    const browserLang = acceptLang?.split(",")[0].split("-")[0];
    let langToSet = DEFAULT_LANG;
    if (browserLang && SUPPORTED_LANGS.includes(browserLang)) {
      langToSet = browserLang;
    }
    response.cookies.set(COOKIE_CONSTANTS.LANGUAGE, langToSet, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
