"use server";

import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { ApiResponse, ApiResponseOf } from "../common/ApiResponse";
import {
  ChangePasswordRequest,
  CompleteInvitationRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  TokenResponse,
  VerifyInvitationRequest,
  VerifyInvitationResponse,
  VerifyUserRequest,
} from "./auth.types";
import { cookies } from "next/headers";
import { apiFetchApiResponse } from "@/lib/api-fetch";

const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const setRefreshToken = async (response: Response): Promise<void> => {
  const setCookieHeader = response.headers.get("set-cookie");
  if (!setCookieHeader) {
    return;
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

  if (refreshToken) {
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_CONSTANTS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: refreshExpires,
    });
  }
};

/**
 * Calls the backend API to authenticate a user.
 * @param credentials The user's email and password.
 * @returns The API response, including the JWT on success.
 */
export const signIn = async (
  credentials: SignInRequest
): Promise<ApiResponseOf<SignInResponse>> => {
  const response = await fetch(`${AUTH_ENDPOINT}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  await setRefreshToken(response);

  return await response.json();
};

export const refreshToken = async (headers: Headers) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/RefreshToken`, {
    method: "POST",
    credentials: "include",
    headers: headers,
  });
};

/**
 * Calls the API to register a new user.
 * @param request The SignUpRequest DTO.
 * @returns ApiResponse of encrypted verification token
 */
export const signUp = async (
  request: SignUpRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${AUTH_ENDPOINT}/SignUp`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Calls the API to verify a new user's account.
 * @param request The verification request DTO.
 * @returns ApiResponse of stripe checkout session response.
 */
export const verifyUser = async (
  request: VerifyUserRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${AUTH_ENDPOINT}/Verify`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Calls the API to resend a verification code.
 * @param token The token created by API to verify user identity.
 * @returns ApiResponse of stripe checkout session response.
 */
export const resendVerificationCode = async (
  token: string
): Promise<ApiResponseOf<string>> => {
  return await apiFetchApiResponse(`${AUTH_ENDPOINT}/ResendVerificationCode`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

/**
 * Changes the authenticated user's password.
 */
export const changePassword = async (
  request: ChangePasswordRequest
): Promise<ApiResponse> => {
  return await apiFetchApiResponse(`${AUTH_ENDPOINT}/ChangePassword`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Verifies the invitation sent to the user.
 */
export const verifyInvitation = async (
  data: VerifyInvitationRequest
): Promise<ApiResponseOf<VerifyInvitationResponse>> => {
  return await apiFetchApiResponse(`${AUTH_ENDPOINT}/VerifyInvitation`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Completes the invitation request with the information user provided.
 */
export const completeInvitation = async (
  data: CompleteInvitationRequest
): Promise<ApiResponseOf<TokenResponse>> => {
  return await apiFetchApiResponse(`${AUTH_ENDPOINT}/CompleteInvitation`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
