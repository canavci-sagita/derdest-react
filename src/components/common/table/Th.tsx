"use client";

import { twMerge } from "tailwind-merge";
import React from "react";
import { useTableContext, useTheadContext } from "./table.context";

type ThProps = React.ComponentPropsWithoutRef<"th">;

export const Th: React.FC<ThProps> = ({ className, ...props }) => {
  const table = useTableContext();
  const thead = useTheadContext();
  return (
    <th
      className={twMerge([
        "bg-slate-100 border-slate-200/60 text-slate-500 dark:bg-darkmode-400",
        "font-medium py-4 px-5 border-b-2 dark:border-darkmode-300",
        thead.variant === "light" && "border-b-0 text-slate-700",
        thead.variant === "dark" && "border-b-0",
        table.bordered && "border-l border-r border-t",
        table.sm && "px-4 py-2",
        className,
      ])}
      {...props}
    />
  );
};
