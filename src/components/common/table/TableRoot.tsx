"use client";

import { twMerge } from "tailwind-merge";
import React from "react";
import { tableContext, TableContextType } from "./table.context";

interface TableProps
  extends React.ComponentPropsWithoutRef<"table">,
    TableContextType {}

export const TableRoot: React.FC<TableProps> = ({
  className,
  dark,
  bordered,
  hover,
  striped,
  sm,
  children,
  ...props
}) => {
  return (
    <tableContext.Provider value={{ dark, bordered, hover, striped, sm }}>
      <table
        className={twMerge([
          "w-full text-left",
          dark && "bg-dark text-white dark:bg-black/30",
          className,
        ])}
        {...props}
      >
        {children}
      </table>
    </tableContext.Provider>
  );
};
