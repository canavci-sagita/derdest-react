"use client";

import { useState } from "react";
import { getAllCitiesAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useCountries } from "./tanstack/useCountries";

export function useCountryCity() {
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();
  const [cities, setCities] = useState<LookupResponse[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const handleCountryChange = (countryLabel: string | null) => {
    setCities([]);
    if (countryLabel) {
      const selectedCountry = countries.find((c) => c.label === countryLabel);
      if (selectedCountry) {
        setIsLoadingCities(true);
        getAllCitiesAction(selectedCountry.value).then((response) => {
          if (response) {
            setCities(response);
          }
          setIsLoadingCities(false);
        });
      }
    }
  };

  return {
    countries,
    cities,
    isLoadingCountries,
    isLoadingCities,
    handleCountryChange,
  };
}
