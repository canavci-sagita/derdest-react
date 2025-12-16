"use server";

import { apiFetch } from "@/lib/api-fetch";
import { TokenResponse } from "../auth/auth.types";
import { ApiResponseOf } from "../common/ApiResponse";
import {
  BuyCreditsRequest,
  InvoiceDto,
  VerifyPaymentRequest,
} from "./payments.types";

const PAYMENTS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Payments`;

/**
 * Calls the API to verify a Stripe subscription payment using the session ID.
 * If verification is successful, the backend creates the subscription record
 * and returns an authentication token for auto-login.
 * @param request The request object containing the Stripe Session ID.
 */
export const verifyPayment = async (
  request: VerifyPaymentRequest
): Promise<ApiResponseOf<TokenResponse>> => {
  return await apiFetch(`${PAYMENTS_ENDPOINT}/VerifyPayment`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Initiates the credit purchase process.
 * @param request The buy credits request containing quantity and redirect URL.
 * @returns A promise resolving to the Stripe Checkout URL (string).
 */
export const buyCredits = async (
  request: BuyCreditsRequest
): Promise<ApiResponseOf<string>> => {
  return await apiFetch(`${PAYMENTS_ENDPOINT}/BuyCredits`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Fetches the user's payment history (invoices).
 */
export const getAllPayments = async (): Promise<
  ApiResponseOf<InvoiceDto[]>
> => {
  return await apiFetch(`${PAYMENTS_ENDPOINT}/GetAllPayments`, {
    method: "GET",
  });
};
