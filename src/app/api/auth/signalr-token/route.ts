import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { getSession } from "@/lib/session";
import { refreshToken } from "@/services/auth/auth.service";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import { SignInResponse } from "@/services/auth/auth.types";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/lib/utils/auth.utils";

export async function GET() {
  const cookieStore = await cookies();

  const session = await getSession();

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (session?.token && session.token.exp - nowInSeconds > 300) {
    return NextResponse.json({
      token: cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value,
    });
  }
  const refreshTokenValue = cookieStore.get(
    COOKIE_CONSTANTS.REFRESH_TOKEN
  )?.value;

  if (!refreshTokenValue) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
    const headersForRefresh = new Headers();
    headersForRefresh.set(
      "Cookie",
      `${COOKIE_CONSTANTS.REFRESH_TOKEN}=${refreshTokenValue}`
    );

    const response = await refreshToken(headersForRefresh);

    if (!response.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const jsonResponse: ApiResponseOf<SignInResponse> = await response.json();

    if (jsonResponse.isSuccess && jsonResponse.result) {
      const newAccessToken = jsonResponse.result.token;

      const nextResponse = NextResponse.json({ token: newAccessToken });

      // 5. CRITICAL: Set the new cookies on this response so the browser updates!
      // You likely need to parse 'set-cookie' from 'response' like you did in proxy.ts
      // Or simply set the Auth Token if your backend returned it.

      const decoded = jwtDecode<DecodedToken & { exp: number }>(newAccessToken);

      nextResponse.cookies.set(COOKIE_CONSTANTS.AUTH_TOKEN, newAccessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(decoded.exp * 1000),
      });

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
        if (expiresPart) {
          refreshExpires = new Date(
            expiresPart.trim().substring("expires=".length)
          );
        }
        nextResponse.cookies.set(
          COOKIE_CONSTANTS.REFRESH_TOKEN,
          newRefreshToken,
          {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: refreshExpires,
          }
        );
      }

      return nextResponse;
    }
  } catch (error) {
    console.error("SignalR Token Refresh Error", error);
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
