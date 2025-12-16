"use client";

import { twMerge } from "tailwind-merge";
import React from "react";
import { theadContext, TheadContextType } from "./table.context";

interface TheadProps
  extends React.ComponentPropsWithoutRef<"thead">,
    TheadContextType {}

export const Thead: React.FC<TheadProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  return (
    <theadContext.Provider value={{ variant }}>
      <thead
        className={twMerge([
          variant === "light" && "bg-slate-200/60 dark:bg-slate-200",
          variant === "dark" && "bg-dark text-white dark:bg-black/30",
          className,
        ])}
        {...props}
      >
        {children}
      </thead>
    </theadContext.Provider>
  );
};
