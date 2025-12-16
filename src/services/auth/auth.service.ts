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
import { apiFetch } from "@/lib/api-fetch";

const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

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

  const setCookieHeader = response.headers.get("set-cookie");
  let refreshToken = "";
  let refreshExpires: Date | undefined = undefined;

  if (setCookieHeader) {
    const parts = setCookieHeader.split(";");
    const tokenPart = parts.find((p: string) =>
      p.trim().startsWith(`${COOKIE_CONSTANTS.REFRESH_TOKEN}=`)
    );
    if (tokenPart) {
      refreshToken = tokenPart.split("=")[1];
    }
    const expiresPart = parts.find((p: string) =>
      p.trim().toLowerCase().startsWith("expires=")
    );
    if (expiresPart) {
      refreshExpires = new Date(expiresPart.split("=")[1]);
    }
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

  return await response.json();
};

/**
 * Calls the backend API to refresh an expired authentication token.
 * @param currentToken The expired JWT.
 * @returns A promise that resolves to the new sign-in response (with a new token), or null on failure.
 */
export const refreshToken = async (
  token: string,
  cookieHeader: string | null
): Promise<ApiResponseOf<SignInResponse> | null> => {
  return await apiFetch(`${AUTH_ENDPOINT}/refreshToken`, {
    skipSession: true, //NOTE: If we don't specify this, than it goes infinite loop.
    method: "POST",
    headers: {
      Cookie: cookieHeader || "",
    },
    body: JSON.stringify({ token: token }),
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
  return await apiFetch(`${AUTH_ENDPOINT}/SignUp`, {
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
  return await apiFetch(`${AUTH_ENDPOINT}/Verify`, {
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
  return await apiFetch(`${AUTH_ENDPOINT}/ResendVerificationCode`, {
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
  return await apiFetch(`${AUTH_ENDPOINT}/ChangePassword`, {
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
  return await apiFetch(`${AUTH_ENDPOINT}/VerifyInvitation`, {
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
  return await apiFetch(`${AUTH_ENDPOINT}/CompleteInvitation`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
