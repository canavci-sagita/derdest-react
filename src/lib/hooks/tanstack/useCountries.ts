"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCountriesAction } from "@/actions/lookups.actions";
import { CountryLookupResponse } from "@/services/lookups/lookups.types";

export const useCountries = () => {
  return useQuery<CountryLookupResponse[], Error>({
    queryKey: ["countries"],
    queryFn: () => getAllCountriesAction(),
  });
};
