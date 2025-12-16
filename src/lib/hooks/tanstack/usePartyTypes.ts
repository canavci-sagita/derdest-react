"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllPartyTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";

export const usePartyTypes = () => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["party-types"],
    queryFn: () => getAllPartyTypesForLookupAction(),
  });
};
