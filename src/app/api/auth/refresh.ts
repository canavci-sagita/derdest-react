import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/services/auth/auth.service";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_CONSTANTS.AUTH_TOKEN)?.value;

  if (!token) {
    return Response.json({ isSuccess: false }, { status: 401 });
  }

  const cookieHeader = cookieStore.toString();
  const backendResponse = await refreshToken(token, cookieHeader);

  if (!backendResponse?.isSuccess || !backendResponse.result?.token) {
    cookieStore.delete(COOKIE_CONSTANTS.AUTH_TOKEN);

    return Response.json({ isSuccess: false }, { status: 401 });
  }

  const newToken = backendResponse.result.token;
  const decoded = jwtDecode<{ exp: number }>(newToken);
  const expires = new Date(decoded.exp * 1000);

  cookieStore.set(COOKIE_CONSTANTS.AUTH_TOKEN, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires,
  });

  return Response.json({ isSuccess: true, token: newToken });
}
