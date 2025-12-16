"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { message, Popconfirm, Space, TableProps, Tooltip } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import {
  AddEditEvidenceDto,
  EvidenceFilterRequest,
  EvidenceGridDto,
} from "@/services/cases/cases.types";
import { formatDate } from "@/lib/utils/date.utils";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { DataTable } from "@/components/common/data-table";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import EvidenceFileList from "./EvidenceFile/EvidenceFileList";
import AddEditEvidenceModal from "./AddEditEvidenceModal";
import { useEvidences } from "@/components/cases/CaseDetails/Evidences/useEvidences";

interface EvidencesProps {
  caseId: number;
}

const Evidences: React.FC<EvidencesProps> = ({ caseId }) => {
  const { t, currentLang } = useTranslation();

  const {
    fetchEvidences,
    getCachedEvidences,
    getEvidence,
    deleteEvidence,
    isDeleting,
  } = useEvidences(caseId);

  const cachedData = useMemo(() => getCachedEvidences(), [getCachedEvidences]);

  const [loadingRowId, setLoadingRowId] = useState<number | null>(null);
  const [tableKey, setTableKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<EvidenceFilterRequest>({
    searchText: "",
  });

  const debouncedSearchText = useDebounce(searchText, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<AddEditEvidenceDto | null>(
    null
  );
  const [preselectedTimelineLabel, setPreselectedTimelineLabel] = useState<
    string | null
  >(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    []
  );

  const handleExpand = useCallback(
    (expanded: boolean, record: EvidenceGridDto) => {
      const key = String(record.id);
      setExpandedRowKeys(expanded ? [key] : []);
    },
    []
  );

  const handleOpenModal = useCallback(
    async (evidenceId?: number, timeline?: string) => {
      if (!evidenceId) {
        setEditingData(null);
        setIsModalOpen(true);
        return;
      }

      setLoadingRowId(evidenceId);
      const response = await getEvidence(evidenceId);
      if (response.isSuccess) {
        setEditingData(response.result);
        setPreselectedTimelineLabel(timeline || null);

        setIsModalOpen(true);
      } else {
        message.error(response.messages);
      }
      setLoadingRowId(null);
    },
    [getEvidence]
  );

  const handleCloseModal = useCallback((shouldRefetch?: boolean) => {
    setIsModalOpen(false);
    setPreselectedTimelineLabel("");
    if (shouldRefetch) {
      setTableKey((prev) => prev + 1);
    }
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteEvidence(id, {
        onSuccess: (response) => {
          if (response.isSuccess) {
            setTableKey((prev) => prev + 1);
            setExpandedRowKeys([]);
          }
        },
      });
    },
    [deleteEvidence]
  );

  const columns = useMemo<TableProps<EvidenceGridDto>["columns"]>(
    () => [
      {
        title: t("tableHeader.details"),
        dataIndex: "title",
        key: "title",
        width: "70%",
        render: (_, record) => (
          <div className="flex items-center gap-4 p-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">
                {record.title}
              </p>
              <p className="text-slate-500 text-xs truncate">
                {record.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              {record.timeline ? (
                <Tooltip title={t("relatedTimeline")} placement="left">
                  <span className="inline-flex items-center text-xs font-medium text-theme-1">
                    <AppIcon
                      icon="ChartNoAxesGantt"
                      className="w-3.5 h-3.5 mr-1"
                    />
                    {record.timeline?.label}
                  </span>
                </Tooltip>
              ) : (
                <span className="inline-flex items-center text-xs font-medium text-slate-400">
                  <AppIcon icon="CircleAlert" className="w-3.5 h-3.5 mr-1" />
                  {t("timelineNotRelated")}
                </span>
              )}
              <span className="inline-flex items-center text-xs font-medium text-theme-2">
                <AppIcon icon="FileText" className="w-3.5 h-3.5 mr-1" />
                {record.filesCount} {t("file_s")}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: t("tableHeader.lastModifiedOn"),
        dataIndex: "lastModifiedOn",
        key: "lastModifiedOn",
        width: "20%",
        sorter: true,
        render: (date: Date) => formatDate(currentLang, date, false, false),
      },
      {
        title: t("tableHeader.actions"),
        key: "action",
        width: "10%",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title={t("edit")} placement="left">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(record.id, record.timeline?.label);
                }}
                className="cursor-pointer text-gray-600 flex items-center p-2 rounded-md hover:bg-gray-200/60 transition-colors"
              >
                {loadingRowId === record.id ? (
                  <LoadingIcon
                    className="h-4 w-4"
                    color="#4b5563"
                    icon="grid"
                  />
                ) : (
                  <AppIcon icon="SquarePen" className="h-4 w-4" />
                )}
              </button>
            </Tooltip>
            <Tooltip title={t("delete")} placement="right">
              <Popconfirm
                title={t("deleteConfirmation.title")}
                description={t("deleteConfirmation.text")}
                onConfirm={() => {
                  handleDelete(record.id);
                }}
                okText={t("yes")}
                cancelText={t("no")}
                okButtonProps={{ danger: true, loading: isDeleting }}
              >
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer text-red-600 flex items-center p-2 rounded-md hover:bg-red-200/60 transition-colors"
                >
                  <AppIcon icon="Trash2" className="h-4 w-4" />
                </button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [t, currentLang, handleOpenModal, handleDelete, isDeleting, loadingRowId]
  );

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchText: debouncedSearchText }));
  }, [debouncedSearchText]);

  return (
    <>
      <div className="box box--stacked border border-slate-200 rounded-lg shadow-sm p-6">
        <div className="flex sm:flex-row flex-col items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2 mb-3 sm:mb-0">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
              <AppIcon
                className="h-5 w-5 text-slate-500 stroke-1"
                icon="FileJson"
              />
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-900">
                {t("evidences")}
              </h3>
              <span className="text-slate-500">
                {t("caseEvidencesExplanation")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            localizedLabel="addEvidence"
            icon="CirclePlus"
            iconDirection="left"
            iconClassName="stroke-2 h-4 w-4"
            onClick={() => handleOpenModal()}
          />
        </div>
        <DataTable<EvidenceGridDto>
          initialFetch={!cachedData}
          initialData={cachedData}
          reloadTrigger={tableKey}
          fetchAction={fetchEvidences}
          initialSort={["lastModifiedOn desc"]}
          filters={filters}
        >
          <DataTable.Header className="pl-0">
            <FormInput
              className="w-full sm:w-72"
              icon="Search"
              placeholder={`${t("tableHeader.title")}, ${t(
                "tableHeader.description"
              )}, ${t("tableHeader.fileName")}...`}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </DataTable.Header>
          <DataTable.Grid
            columns={columns}
            rowKey={(record) => String(record.id)}
            expandable={{
              expandedRowKeys: expandedRowKeys,
              onExpand: handleExpand,
              showExpandColumn: true,
              expandedRowRender: (record) => (
                <EvidenceFileList caseId={caseId} evidenceId={record.id} />
              ),
              rowExpandable: () => true,
            }}
          />
        </DataTable>
      </div>
      {isModalOpen && (
        <AddEditEvidenceModal
          caseId={caseId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={editingData}
          preselectedTimelineLabel={preselectedTimelineLabel}
          showTimeline
        />
      )}
    </>
  );
};

export default Evidences;
