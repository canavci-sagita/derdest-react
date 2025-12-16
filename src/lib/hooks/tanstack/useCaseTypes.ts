"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCaseTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";

export const useCaseTypes = () => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["case-types"],
    queryFn: () => getAllCaseTypesForLookupAction(),
  });
};
