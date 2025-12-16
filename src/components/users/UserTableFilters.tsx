"use client";

import React, { useState } from "react";
import Button from "../common/ui/Button";
import FormLabel from "../common/forms/FormLabel";
import FormSelect from "../common/forms/FormSelect";
import { useTranslation } from "@/stores/TranslationContext";
import { UserFilterRequest } from "@/services/users/users.types";
import { ROLE_CONSTANTS } from "@/lib/constants/role.constants";
import { useLawFirms } from "@/lib/hooks/tanstack/useLawFirms";
import { useCountryCity } from "@/lib/hooks/useCountryCity";

interface UserTableFiltersProps {
  appliedFilters: UserFilterRequest;
  role: string;
  onApply: (newFilters: UserFilterRequest) => void;
  onClear: () => void;
}

const UserTableFilters: React.FC<UserTableFiltersProps> = ({
  appliedFilters,
  role,
  onApply,
  onClear,
}) => {
  const { t } = useTranslation();

  const { countries, cities, isLoadingCities, handleCountryChange } =
    useCountryCity();
  const { data: lawFirms = [] } = useLawFirms(
    role === ROLE_CONSTANTS.SUPER_ADMIN
  );

  const [localFilters, setLocalFilters] = useState(appliedFilters);

  const handleLocalChange = (key: keyof UserFilterRequest, value: unknown) => {
    let finalValue = value ?? null;

    if (key === "isActive" || key === "emailConfirmed") {
      if (value === 1) {
        finalValue = true;
      } else if (value === 0) {
        finalValue = false;
      } else {
        finalValue = null;
      }
    }
    setLocalFilters((prev) => ({
      ...prev,
      [key]:
        finalValue === null || finalValue === undefined || finalValue === ""
          ? undefined
          : finalValue,
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
      {role === ROLE_CONSTANTS.SUPER_ADMIN && (
        <div>
          <FormLabel htmlFor="lawFirm" localizedLabel="lawFirm" />
          <FormSelect
            id="lawFirm"
            options={lawFirms}
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            value={localFilters.lawFirmId}
            onChange={(value) => handleLocalChange("lawFirmId", value)}
          />
        </div>
      )}
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
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          loading={isLoadingCities}
          disabled={!localFilters.country || isLoadingCities}
          value={localFilters.city}
          onChange={(value) => handleLocalChange("city", value)}
        />
      </div>
      <div>
        <FormLabel htmlFor="isActive" localizedLabel="accountStatus" />
        <FormSelect
          id="isActive"
          allowClear
          options={[
            { label: t("active"), value: 1 },
            { label: t("passive"), value: 0 },
          ]}
          value={
            localFilters.isActive === true
              ? 1
              : localFilters.isActive === false
              ? 0
              : null
          }
          onChange={(value) => handleLocalChange("isActive", value)}
        />
      </div>
      <div>
        <FormLabel htmlFor="emailConfirmed" localizedLabel="emailConfirmed" />
        <FormSelect
          id="emailConfirmed"
          allowClear
          options={[
            { label: t("yes"), value: 1 },
            { label: t("no"), value: 0 },
          ]}
          value={
            localFilters.emailConfirmed === true
              ? 1
              : localFilters.emailConfirmed === false
              ? 0
              : null
          }
          onChange={(value) => handleLocalChange("emailConfirmed", value)}
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

export default UserTableFilters;
