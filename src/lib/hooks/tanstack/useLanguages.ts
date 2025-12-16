"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllLanguagesAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";

export const useLanguages = () => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["languages"],
    queryFn: () => getAllLanguagesAction(),
  });
};
