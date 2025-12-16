"use client";

import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { DataTableProvider, useDataTable } from "@/stores/DataTableContext";
import cssClasses from "./DataTable.module.css";
import { twMerge } from "tailwind-merge";

const DataTableGrid = <T extends { id: number }>({
  columns,
  ...rest
}: TableProps<T>) => {
  const { data, loading, pagination, sorter, handleTableChange } =
    useDataTable<T>();

  return (
    <div className="relative overflow-auto xl:overflow-visible">
      <Table
        columns={columns?.map((col) => ({
          ...col,
          sortOrder: sorter && sorter.field === col.key ? sorter.order : null,
        }))}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
        size="middle"
        rowKey="id"
        bordered
        rootClassName={cssClasses["data-grid"]}
        {...rest}
      />
    </div>
  );
};

const DataTableHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const defaultClass =
    "w-full flex flex-col gap-y-2 p-4 sm:flex-row justify-between sm:items-center";
  return <div className={twMerge([defaultClass, className])}>{children}</div>;
};

export const DataTable = Object.assign(DataTableProvider, {
  Header: DataTableHeader,
  Grid: DataTableGrid,
});
