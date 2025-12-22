"use client";

import React, { useState } from "react";
import { App, Popconfirm, Space, Tooltip } from "antd";
import type { TableProps } from "antd";
import {
  deleteCaseTypeAction,
  getAllCaseTypesAction,
  getCaseTypeAction,
} from "@/actions/definitions/case-types.actions";
import {
  AddEditCaseTypeDto,
  CaseTypeGridDto,
} from "@/services/definitions/definitions.types";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import { useTranslation } from "@/stores/TranslationContext";
import AddEditCaseTypeModal from "./AddEditCaseTypeModal";
import { DataTable } from "@/components/common/data-table";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import { formatDate } from "@/lib/utils/date.utils";

interface CaseTypeTableProps {
  initialData: PaginatedResponse<CaseTypeGridDto>;
}

const CaseTypeTable: React.FC<CaseTypeTableProps> = ({ initialData }) => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<AddEditCaseTypeDto | null>(
    null
  );
  const [tableKey, setTableKey] = useState(0);
  const [loadingRowId, setLoadingRowId] = useState<number | null>(null);

  const handleOpenModal = async (id: number | null) => {
    if (!id) {
      setEditingData(null);
      setIsModalOpen(true);
      return;
    }

    setLoadingRowId(id);
    const result = await getCaseTypeAction(id);
    if (result.isSuccess) {
      const response = result as ApiResponseOf<AddEditCaseTypeDto>;
      setEditingData(response.result || null);
      setIsModalOpen(true);
    } else {
      message.error(result.messages);
    }
    setLoadingRowId(null);
  };

  const handleDelete = async (record: CaseTypeGridDto) => {
    const response = await deleteCaseTypeAction(record.id);
    if (response.isSuccess) {
      message.success(response.messages);
      setTableKey((prev) => prev + 1);
    } else {
      message.error(response.messages);
    }
  };

  const handleCloseModal = (shouldRefetch?: boolean) => {
    setIsModalOpen(false);
    if (shouldRefetch) {
      setTableKey((prev) => prev + 1);
    }
  };

  const columns: TableProps<CaseTypeGridDto>["columns"] = [
    { title: t("tableHeader.id"), dataIndex: "id", key: "id", width: "10%" },
    {
      title: t("tableHeader.title"),
      dataIndex: "title",
      key: "title",
      sorter: true,
    },
    {
      title: t("tableHeader.createdOn"),
      dataIndex: "createdOn",
      key: "createdOn",
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
            <button
              onClick={() => handleOpenModal(record.id)}
              className="cursor-pointer text-gray-600 flex items-center p-2 rounded-md hover:bg-gray-200/60"
            >
              {loadingRowId && loadingRowId === record.id ? (
                <LoadingIcon className="h-4 w-4" color="#4b5563" icon="grid" />
              ) : (
                <AppIcon className="h-4 w-4" icon="SquarePen" />
              )}
            </button>
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

  return (
    <>
      <DataTable<CaseTypeGridDto>
        key={tableKey}
        fetchAction={getAllCaseTypesAction}
        initialData={initialData}
        initialSort={["title asc"]}
      >
        <DataTable.Header>
          <FormInput icon="Search" placeholder={t("searchCaseTypes")} />
          <div className="text-lg font-bold text-primary mx-auto underline underline-offset-3 decoration-4 decoration-theme-2">
            {t("caseTypes")}
          </div>
          <Button
            size="sm"
            variant="primary"
            localizedLabel="addCaseType"
            icon="CirclePlus"
            iconDirection="left"
            iconClassName="stroke-[1.5]"
            onClick={() => handleOpenModal(null)}
          />
        </DataTable.Header>
        <DataTable.Grid columns={columns} />
      </DataTable>
      {isModalOpen && (
        <AddEditCaseTypeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={editingData}
        />
      )}
    </>
  );
};

export default CaseTypeTable;
