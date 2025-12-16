"use client";

import { DatePartDto } from "@/services/common/DatePartDto";
import { useTranslation } from "@/stores/TranslationContext";
import React from "react";
import { twMerge } from "tailwind-merge";
import FormSelect from "../FormSelect";

import cssClasses from "./FormDatePart.module.css";

interface ImpreciseDateInputProps {
  value: DatePartDto;
  onChange: (newValue: DatePartDto) => void;
  className?: string;
}

const FormDatePart: React.FC<ImpreciseDateInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t, currentLang } = useTranslation();

  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    return {
      value: i + 1,
      label: i + 1,
    };
  });

  //TODO: Will be checked
  // const monthOptions = React.useMemo(() => {
  //   return Array.from({ length: 12 }, (_, i) => {
  //     const date = new Date(2000, i, 15);
  //     const monthName = new Intl.DateTimeFormat(currentLang, {
  //       month: "long",
  //     }).format(date);
  //     return {
  //       value: i + 1,
  //       label: monthName,
  //     };
  //   });
  // }, [currentLang]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 15);
    const monthName = new Intl.DateTimeFormat(currentLang, {
      month: "long",
    }).format(date);
    return {
      value: i + 1,
      label: monthName,
    };
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
    const year = currentYear - i;
    return {
      value: year,
      label: year,
    };
  });
  const handleInputChange = (part: keyof DatePartDto, inputValue: string) => {
    const numericValue = inputValue ? parseInt(inputValue, 10) : null;
    onChange({ ...value, [part]: numericValue });
  };

  return (
    <div className={twMerge("flex justify-end", className)}>
      <FormSelect
        value={value.day}
        onChange={(val) => handleInputChange("day", val)}
        className={cssClasses["datepart-day"]}
        placeholder={t("day")}
        options={dayOptions}
        allowClear
      />
      <FormSelect
        value={value.month}
        onChange={(val) => handleInputChange("month", val)}
        className={cssClasses["datepart-month"]}
        placeholder={t("month")}
        options={monthOptions}
        allowClear
      />
      <FormSelect
        value={value.year}
        onChange={(val) => handleInputChange("year", val)}
        className={cssClasses["datepart-year"]}
        placeholder={t("year")}
        options={yearOptions}
        allowClear
      />
    </div>
  );
};

export default FormDatePart;
