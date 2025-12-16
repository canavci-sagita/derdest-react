"use client";

import { useState, useEffect } from "react";
import { CountryLookupResponse } from "@/services/lookups/lookups.types";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";
import { useCountries } from "./tanstack/useCountries";

export function usePhoneNo(
  value?: AddEditPhoneNoDto | null,
  onChange?: (value: AddEditPhoneNoDto | null) => void
) {
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();

  const [selectedCountry, setSelectedCountry] =
    useState<CountryLookupResponse | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (countries.length > 0) {
      if (value && value.countryCode) {
        const bestMatch = countries.find(
          (c) => `+${c.phoneCode}` === value.countryCode
        );
        setSelectedCountry(bestMatch || null);
      } else {
        setSelectedCountry(null);
      }
      setPhoneNumber(value?.value || "");
    }
  }, [value, countries]);

  const handleCountryChange = (countryCode: string | null | undefined) => {
    if (countryCode) {
      const country = countries.find((c) => c.countryCode === countryCode);
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber("");
        onChange?.({ countryCode: `+${country.phoneCode}`, value: "" });
      }
    } else {
      setSelectedCountry(null);
      setPhoneNumber("");
      onChange?.(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    onChange?.({
      countryCode: selectedCountry ? `+${selectedCountry.phoneCode}` : null,
      value: newPhoneNumber,
    });
  };

  return {
    countries,
    isLoadingCountries,
    selectedCountry,
    phoneNumber,
    handleCountryChange,
    handlePhoneChange,
  };
}
