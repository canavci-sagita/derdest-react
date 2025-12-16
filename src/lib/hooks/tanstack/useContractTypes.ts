"use client";

import { getAllContractTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useContractTypes = <TData>(
  options?: Omit<
    UseQueryOptions<LookupResponse[], unknown, TData>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["lookup", "contract-types"],
    queryFn: getAllContractTypesForLookupAction,
    ...options,
  });
};
