"use client";

import React, { useState } from "react";
import { App, Popconfirm, Space, Tooltip } from "antd";
import type { TableProps } from "antd";
import {
  deleteContractTypeAction,
  getAllContractTypesAction,
  getContractTypeAction,
} from "@/actions/definitions/contract-types.actions";
import {
  AddEditContractTypeDto,
  ContractTypeGridDto,
} from "@/services/definitions/definitions.types";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import { useTranslation } from "@/stores/TranslationContext";
import AddEditContractTypeModal from "./AddEditContractTypeModal";
import { DataTable } from "@/components/common/data-table";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import { ApiResponseOf } from "@/services/common/ApiResponse";
import { formatDate } from "@/lib/utils/date.utils";

interface ContractTypeTableProps {
  initialData: PaginatedResponse<ContractTypeGridDto>;
}

const ContractTypeTable: React.FC<ContractTypeTableProps> = ({
  initialData,
}) => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<AddEditContractTypeDto | null>(
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
    const result = await getContractTypeAction(id);
    if (result.isSuccess) {
      const response = result as ApiResponseOf<AddEditContractTypeDto>;
      setEditingData(response.result);
      setIsModalOpen(true);
    } else {
      message.error(result.messages);
    }
    setLoadingRowId(null);
  };

  const handleDelete = async (record: ContractTypeGridDto) => {
    const response = await deleteContractTypeAction(record.id);
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

  const columns: TableProps<ContractTypeGridDto>["columns"] = [
    { title: t("tableHeader.id"), dataIndex: "id", key: "id", width: "10%" },
    {
      title: t("tableHeader.title"),
      dataIndex: "title",
      key: "title",
      sorter: true,
    },
    {
      title: t("tableHeader.description"),
      dataIndex: "description",
      key: "description",
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
      <DataTable<ContractTypeGridDto>
        key={tableKey}
        fetchAction={getAllContractTypesAction}
        initialData={initialData}
        initialSort={["title asc"]}
      >
        <DataTable.Header>
          <FormInput
            icon="Search"
            formInputSize="sm"
            placeholder={t("searchContractTypes")}
          />
          <div className="text-lg font-bold text-primary mx-auto underline underline-offset-3 decoration-4 decoration-theme-2">
            {t("contractTypes")}
          </div>
          <Button
            size="sm"
            variant="primary"
            localizedLabel="addContractType"
            icon="CirclePlus"
            iconDirection="left"
            iconClassName="stroke-[1.5]"
            onClick={() => handleOpenModal(null)}
          />
        </DataTable.Header>
        <DataTable.Grid columns={columns} />
      </DataTable>
      {isModalOpen && (
        <AddEditContractTypeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={editingData}
        />
      )}
    </>
  );
};

export default ContractTypeTable;
