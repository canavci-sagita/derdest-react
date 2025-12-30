"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllLanguagesAction } from "@/actions/lookups.actions";
import { LanguageLookupResponse } from "@/services/lookups/lookups.types";

export const useLanguages = () => {
  return useQuery<LanguageLookupResponse[], Error>({
    queryKey: ["languages"],
    queryFn: () => getAllLanguagesAction(),
  });
};
