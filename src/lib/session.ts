"use server";

import { cookies, headers } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { CurrentUser } from "@/types/user.types";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { DecodedToken, mapJwtToCurrentUser } from "./utils/auth.utils";
import { getAbsoluteUrl } from "./utils/url.utils";

export type AppSession = {
  token: DecodedToken & { exp: number };
  user: CurrentUser;
};
/**
 * A simple, read-only function to get the current user from the request cookies.
 * It does NOT refresh the token. Use this in Server Components for rendering.
 * @returns The CurrentUser object or null if the token is missing, invalid, or expired.
 */
export async function getAuthenticatedUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;

  if (!authToken) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken & { exp: number }>(authToken);
    const isExpired = decodedToken.exp * 1000 < Date.now();
    if (isExpired) {
      return null;
    }
    return mapJwtToCurrentUser(decodedToken);
  } catch {
    return null;
  }
}

export const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;
};

/**
 * The single source of truth for the user's session on the server.
 * It reads the cookie, checks for expiration, and automatically refreshes the token if needed.
 * @returns A Promise that resolves with the user object and the valid token string.
 */
export async function getSession(): Promise<AppSession | null> {
  const token = await getToken();

  if (token) {
    const decoded = jwtDecode<DecodedToken & { exp: number }>(token);
    const user = mapJwtToCurrentUser(decoded);

    return { token: decoded, user };
  } else {
    return null;
  }
}

export async function getSessionWithRefresh() {
  const cookieStore = await cookies();
  const cookieHeader = (await headers()).get("cookie");

  const accessToken = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_CONSTANTS.REFRESH_TOKEN)?.value;

  if (!refreshToken || !cookieHeader) {
    return { user: null, token: null };
  }

  // Access token still valid → return immediately
  if (accessToken) {
    try {
      const decoded: any = jwtDecode(accessToken);
      if (decoded.exp * 1000 > Date.now()) {
        return { user: decoded, token: accessToken };
      }
    } catch {}
  }

  const refreshUrl = await getAbsoluteUrl("/api/auth/refresh");

  const refreshRes = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!refreshRes.ok) {
    return { user: null, token: null };
  }

  const newToken = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;
  if (!newToken) {
    return { user: null, token: null };
  }

  const decoded = jwtDecode(newToken);
  return { user: decoded, token: newToken };
}
