"use client";

import React, { useState } from "react";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import Button from "@/components/common/ui/Button";
import { PartyFilterRequest } from "@/services/cases/cases.types";
import { usePartyTypes } from "@/lib/hooks/tanstack/usePartyTypes";
import { useCountryCity } from "@/lib/hooks/useCountryCity";

interface PartyTableFiltersProps {
  appliedFilters: PartyFilterRequest;
  onApply: (newFilters: PartyFilterRequest) => void;
  onClear: () => void;
}

const PartyTableFilters: React.FC<PartyTableFiltersProps> = ({
  appliedFilters,
  onApply,
  onClear,
}) => {
  const { countries, cities, isLoadingCities, handleCountryChange } =
    useCountryCity();
  const { data: partyTypes = [] } = usePartyTypes();

  const [localFilters, setLocalFilters] = useState(appliedFilters);

  const handleLocalChange = (key: keyof PartyFilterRequest, value: unknown) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]:
        value === null || value === undefined || value === ""
          ? undefined
          : value,
    }));
  };

  const handleClear = () => {
    setLocalFilters({});
    handleCountryChange(null);

    onClear();
  };

  const onCountrySelect = (countryLabel: string | null) => {
    handleLocalChange("country", countryLabel);
    handleLocalChange("city", null);

    handleCountryChange(countryLabel);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <FormLabel htmlFor="partyType" localizedLabel="partyType" />
        <FormSelect
          id="partyType"
          options={partyTypes}
          showSearch
          allowClear
          value={localFilters.partyTypeId}
          onChange={(value) => handleLocalChange("partyTypeId", value)}
        />
      </div>
      <div>
        <FormLabel htmlFor="country" localizedLabel="country" />
        <FormSelect
          id="country"
          options={countries}
          fieldNames={{ value: "label" }}
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={localFilters.country}
          onChange={onCountrySelect}
        />
      </div>
      <div>
        <FormLabel htmlFor="city" localizedLabel="city" />
        <FormSelect
          id="city"
          options={cities}
          fieldNames={{ value: "label" }}
          showSearch
          allowClear
          loading={isLoadingCities}
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          disabled={!localFilters.country}
          value={localFilters.city}
          onChange={(value) => handleLocalChange("city", value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
        <Button
          variant="outline-primary"
          localizedLabel="clear"
          onClick={handleClear}
        />
        <Button
          variant="primary"
          localizedLabel="filter"
          onClick={() => onApply(localFilters)}
        />
      </div>
    </div>
  );
};

export default PartyTableFilters;
