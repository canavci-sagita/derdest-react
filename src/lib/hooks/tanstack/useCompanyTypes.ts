"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCompanyTypesAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";

export const useCompanyTypes = () => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["company-types"],
    queryFn: () => getAllCompanyTypesAction(),
  });
};
