"use client";

import React from "react";
import CountryFlag from "react-country-flag";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "@/stores/TranslationContext";
import FormInput from "../FormInput";
import { usePhoneNo } from "@/lib/hooks/usePhoneNo";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";
import { Select } from "antd";

import cssClasses from "./FormPhone.module.css";

interface FormPhoneProps {
  value?: AddEditPhoneNoDto | null;
  className?: string;
  onChange?: (value: AddEditPhoneNoDto | null) => void;
  onBlur?: () => void;
}

const FormPhone: React.FC<FormPhoneProps> = ({
  value,
  className,
  onChange,
  onBlur,
}) => {
  const { t } = useTranslation();

  const {
    countries,
    selectedCountry,
    phoneNumber,
    handleCountryChange,
    handlePhoneChange,
  } = usePhoneNo(value, onChange);

  return (
    <div
      className={twMerge(
        "h-[32px] grid grid-cols-5 gap-0 border border-slate-300/60 rounded shadow-sm hover:border-theme-1 ",
        className
      )}
    >
      <Select
        style={{ width: "120px" }}
        className="rounded border-r-0 col-span-2"
        rootClassName={cssClasses["phoneCode-select"]}
        placeholder={t("countryCode")}
        showSearch
        allowClear
        filterOption={(input, option) => {
          const labelMatch = (option?.countryCode ?? "")
            .toLowerCase()
            .includes(input.toLowerCase());
          const codeMatch = `+${option?.countryCode}`.includes(input);
          return labelMatch || codeMatch;
        }}
        options={countries.map((country) => ({
          value: country.countryCode,
          label: country.label,
          countryCode: country.countryCode,
          phoneCode: country.phoneCode,
        }))}
        optionRender={(option) => (
          <div className="flex items-center">
            <CountryFlag
              countryCode={option.value as string}
              svg
              style={{ marginRight: 6, height: "1.2em" }}
            />
            <span className="font-semibold mr-1">
              {option.data.countryCode}
            </span>
            (+{option.data.phoneCode})
          </div>
        )}
        labelRender={(props) => {
          const country = countries.find((c) => c.countryCode === props.value);
          if (!country) return null;
          return (
            <div className="flex items-center">
              <CountryFlag
                countryCode={country.countryCode}
                svg
                style={{ marginRight: 8, width: "1.2em", height: "1.2em" }}
              />
              <span className="font-semibold">{country.countryCode}</span>
              (+{country.phoneCode})
            </div>
          );
        }}
        value={selectedCountry?.countryCode}
        onChange={handleCountryChange}
      />
      <FormInput
        rootClassName="w-full col-span-3"
        className="text-xs pt-[0.45rem] h-[30px] shadow-none rounded rounded-l-none border-0 hover:border-slate-300/60 focus:border-slate-300/60 placeholder:text-gray-400/60"
        mask={
          selectedCountry?.phoneFormat
            .replace(`+{${selectedCountry.phoneCode}}`, "")
            .trimEnd() || "0000000000"
        }
        placeholder={t("phoneNumber")}
        value={phoneNumber}
        onChange={handlePhoneChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default FormPhone;
