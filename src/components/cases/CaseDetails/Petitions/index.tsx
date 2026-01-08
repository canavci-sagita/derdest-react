"use client";

import { useEffect, useState, useMemo } from "react";
import { Pagination, Popover } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import {
  GetPetitionResponse,
  PetitionFilterRequest,
} from "@/services/cases/cases.types";
import { useDebounce } from "@/lib/hooks/useDebounce";
import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import FormInput from "@/components/common/forms/FormInput";
import NoDataAvailable from "@/components/common/data-table/NoDataAvailable";
import PetitionCard from "./PetitionCard";
import { twMerge } from "tailwind-merge";
import PetitionCardSkeleton from "./PetitionCardSkeleton";
import PetitionListSort from "./PetitionListSort";
import PetitionTableFilters from "./PetitionTableFilters";
import CreatePetitionModal from "./CreatePetitionModal";
import { LookupResponse } from "@/services/common/LookupResponse";
import { usePetitions } from "./usePetitions";

interface PetitionsProps {
  caseId: number;
}

const Petitions: React.FC<PetitionsProps> = ({ caseId }) => {
  const { t, tHtml } = useTranslation();

  const [filters, setFilters] = useState<PetitionFilterRequest>({
    searchText: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState<string[]>(["createdOn desc"]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const debouncedSearchText = useDebounce(searchText, 500);

  const queryParams = useMemo(
    () => ({
      pageNumber: page,
      pageSize: pageSize,
      filters,
      orderBy,
    }),
    [page, pageSize, filters, orderBy]
  );

  const {
    petitions,
    totalCount,
    isLoading,
    prefetchCreateModalData,
    getPetition,
    refetch,
  } = usePetitions(caseId, queryParams);

  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [defaultPrompt, setDefaultPrompt] = useState("");
  const [currentPetitionTypeId, setCurrentPetitionTypeId] = useState<number>(0);
  const [petitionTypes, setPetitionTypes] = useState<LookupResponse[]>([]);
  const [editingPetition, setEditingPetition] = useState<
    (GetPetitionResponse & { id: number }) | null
  >(null);

  const handleOpenModal = async () => {
    setIsModalLoading(true);
    try {
      const { prompt, typeId, types } = await prefetchCreateModalData();
      setDefaultPrompt(prompt || "");
      setCurrentPetitionTypeId(typeId || 0);
      setPetitionTypes(types || []);
      setEditingPetition(null);

      setIsModalOpen(true);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEdit = async (petitionId: number) => {
    const data = await getPetition(petitionId);
    if (data) {
      setEditingPetition({ id: petitionId, ...data });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPetition(null);
    refetch();
  };

  const handleApplyFilters = (newFilters: PetitionFilterRequest) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setIsFilterOpen(false);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({ searchText: prev.searchText }));
    setIsFilterOpen(false);
    setPage(1);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "searchText" && value != null
  ).length;

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchText: debouncedSearchText }));
    setPage(1);
  }, [debouncedSearchText]);

  return (
    <>
      <div className="box box--stacked border border-slate-200 rounded-lg shadow-sm p-6">
        <div className="flex sm:flex-row flex-col items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2 mb-3 sm:mb-0">
            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">
              <AppIcon
                className="h-5 w-5 text-slate-500 stroke-1"
                icon="ClipboardList"
              />
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-900">
                {t("petitions")}
              </h3>
              <span className="text-slate-500">
                {t("casePetitionsExplanation")}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            localizedLabel={isModalLoading ? "pleaseWait" : "createWithAI"}
            iconDirection="left"
            icon="Sparkles"
            iconClassName="stroke-2 h-4 w-4"
            loading={isModalLoading}
            disabled={isModalLoading}
            onClick={handleOpenModal}
          />
        </div>
        <header className="flex sm:flex-row flex-col items-center justify-between p-4">
          <div className="flex sm:flex-row flex-col justify-start">
            <Popover
              open={isSortOpen}
              onOpenChange={setIsSortOpen}
              content={
                <PetitionListSort
                  currentSort={orderBy}
                  onSortChange={setOrderBy}
                />
              }
              placement="bottomLeft"
              styles={{ body: { padding: 20 } }}
              arrow={false}
              trigger="click"
              destroyOnHidden
            >
              <button className="text-xs px-2 mr-3 transition duration-200 border shadow-sm inline-flex items-center justify-center py-[0.425rem] px-3 rounded-md font-medium cursor-pointer focus-visible:outline-none [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 [&:hover:not(:disabled)]:bg-secondary/20 w-full sm:w-auto">
                <AppIcon
                  className="mr-2 h-4 w-4 stroke-[1.3]"
                  icon="ListFilter"
                />
                {t("sort")}
              </button>
            </Popover>
            <Popover
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              content={
                <PetitionTableFilters
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
              className="w-full sm:w-72 mr-3"
              icon="Search"
              placeholder={`${t("tableHeader.fileName")}...`}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </header>
        <main
          className={twMerge(
            "bg-slate-50 grid grid-cols-1 gap-6 sm:p-4 rounded-lg",
            (isLoading || (petitions && petitions.length > 0)) &&
              "md:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <PetitionCardSkeleton key={i} />
            ))
          ) : petitions && petitions.length > 0 ? (
            petitions.map((item) => (
              <PetitionCard
                key={item.id}
                item={item}
                caseId={caseId}
                //onDelete={deletePetition}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <NoDataAvailable containerClassName="bg-white min-h-[240px]" />
          )}
        </main>
        <footer className="p-3 flex justify-center items-center">
          <Pagination
            size="small"
            current={page}
            pageSize={pageSize}
            pageSizeOptions={[8, 16, 32, 64, 128]}
            total={totalCount}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            locale={{ items_per_page: `/ ${t("page")}` }}
            showSizeChanger
            showTotal={(total, range) => {
              return tHtml("tableFooter.pageLength", {
                first: <strong>{range[0]}</strong>,
                last: <strong>{range[1]}</strong>,
                total: <strong>{total}</strong>,
              });
            }}
          />
        </footer>
      </div>
      {isModalOpen && (
        <CreatePetitionModal
          isOpen={isModalOpen}
          initialPrompt={defaultPrompt}
          caseId={caseId}
          currentPetitionTypeId={currentPetitionTypeId}
          petitionTypes={petitionTypes}
          petition={editingPetition}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Petitions;
