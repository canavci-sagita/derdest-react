import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { SignInResponse } from "@/services/auth/auth.types";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/RefreshToken`,
    {
      method: "POST",
      headers: request.headers,
    }
  );

  if (!response.ok) {
    return response;
  }

  const setCookieHeader = response.headers.get("set-cookie");

  if (!setCookieHeader) {
    return NextResponse.json({ token: null }, { status: 400 });
  }

  let refreshToken = "";
  let refreshExpires: Date | undefined = undefined;

  const parts = setCookieHeader.split(";");

  const tokenKey = `${COOKIE_CONSTANTS.REFRESH_TOKEN}=`;
  const tokenPart = parts.find((p) => p.trim().startsWith(tokenKey));

  if (tokenPart) {
    refreshToken = tokenPart.trim().substring(tokenKey.length);
  }

  const expiresPart = parts.find((p) =>
    p.trim().toLowerCase().startsWith("expires=")
  );

  if (expiresPart) {
    const dateStr = expiresPart.trim().substring("expires=".length);
    refreshExpires = new Date(dateStr);
  }
  const cookieStore = await cookies();
  if (refreshToken) {
    cookieStore.set(COOKIE_CONSTANTS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: refreshExpires,
    });
  }

  const jsonResponse = await response.json();
  const apiResponse = jsonResponse as ApiResponseOf<SignInResponse>;

  if (apiResponse.isSuccess && apiResponse.result) {
    cookieStore.set(COOKIE_CONSTANTS.AUTH_TOKEN, apiResponse.result.token);

    return NextResponse.json({ token: apiResponse.result.token });
  }

  return NextResponse.json({ token: null });
}
