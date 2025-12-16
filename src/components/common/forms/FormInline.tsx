"use client";

import React, { createContext } from "react";
import { twMerge } from "tailwind-merge";

interface FormInlineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const formInlineContext = createContext<boolean>(false);

const FormInline: React.FC<FormInlineProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <formInlineContext.Provider value={true}>
      <div
        className={twMerge("block sm:flex items-center", className)}
        {...props}
      >
        {children}
      </div>
    </formInlineContext.Provider>
  );
};

export default FormInline;
