"use server";

import { getErrorResponse } from "@/lib/utils/error.utils";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import {
  getAllSubscriptionPlans,
  getCreditOptions,
} from "@/services/products/products.service";
import {
  CreditOptionsResponse,
  StripeProductDto,
} from "@/services/products/products.types";

export const getAllSubscriptionPlansAction = async (): Promise<
  ApiResponseOf<StripeProductDto[]>
> => {
  try {
    return await getAllSubscriptionPlans();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};

export const getCreditOptionsAction = async (): Promise<
  ApiResponseOf<CreditOptionsResponse[]>
> => {
  try {
    return await getCreditOptions();
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};
