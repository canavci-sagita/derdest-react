"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllClientsForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";

export const useClientsLookup = () => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["clients-lookup"],
    queryFn: () => getAllClientsForLookupAction(),
  });
};
