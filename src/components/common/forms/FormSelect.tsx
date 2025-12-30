"use client";

import React from "react";
import { Select, type SelectProps } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { twMerge } from "tailwind-merge";

export interface FormSelectProps extends SelectProps {
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  loading,
  placeholder,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  const selectPlaceholder = placeholder ?? t("select");

  const wrapperClasses = twMerge([
    "relative flex items-center hover:border-primary",
    "disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-700/50",
    "transition duration-200 ease-in-out text-sm border-slate-300/60 shadow-sm rounded-md",
    className,
  ]);

  return (
    <div className={wrapperClasses}>
      <Select
        placeholder={selectPlaceholder}
        variant="outlined"
        {...props}
        className={twMerge("!w-full !h-full !bg-transparent", className)}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        loading={loading}
        labelRender={(o) => {
          return loading ? (
            <span className="text-slate-400">{t("loading")}</span>
          ) : (
            o.label
          );
        }}
      />
    </div>
  );
};

export default FormSelect;
