"use client";

import { getCreditOptionsAction } from "@/actions/products.actions";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import { CreditOptionsResponse } from "@/services/products/products.types";
import { useQuery } from "@tanstack/react-query";

export const useCreditOptions = () => {
  return useQuery<
    ApiResponseOf<CreditOptionsResponse[]>,
    Error,
    CreditOptionsResponse[]
  >({
    queryKey: ["credit-options"],
    queryFn: () => getCreditOptionsAction(),
    select: (response) => response.result ?? [],
  });
};
