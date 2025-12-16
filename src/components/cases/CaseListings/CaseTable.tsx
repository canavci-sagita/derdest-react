"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Popconfirm, Popover, Space, Tooltip } from "antd";
import type { TableProps } from "antd";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import { useTranslation } from "@/stores/TranslationContext";
import { DataTable } from "@/components/common/data-table";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import {
  CaseFilterRequest,
  CaseSummaryGridDto,
} from "@/services/cases/cases.types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import CaseTableFilters from "./CaseTableFilters";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  deleteCaseAction,
  getAllCasesSummaryAction,
} from "@/actions/cases.actions";
import { formatDate } from "@/lib/utils/date.utils";
import CaseViewSwitcher from "./CaseViewSwitcher";

interface CaseTableProps {
  initialData: PaginatedResponse<CaseSummaryGridDto>;
}

const CaseTable: React.FC<CaseTableProps> = ({ initialData }) => {
  const { message } = App.useApp();
  const { t, currentLang } = useTranslation();
  const router = useRouter();

  const [tableKey, setTableKey] = useState(0);
  const [filters, setFilters] = useState<CaseFilterRequest>({
    searchText: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  //TODO: Search Text will be handled in filters.searchText.
  //Also will be cleared on handleClearFilters.
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText, 500);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchText" && value != null
  ).length;

  const handleApplyFilters = (newFilters: CaseFilterRequest) => {
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
    async (record: CaseSummaryGridDto) => {
      const response = await deleteCaseAction(record.id);
      if (response.isSuccess) {
        setTableKey((prev) => prev + 1);
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    [message]
  );

  const columns = useMemo<TableProps<CaseSummaryGridDto>["columns"]>(() => {
    return [
      { title: t("tableHeader.id"), dataIndex: "id", key: "id", width: "10%" },
      {
        title: t("tableHeader.title"),
        dataIndex: "title",
        key: "title",
        sorter: true,
        render: (_, record) => {
          const titleClasses =
            "text-theme-1 font-semibold hover:text-theme-1 hover:text-opacity-75";
          return (
            <Link className={titleClasses} href={`/cases/${record.id}`}>
              {record.title}
            </Link>
          );
        },
      },
      {
        title: t("tableHeader.client"),
        dataIndex: "client",
        key: "client",
        sorter: true,
      },
      {
        title: t("tableHeader.date"),
        dataIndex: "date",
        key: "date",
        sorter: true,
        render: (date: Date) => formatDate(currentLang, date, true, false),
      },
      {
        title: t("tableHeader.caseType"),
        dataIndex: "caseType",
        key: "caseType",
        sorter: true,
      },
      {
        title: t("tableHeader.caseDetails"),
        key: "details",
        render: (_, record) => {
          const iconClass = "w-4 h-4 mr-1 text-slate-400 stroke-2";
          const itemClass = "flex items-center text-slate-600";

          return (
            <Space size="middle" className="text-xs">
              <Tooltip title={`${record.evidenceCount} ${t("evidence_s")}`}>
                <div className={itemClass}>
                  <AppIcon icon="FileText" className={iconClass} />
                  {record.evidenceCount}
                </div>
              </Tooltip>
              <Tooltip title={`${record.timelineCount} ${t("timeline_s")}`}>
                <div className={itemClass}>
                  <AppIcon icon="List" className={iconClass} />
                  {record.timelineCount}
                </div>
              </Tooltip>
              <Tooltip title={`${record.partyCount} ${t("partie_s")}`}>
                <div className={itemClass}>
                  <AppIcon icon="Users" className={iconClass} />
                  {record.partyCount}
                </div>
              </Tooltip>
            </Space>
          );
        },
        sorter: false,
      },
      {
        title: t("tableHeader.lastModifiedOn"),
        dataIndex: "lastModifiedOn",
        key: "lastModifiedOn",
        sorter: true,
        render: (date: Date) => formatDate(currentLang, date, true, true),
      },
      {
        title: t("tableHeader.actions"),
        key: "action",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title={t("edit")} placement="left">
              <Link
                href={`/cases/${record.id}`}
                className="cursor-pointer text-gray-600 flex items-center p-2 rounded-md hover:bg-gray-200/60"
              >
                <AppIcon className="h-4 w-4" icon="SquarePen" />
              </Link>
            </Tooltip>
            <Tooltip title={t("delete")} placement="right">
              <Popconfirm
                title={t("deleteConfirmation.title")}
                description={t("deleteConfirmation.text")}
                onConfirm={() => handleDelete(record)}
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
    ];
  }, [t, currentLang, handleDelete]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchText: debouncedSearchText }));
  }, [debouncedSearchText]);

  return (
    <DataTable<CaseSummaryGridDto>
      reloadTrigger={tableKey}
      fetchAction={getAllCasesSummaryAction}
      initialData={initialData}
      initialSort={["date asc"]}
      filters={filters}
    >
      <DataTable.Header>
        <Popover
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          content={
            <CaseTableFilters
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
          <button
            className="text-xs px-2 mr-3 transition duration-200 border shadow-sm inline-flex items-center justify-center py-[0.425rem] 
          rounded-md font-medium cursor-pointer focus-visible:outline-none 
          [&amp;:hover:not(:disabled)]:bg-opacity-90 
          [&amp;:hover:not(:disabled)]:border-opacity-90 
          [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 
          [&amp;:hover:not(:disabled)]:bg-secondary/20 w-full sm:w-auto"
          >
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
          placeholder={`${t("tableHeader.title")}...`}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="ml-2">
          <CaseViewSwitcher />
        </div>
        <div className="text-lg font-bold text-primary mx-auto underline underline-offset-3 decoration-4 decoration-theme-2">
          {t("cases")}
        </div>

        <Button
          size="sm"
          variant="primary"
          localizedLabel="createNewCase"
          icon="CirclePlus"
          iconDirection="left"
          iconClassName="stroke-[1.5]"
          onClick={() => router.push("/cases/new")}
        />
      </DataTable.Header>
      <DataTable.Grid columns={columns} />
    </DataTable>
  );
};

export default CaseTable;
