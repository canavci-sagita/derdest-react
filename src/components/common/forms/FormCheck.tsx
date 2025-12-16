"use client";

import { useTranslation } from "@/stores/TranslationContext";
import { twMerge } from "tailwind-merge";

export interface FormCheckProps
  extends React.PropsWithChildren<React.InputHTMLAttributes<HTMLInputElement>> {
  type: "checkbox" | "radio";
  localizedLabel: string;
  labelClass?: string;
}

const FormCheck = (props: FormCheckProps) => {
  const { type, labelClass, localizedLabel, ...rest } = props;
  const { t } = useTranslation();
  return (
    <div className={twMerge(["flex items-center"])}>
      <input
        type={type}
        id={props.name}
        name={props.name}
        className={twMerge([
          "transition-all duration-100 ease-in-out",
          type == "radio" &&
            "shadow-sm border-slate-300/80 cursor-pointer ring-0 focus:ring-0 focus:ring-offset-0 dark:bg-darkmode-700",
          type == "checkbox" &&
            "shadow-sm border-slate-300/80 cursor-pointer ring-0 rounded focus:ring-0 focus:ring-offset-0 dark:bg-darkmode-700",
          "[&[type='radio']]:checked:bg-primary/60 [&[type='radio']]:checked:border-primary/50 [&[type='radio']]:checked:border-opacity-10",
          "[&[type='checkbox']]:checked:bg-primary/60 [&[type='checkbox']]:checked:border-primary/50 [&[type='checkbox']]:checked:border-opacity-10",
          "[&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-700/50",
          "[&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-700/50",
          props.className,
        ])}
        {...rest}
      />
      <label
        htmlFor={props.id}
        className={twMerge(["cursor-pointer ml-2", labelClass])}
      >
        {t(localizedLabel)}
      </label>
    </div>
  );
};

export default FormCheck;
