import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Popconfirm, Popover, Space, TableProps, Tooltip } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import {
  AddEditPartyDto,
  PartyFilterRequest,
  PartyGridDto,
} from "@/services/cases/cases.types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import AppIcon from "@/components/common/ui/AppIcon";
import { DataTable } from "@/components/common/data-table";
import FormInput from "@/components/common/forms/FormInput";
import Button from "@/components/common/ui/Button";
import PartyTableFilters from "./PartyTableFilters";
import AddEditPartyModal from "./AddEditPartyModal";
import { useParties } from "./useParties";

interface PartiesProps {
  caseId: number;
}

const Parties: React.FC<PartiesProps> = ({ caseId }) => {
  const { message } = App.useApp();
  const { t } = useTranslation();

  const { fetchParties, getCachedParties, getParty, deleteParty } =
    useParties(caseId);

  const cachedData = useMemo(() => getCachedParties(), [getCachedParties]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<AddEditPartyDto | null>(null);
  const [preselectedPartyTypeLabel, setPreselectedPartyTypeLabel] =
    useState("");

  const [loadingRowId, setLoadingRowId] = useState<number | null>(null);
  const [tableKey, setTableKey] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<PartyFilterRequest>({
    searchText: "",
  });
  //TODO: Search Text will be handled in filters.searchText.
  //Also will be cleared on handleClearFilters.
  const [searchText, setSearchText] = useState("");

  const debouncedSearchText = useDebounce(searchText, 500);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchText" && value != null
  ).length;

  const handleApplyFilters = (newFilters: PartyFilterRequest) => {
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

  const handleOpenModal = useCallback(
    async (partyId?: number, partyType?: string) => {
      if (!partyId) {
        setEditingData(null);
        setIsModalOpen(true);
        return;
      }

      setLoadingRowId(partyId);

      const response = await getParty(partyId);
      if (response.isSuccess) {
        setEditingData(response.result || null);
        setPreselectedPartyTypeLabel(partyType!);
        setIsModalOpen(true);
      } else {
        message.error(response.messages);
      }
      setLoadingRowId(null);
    },
    [getParty, message]
  );

  const handleCloseModal = useCallback((shouldRefetch?: boolean) => {
    setPreselectedPartyTypeLabel("");
    setIsModalOpen(false);
    if (shouldRefetch) {
      setTableKey((prev) => prev + 1);
    }
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteParty(id, {
        onSuccess: (response) => {
          if (response.isSuccess) {
            setTableKey((prev) => prev + 1);
          }
        },
      });
    },
    [deleteParty]
  );

  const columns = useMemo<TableProps<PartyGridDto>["columns"]>(
    () => [
      {
        title: t("tableHeader.fullName"),
        dataIndex: "fullName",
        key: "fullName",
        width: "30%",
        sorter: true,
      },
      {
        title: t("tableHeader.nationalId"),
        dataIndex: "nationalId",
        key: "nationalId",
        width: "15%",
      },
      {
        title: t("tableHeader.partyType"),
        dataIndex: "partyType",
        key: "partyType",
        width: "15%",
        sorter: true,
      },
      {
        title: t("tableHeader.city"),
        dataIndex: "city",
        key: "city",
        width: "15%",
        sorter: true,
      },
      {
        title: t("tableHeader.country"),
        dataIndex: "country",
        key: "country",
        width: "15%",
        sorter: true,
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
                  handleOpenModal(record.id, record.partyType);
                }}
                className="cursor-pointer text-gray-600 flex items-center p-2 rounded-md hover:bg-gray-200/60"
              >
                {loadingRowId && loadingRowId === record.id ? (
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
                onConfirm={() => handleDelete(record.id)}
                okText={t("yes")}
                cancelText={t("no")}
                okButtonProps={{ danger: true }}
              >
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer text-red-600 flex items-center p-2 rounded-md hover:bg-red-200/60"
                >
                  <AppIcon icon="Trash2" className="h-4 w-4" />
                </button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [t, handleOpenModal, handleDelete, loadingRowId]
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
                icon="Users"
              />
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-900">
                {t("parties")}
              </h3>
              <span className="text-slate-500">
                {t("casePartiesExplanation")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            localizedLabel="addParty"
            icon="CirclePlus"
            iconDirection="left"
            iconClassName="stroke-2 h-4 w-4"
            onClick={() => handleOpenModal()}
          />
        </div>
        <DataTable<PartyGridDto>
          initialFetch={!cachedData}
          initialData={cachedData}
          reloadTrigger={tableKey}
          fetchAction={fetchParties}
          initialSort={["fullName asc"]}
          filters={filters}
        >
          <DataTable.Header className="justify-start pl-0">
            <Popover
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              content={
                <PartyTableFilters
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
                "tableHeader.nationalId"
              )}...`}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </DataTable.Header>
          <DataTable.Grid columns={columns} />
        </DataTable>
      </div>
      {isModalOpen && (
        <AddEditPartyModal
          caseId={caseId}
          isOpen={isModalOpen}
          initialData={editingData}
          partyType={preselectedPartyTypeLabel}
          onClose={handleCloseModal}
        />
      )}
    </>
    // <div className="grid grid-cols-6 gap-2">
    //   <div className="max-w-sm">
    //     <div className="rounded-lg border bg-white pt-3 p-2 shadow-lg text-center">
    //       <div className="relative mx-auto max-w-12 rounded-full">
    //         <Image
    //           className="mx-auto h-auto w-full rounded-full"
    //           src={imgDefaultUser}
    //           alt="User Image"
    //         />
    //       </div>
    //       <h1 className="my-1 text-center font-bold text-primary">Full Name</h1>
    //       <span className="text-xs text-semibold text-center text-primary bg-slate-400 py-[0.5] px-2 rounded-full">
    //         Tanık
    //       </span>
    //       <ul className="mt-1 divide-y rounded bg-gray-100 py-1 px-1 text-slate-600 shadow-sm">
    //         <li className="flex items-center py-2 text-xs">
    //           <span className="font-semibold">National Id</span>
    //           <span className="ml-auto">
    //             <span className="text-xs font-medium text-slate-600">
    //               21203533598
    //             </span>
    //           </span>
    //         </li>
    //         <li className="flex items-center py-2 text-xs">
    //           <span className="font-semibold">Adres</span>
    //           <span className="ml-auto">
    //             <span className="text-xs font-medium text-slate-600">
    //               İstanbul, Türkiye
    //             </span>
    //           </span>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Parties;
