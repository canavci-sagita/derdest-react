"use client";

import { twMerge } from "tailwind-merge";
import React from "react";
import { useTableContext } from "./table.context";

type TrProps = React.ComponentPropsWithoutRef<"tr">;

export const Tr: React.FC<TrProps> = ({ className, ...props }) => {
  const { hover, striped } = useTableContext();
  return (
    <tr
      className={twMerge([
        hover && "[&:hover_td]:bg-slate-100 [&:hover_td]:dark:bg-darkmode-300",
        striped &&
          "[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300",
        className,
      ])}
      {...props}
    />
  );
};
