"use client";

import React, { useContext, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { formInlineContext } from "./FormInline";
import { inputGroupContext } from "./InputGroup";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon, { AppIconName } from "../ui/AppIcon";
import { IMaskInput } from "react-imask";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  rootClassName?: string;
  formInputSize?: "sm" | "lg";
  rounded?: boolean;
  localizedPlaceholder?: string;
  icon?: AppIconName;
  mask?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      formInputSize,
      rounded,
      rootClassName,
      className,
      localizedPlaceholder,
      icon,
      mask,
      min,
      max,
      value,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    const formInline = useContext(formInlineContext);
    const inputGroup = useContext(inputGroupContext);

    const placeholder = localizedPlaceholder
      ? t(localizedPlaceholder)
      : props.placeholder;

    const inputsize = formInputSize ?? "sm";
    const inputClass = twMerge([
      "disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-700/50",
      "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-700/50",
      "transition duration-200 ease-in-out w-full text-sm border-slate-300/60 shadow-sm rounded-md placeholder:text-slate-400/90",
      "focus:ring-0 focus:border-gray-400 hover:border-theme-1",
      inputsize === "sm" && "py-[0.315rem] px-2",
      inputsize === "lg" && "py-2 px-4",
      rounded && "rounded-full",
      formInline && "flex-1",
      inputGroup &&
        "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r z-10",
      className,
      icon && "pl-9",
    ]);

    const InputComponent = mask ? (
      <IMaskInput
        mask={mask}
        inputRef={ref as React.Ref<HTMLInputElement>}
        name={props.id ?? props.name}
        className={inputClass}
        placeholder={placeholder}
        min={min as number}
        max={max as number}
        value={String(value ?? "")}
        {...props}
      />
    ) : (
      <input
        ref={ref}
        name={props.id ?? props.name}
        className={inputClass}
        placeholder={placeholder}
        min={min}
        max={max}
        {...props}
      />
    );

    return (
      <div className={twMerge([rootClassName, icon ? "relative" : ""])}>
        {icon && (
          <AppIcon
            icon={icon}
            className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
          />
        )}
        {InputComponent}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
