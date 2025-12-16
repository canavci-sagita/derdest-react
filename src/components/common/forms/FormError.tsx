"use client";

import { FC } from "react";
import { twMerge } from "tailwind-merge";

type FormErrorProps = {
  className?: string;
  errors?: { _errors?: string[] };
};

const FormError: FC<FormErrorProps> = ({ className, errors }) => {
  if (!errors?._errors || errors._errors.length === 0) {
    return null;
  }
  return (
    <div className={twMerge("mt-1 text-xs text-red-500", className)}>
      {errors._errors[0]}
    </div>
  );
};

export default FormError;
