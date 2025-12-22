"use server";

import { apiFetchApiResponse } from "@/lib/api-fetch";
import { ApiResponseOf } from "../common/ApiResponse";
import { CreditOptionsResponse, StripeProductDto } from "./products.types";

const PRODUCTS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Products`;

/**
 * Fetches a product list of subscription plans.
 * @returns A response object containing stripe product object.
 */
export const getAllSubscriptionPlans = async (): Promise<
  ApiResponseOf<StripeProductDto[]>
> => {
  return await apiFetchApiResponse(
    `${PRODUCTS_ENDPOINT}/GetAllSubscriptionPlans`,
    {
      method: "GET",
    }
  );
};

/**
 * Fetches the petition credit price.
 * @returns A response object containing price.
 */
export const getCreditOptions = async (): Promise<
  ApiResponseOf<CreditOptionsResponse[]>
> => {
  return await apiFetchApiResponse(`${PRODUCTS_ENDPOINT}/GetCreditOptions`, {
    method: "GET",
  });
};
