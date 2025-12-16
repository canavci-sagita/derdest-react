"use client";

import React, { useState } from "react";
import { ClientFilterRequest } from "@/services/clients/clients.types";
import Button from "../common/ui/Button";
import FormLabel from "../common/forms/FormLabel";
import FormSelect from "../common/forms/FormSelect";
import { useCompanyTypes } from "@/lib/hooks/tanstack/useCompanyTypes";
import { useCountryCity } from "@/lib/hooks/useCountryCity";

interface ClientTableFiltersProps {
  appliedFilters: ClientFilterRequest;
  onApply: (newFilters: ClientFilterRequest) => void;
  onClear: () => void;
}

const ClientTableFilters: React.FC<ClientTableFiltersProps> = ({
  appliedFilters,
  onApply,
  onClear,
}) => {
  const { countries, cities, isLoadingCities, handleCountryChange } =
    useCountryCity();
  const { data: companyTypes = [] } = useCompanyTypes();

  const [localFilters, setLocalFilters] = useState(appliedFilters);

  const handleLocalChange = (
    key: keyof ClientFilterRequest,
    value: unknown
  ) => {
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
        <FormLabel htmlFor="clientType" localizedLabel="clientType" />
        <FormSelect
          id="clientType"
          options={companyTypes}
          showSearch
          allowClear
          value={localFilters.clientType}
          onChange={(value) => handleLocalChange("clientType", value)}
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

export default ClientTableFilters;
