"use client";

import { twMerge } from "tailwind-merge";
import React from "react";
import { useTableContext } from "./table.context";

type TdProps = React.ComponentPropsWithoutRef<"td">;

export const Td: React.FC<TdProps> = ({ className, ...props }) => {
  const { bordered, sm } = useTableContext();
  return (
    <td
      className={twMerge([
        "py-4 border-dashed w-80 dark:bg-darkmode-600",
        "px-5 border-b dark:border-darkmode-300",
        bordered && "border-l border-r border-t",
        sm && "px-4 py-2",
        className,
      ])}
      {...props}
    />
  );
};
