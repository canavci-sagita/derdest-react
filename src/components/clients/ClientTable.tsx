"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Avatar, Popconfirm, Popover, Space, Tooltip } from "antd";
import type { TableProps } from "antd";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import { useTranslation } from "@/stores/TranslationContext";
import { DataTable } from "@/components/common/data-table";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import {
  ClientFilterRequest,
  ClientGridDto,
} from "@/services/clients/clients.types";
import {
  deleteClientAction,
  getAllClientsAction,
} from "@/actions/clients.actions";
import { CompanyType } from "@/services/common/enums";
import { lowerCaseFirstLetter } from "@/lib/utils/string.utils";
import { useDebounce } from "@/lib/hooks/useDebounce";
import ClientTableFilters from "./ClientTableFilters";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ClientTableProps {
  initialData: PaginatedResponse<ClientGridDto>;
}

const ClientTable: React.FC<ClientTableProps> = ({ initialData }) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const router = useRouter();

  const [tableKey, setTableKey] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ClientFilterRequest>({
    searchText: "",
  });
  //TODO: Search Text will be handled in filters.searchText.
  //Also will be cleared on handleClearFilters.
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText, 500);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchText" && value != null
  ).length;

  const handleApplyFilters = (newFilters: ClientFilterRequest) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({ searchText: prev.searchText }));
    setIsFilterOpen(false);
  };

  const handleDelete = useCallback(
    async (clientId: number) => {
      const response = await deleteClientAction(clientId);
      if (response.isSuccess) {
        setTableKey((prev) => prev + 1);
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    [message]
  );

  const columns = useMemo<TableProps<ClientGridDto>["columns"]>(
    () => [
      { title: "No", dataIndex: "id", key: "id", width: "10%" },
      {
        title: t("tableHeader.fullName"),
        dataIndex: "fullName",
        key: "fullName",
        sorter: true,
        render: (_, record) => (
          <div className="flex items-center">
            <div className="w-9 h-9">
              <Avatar size={40}>
                {`${record.firstName.substring(
                  0,
                  1
                )}${record.lastName.substring(0, 1)}`}
              </Avatar>
            </div>
            <div className="ml-3.5">
              <Link
                className="font-bold cursor-pointer whitespace-nowrap text-theme-1 hover:text-theme-1"
                href={`/clients/${record.id}`}
              >
                {`${record.firstName} ${record.lastName}`}
              </Link>
              <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                {record.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: t("tableHeader.clientType"),
        dataIndex: "clientType",
        key: "clientType",
        sorter: true,
        render: (clientType: string) => {
          return (
            <Tooltip
              title={t(lowerCaseFirstLetter(clientType))}
              placement="top"
            >
              <AppIcon
                className="m-auto h-5 w-5 stoke-[1] fill-primary/10"
                icon={
                  clientType === CompanyType[CompanyType.Individual]
                    ? "User"
                    : "Building"
                }
              />
            </Tooltip>
          );
        },
      },
      {
        title: t("tableHeader.nationalId"),
        dataIndex: "nationalId",
        key: "nationalId",
        sorter: true,
      },
      {
        title: t("tableHeader.phoneNo"),
        dataIndex: "phoneNo",
        key: "phoneNo",
      },
      {
        title: t("tableHeader.city"),
        dataIndex: "city",
        key: "city",
        sorter: true,
      },
      {
        title: t("tableHeader.country"),
        dataIndex: "country",
        key: "country",
        sorter: true,
      },
      {
        title: t("tableHeader.actions"),
        key: "action",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title={t("edit")} placement="left">
              <Link
                href={`/clients/${record.id}`}
                className="cursor-pointer text-gray-600 flex items-center p-2 rounded-md hover:bg-gray-200/60"
              >
                <AppIcon className="h-4 w-4" icon="SquarePen" />
              </Link>
            </Tooltip>
            <Tooltip title={t("delete")} placement="right">
              <Popconfirm
                title={t("deleteConfirmation.title")}
                description={t("deleteConfirmation.text")}
                onConfirm={() => handleDelete(record.id)}
                okText={t("yes")}
                cancelText={t("no")}
                okButtonProps={{ danger: true }}
              >
                <button className="cursor-pointer text-red-600 flex items-center p-2 rounded-md hover:bg-red-200/60">
                  <AppIcon className="h-4 w-4" icon="Trash2" />
                </button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [t, handleDelete]
  );

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchText: debouncedSearchText }));
  }, [debouncedSearchText]);

  return (
    <DataTable<ClientGridDto>
      reloadTrigger={tableKey}
      fetchAction={getAllClientsAction}
      initialData={initialData}
      initialSort={["fullName asc"]}
      filters={filters}
    >
      <DataTable.Header>
        <Popover
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          content={
            <ClientTableFilters
              appliedFilters={filters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          }
          placement="bottomLeft"
          styles={{
            body: {
              width: 300,
              padding: 20,
            },
          }}
          arrow={false}
          trigger="click"
          destroyOnHidden
        >
          <button className="text-xs px-2 mr-3 transition duration-200 border shadow-sm inline-flex items-center justify-center py-[0.425rem] rounded-md font-medium cursor-pointer focus-visible:outline-none [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 [&amp;:hover:not(:disabled)]:bg-secondary/20 w-full sm:w-auto">
            <AppIcon className="mr-2 h-4 w-4 stroke-[1.3]" icon="Funnel" />
            {t("filter")}
            <span className="ml-2 flex h-4 items-center justify-center rounded-full border bg-slate-100 px-1.5 text-xs font-medium">
              {activeFilterCount}
            </span>
          </button>
        </Popover>
        <FormInput
          className="w-full sm:w-72"
          icon="Search"
          placeholder={`${t("tableHeader.fullName")}, ${t(
            "tableHeader.email"
          )}, ${t("tableHeader.nationalId")}...`}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="text-lg font-bold text-primary mx-auto underline underline-offset-3 decoration-4 decoration-theme-2">
          {t("clients")}
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <Button
            size="sm"
            variant="theme-2"
            localizedLabel="importFromUYAP"
            icon="Upload"
            iconDirection="left"
            iconClassName="stroke-[1.5]"
          />
          <Button
            size="sm"
            variant="primary"
            localizedLabel="addClient"
            icon="CirclePlus"
            iconDirection="left"
            iconClassName="stroke-[1.5]"
            onClick={() => router.push("/clients/new")}
          />
        </div>
      </DataTable.Header>
      <DataTable.Grid
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="md:mr-10 flex items-center justify-end">
                <AppIcon
                  className="h-6 w-6 fill-primary/10 stroke-[0.8] text-theme-1"
                  icon="Building"
                />
                <div className="ml-2">
                  <span className="whitespace-nowrap font-bold text-primary">
                    {t("companyTitle")}
                  </span>
                  <div className="whitespace-nowrap text-xs text-slate-500">
                    {record.companyTitle}
                  </div>
                </div>
              </div>
              <div className="md:ml-10 flex items-center justify-start">
                <AppIcon
                  className="h-6 w-6 fill-primary/10 stroke-[0.8] text-theme-1"
                  icon="MapPin"
                />
                <div className="ml-2">
                  <span className="whitespace-nowrap font-bold text-primary">
                    {t("taxOffice")}
                  </span>
                  <div className="whitespace-nowrap text-xs text-slate-500">
                    {record.taxOffice}
                  </div>
                </div>
              </div>
            </div>
          ),
          rowExpandable: (record) =>
            record.clientType === CompanyType[CompanyType.Corporate],
        }}
      />
    </DataTable>
  );
};

export default ClientTable;
