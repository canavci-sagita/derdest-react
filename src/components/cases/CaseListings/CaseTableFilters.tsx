"use client";

import React, { useState } from "react";
import Button from "../../common/ui/Button";
import FormLabel from "../../common/forms/FormLabel";
import FormSelect from "../../common/forms/FormSelect";
import { CaseFilterRequest } from "@/services/cases/cases.types";
import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useCaseTypes } from "@/lib/hooks/tanstack/useCaseTypes";
import { useClientsLookup } from "@/lib/hooks/tanstack/useClientsLookup";

const { RangePicker } = DatePicker;

interface CaseTableFiltersProps {
  appliedFilters: CaseFilterRequest;
  onApply: (newFilters: CaseFilterRequest) => void;
  onClear: () => void;
}

const CaseTableFilters: React.FC<CaseTableFiltersProps> = ({
  appliedFilters,
  onApply,
  onClear,
}) => {
  const { data: clients, isLoading: isLoadingClients } = useClientsLookup();
  const { data: caseTypes, isLoading: isLoadingCaseTypes } = useCaseTypes();

  const [localFilters, setLocalFilters] = useState(appliedFilters);

  const handleLocalChange = (key: keyof CaseFilterRequest, value: unknown) => {
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
        {/* TODO: Date format will be localized. */}
        <RangePicker
          id="dateRange"
          allowClear
          allowEmpty
          onChange={handleDateChange}
          value={dateRangeValue}
        />
      </div>
      <div>
        <FormLabel htmlFor="clientId" localizedLabel="client" />
        <FormSelect
          id="clientId"
          options={clients}
          showSearch
          allowClear
          loading={isLoadingClients}
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={localFilters.clientId}
          onChange={(value) => handleLocalChange("clientId", value)}
        />
      </div>
      <div>
        <FormLabel htmlFor="caseTypeId" localizedLabel="caseType" />
        <FormSelect
          id="caseTypeId"
          options={caseTypes}
          showSearch
          allowClear
          loading={isLoadingCaseTypes}
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={localFilters.caseTypeId}
          onChange={(value) => handleLocalChange("caseTypeId", value)}
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

export default CaseTableFilters;
