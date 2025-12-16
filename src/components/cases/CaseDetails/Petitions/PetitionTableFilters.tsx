"use client";

import React, { useState } from "react";
import {
  CaseFilterRequest,
  PetitionFilterRequest,
} from "@/services/cases/cases.types";
import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import FormLabel from "@/components/common/forms/FormLabel";
import FormSelect from "@/components/common/forms/FormSelect";
import Button from "@/components/common/ui/Button";
import dayjs from "dayjs";
import { usePetitionTypes } from "@/lib/hooks/tanstack/usePetitionTypes";
import { useApprovalStatuses } from "@/lib/hooks/tanstack/useApprovalStatuses";

const { RangePicker } = DatePicker;

interface PetitionTableFiltersProps {
  appliedFilters: PetitionFilterRequest;
  onApply: (newFilters: CaseFilterRequest) => void;
  onClear: () => void;
}

const PetitionTableFilters: React.FC<PetitionTableFiltersProps> = ({
  appliedFilters,
  onApply,
  onClear,
}) => {
  const { data: petitionTypes, isLoading: isLoadingPetitionTypes } =
    usePetitionTypes();
  const { data: approvalStatuses, isLoading: isLoadingApprovalStatuses } =
    useApprovalStatuses();

  const [localFilters, setLocalFilters] = useState(appliedFilters);

  const handleLocalChange = (
    key: keyof PetitionFilterRequest,
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

  const handleDateChange: RangePickerProps["onChange"] = (
    dates,
    dateStrings
  ) => {
    handleLocalChange("startDate", dateStrings[0] || null);
    handleLocalChange("endDate", dateStrings[1] || null);
  };

  const dateRangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [
    localFilters.startDate ? dayjs(localFilters.startDate) : null,
    localFilters.endDate ? dayjs(localFilters.endDate) : null,
  ];

  const handleClear = () => {
    setLocalFilters({});

    onClear();
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <FormLabel htmlFor="dateRange" localizedLabel="dateRange" />
        <RangePicker
          id="dateRange"
          allowClear
          allowEmpty
          onChange={handleDateChange}
          value={dateRangeValue}
        />
      </div>
      <div>
        <FormLabel htmlFor="petitionTypeId" localizedLabel="petitionType" />
        <FormSelect
          id="petitionTypeId"
          options={petitionTypes}
          showSearch
          allowClear
          loading={isLoadingPetitionTypes}
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={localFilters.petitionTypeId}
          onChange={(value) => handleLocalChange("petitionTypeId", value)}
        />
      </div>
      <div>
        <FormLabel htmlFor="approvalStatus" localizedLabel="approvalStatus" />
        <FormSelect
          id="approvalStatus"
          options={approvalStatuses}
          showSearch
          allowClear
          loading={isLoadingApprovalStatuses}
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={localFilters.status}
          onChange={(value) => handleLocalChange("status", value)}
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

export default PetitionTableFilters;
