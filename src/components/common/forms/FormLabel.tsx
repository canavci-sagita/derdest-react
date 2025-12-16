"use client";

import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { formInlineContext } from "./FormInline";
import { useTranslation } from "@/stores/TranslationContext";

type FormLabelProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"label"> & {
    localizedLabel?: string;
    required?: boolean;
  };

const FormLabel = (props: FormLabelProps) => {
  const { t } = useTranslation();
  const formInline = useContext(formInlineContext);

  const { localizedLabel, required, ...rest } = props;

  return (
    <label
      className={twMerge([
        "block mb-[1.5] text-xs font-medium text-theme-1",
        formInline && "mb-2 sm:mb-0 sm:mr-5 sm:text-right",
        rest.className,
      ])}
      {...rest}
    >
      {localizedLabel && t(localizedLabel)}
      {required && <span className="text-danger">*</span>}
      {rest.children}
    </label>
  );
};

export default FormLabel;
