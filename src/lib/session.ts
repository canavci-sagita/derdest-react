"use server";

import { cookies, headers } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { CurrentUser } from "@/types/user.types";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import {
  AuthError,
  DecodedToken,
  mapJwtToCurrentUser,
} from "./utils/auth.utils";
import { refreshToken } from "@/services/auth/auth.service";
import { cache } from "react";

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

/**
 * The single source of truth for the user's session on the server.
 * It reads the cookie, checks for expiration, and automatically refreshes the token if needed.
 * @returns A Promise that resolves with the user object and the valid token string.
 */
const getSessionFn = async (): Promise<{
  user: CurrentUser | null;
  token: string | null;
} | null> => {
  const cookieStore = await cookies();
  let authToken = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;

  //NOTE: Checking headers if Cookie is missing (For SignalR/API)
  if (!authToken) {
    const headersList = await headers();
    const authHeader = headersList.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      authToken = authHeader.substring(7);
    }
  }
  try {
    if (authToken) {
      let decodedToken = jwtDecode<DecodedToken & { exp: number }>(authToken);

      const nowInSeconds = Math.floor(Date.now() / 1000);
      const expiryBuffer = 5 * 60;

      const isExpiringSoon = decodedToken.exp - nowInSeconds < expiryBuffer;

      if (isExpiringSoon) {
        const cookieHeader = cookieStore.toString();

        console.log("REFRESHING TOKEN");
        const refreshResponse = await refreshToken(authToken, cookieHeader);

        if (refreshResponse?.isSuccess && refreshResponse.result?.token) {
          console.log("TOKEN REFRESH SUCCESS");
          const newToken = refreshResponse.result.token;
          authToken = newToken;
          decodedToken = jwtDecode(newToken);
          const expires = new Date(decodedToken.exp! * 1000);

          //NOTE: Server Components will fail here, but we want to proceed with the new token anyway.
          try {
            cookieStore.set(COOKIE_CONSTANTS.AUTH_TOKEN, newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
              expires,
            });
          } catch {
            console.warn(
              "Could not save cookie in Server Component (Expected). Using fresh token for this request."
            );
          }
        } else {
          console.log("TOKEN REFRESH FAILED");
          try {
            cookieStore.delete(COOKIE_CONSTANTS.AUTH_TOKEN);
          } catch {
            //NOTE: Ignoring read-only error.
          }

          throw new AuthError("Session expired and could not be refreshed.");
        }
      }

      const currentUser = mapJwtToCurrentUser(decodedToken);
      return { user: currentUser, token: authToken };
    }

    return {
      token: null,
      user: null,
    };
  } catch (error) {
    try {
      cookieStore.delete(COOKIE_CONSTANTS.AUTH_TOKEN);
    } catch {
      //NOTE: Ignoring read-only error.
    }

    if (error instanceof AuthError) throw error;
    throw new AuthError("Invalid session. Please sign in again.");
  }
};

export const getSession = cache(getSessionFn);
