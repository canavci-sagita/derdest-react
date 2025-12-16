"use server";

import {
  buyCredits,
  getAllPayments,
  verifyPayment,
} from "@/services/payments/payments.service";
import {
  ApiResponseFactory,
  ApiResponseOf,
} from "@/services/common/ApiResponse";
import { TokenResponse } from "@/services/auth/auth.types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";
import { InvoiceDto } from "@/services/payments/payments.types";
import { getErrorMessage, getErrorResponse } from "@/lib/utils/error.utils";

export const verifyPaymentAction = async (
  sessionId: string
): Promise<ApiResponseOf<TokenResponse>> => {
  try {
    const response = await verifyPayment({ sessionId });

    if (response.result?.token) {
      const { token } = response.result;

      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expiresAt = new Date(decodedToken.exp * 1000);

      const cookiesObj = await cookies();
      cookiesObj.set(COOKIE_CONSTANTS.AUTH_TOKEN, response.result.token, {
        httpOnly: true,
        secure: true, //process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: expiresAt,
      });
    }

    return response;
  } catch (error: unknown) {
    //TODO: Will be optimized.
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    const message = getErrorMessage(error);
    return ApiResponseFactory.errorWithMessage(message);
  }
};

export const buyCreditsAction = async (
  quantity: number,
  redirectUrl: string
): Promise<ApiResponseOf<string>> => {
  try {
    return await buyCredits({ quantity, redirectUrl });
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getAllPaymentsAction = async (): Promise<
  ApiResponseOf<InvoiceDto[]>
> => {
  try {
    return await getAllPayments();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};
