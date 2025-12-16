"use client";

import {
  deleteCaseAction,
  getAllCasesSummaryAction,
} from "@/actions/cases.actions";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  CaseFilterRequest,
  CaseSummaryGridDto,
  GetAllCasesRequest,
} from "@/services/cases/cases.types";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { useTranslation } from "@/stores/TranslationContext";
import { App, Pagination, Popover, TablePaginationConfig } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import FormInput from "../../common/forms/FormInput";
import Button from "../../common/ui/Button";
import CaseCard from "./CaseCard";
import NoDataAvailable from "../../common/data-table/NoDataAvailable";
import CaseTableFilters from "./CaseTableFilters";
import AppIcon from "../../common/ui/AppIcon";
import CaseCardSkeleton from "./CaseCardSkeleton";
import { twMerge } from "tailwind-merge";
import CaseListSort from "./CaseListSort";
import CaseViewSwitcher from "./CaseViewSwitcher";

interface CaseListProps {
  initialData: PaginatedResponse<CaseSummaryGridDto>;
}

const CaseList: React.FC<CaseListProps> = ({ initialData }) => {
  const { message } = App.useApp();
  const { t, tHtml } = useTranslation();
  const router = useRouter();

  const isInitialMount = useRef(true);

  const [filters, setFilters] = useState<CaseFilterRequest>({
    searchText: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  //TODO: Search Text will be handled in filters.searchText.
  //Also will be cleared on handleClearFilters.
  const [searchText, setSearchText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [orderBy, setOrderBy] = useState<string[]>(["date desc"]);
  const [data, setData] = useState(initialData.items);

  const debouncedSearchText = useDebounce(searchText, 500);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: initialData.currentPage,
    pageSize: initialData.pageSize,
    total: initialData.totalCount,
    locale: { items_per_page: `/ ${t("page")}` },
    showSizeChanger: true,
    showTotal(total, range) {
      return tHtml("tableFooter.pageLength", {
        first: <strong>{range[0]}</strong>,
        last: <strong>{range[1]}</strong>,
        total: <strong>{total}</strong>,
      });
    },
  });

  const { current, pageSize } = pagination;
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const request: GetAllCasesRequest = {
      ...filters,
      pageNumber: current!,
      pageSize: pageSize!,
      orderBy: orderBy,
    };

    const response = await getAllCasesSummaryAction(request);

    if ("isSuccess" in response && !response.isSuccess) {
      message.error(response.messages);
    } else {
      const paginatedData = response as PaginatedResponse<CaseSummaryGridDto>;
      setData(paginatedData.items);
      setPagination((prev) => ({ ...prev, total: paginatedData.totalCount }));
    }
    setIsLoading(false);
  }, [current, pageSize, filters, orderBy, message]);

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

  const handleListChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize: pageSize });
  };

  const handleDelete = useCallback(
    async (id: number) => {
      const response = await deleteCaseAction(id);
      if (response.isSuccess) {
        await fetchData();
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    [fetchData, message]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData();
  }, [current, pageSize, filters, orderBy, fetchData]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchText: debouncedSearchText }));
  }, [debouncedSearchText]);

  return (
    <>
      <header className="box box--stacked flex flex-col sm:flex-row items-center justify-between mb-8 p-4">
        <Popover
          open={isSortOpen}
          onOpenChange={setIsSortOpen}
          content={
            <CaseListSort currentSort={orderBy} onSortChange={setOrderBy} />
          }
          placement="bottomLeft"
          styles={{ body: { padding: 20 } }}
          arrow={false}
          trigger="click"
          destroyOnHidden
        >
          <button className="text-xs px-2 mr-3 transition duration-200 border shadow-sm inline-flex items-center justify-center py-[0.425rem] rounded-md font-medium cursor-pointer focus-visible:outline-none [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 [&amp;:hover:not(:disabled)]:bg-secondary/20 w-full sm:w-auto">
            <AppIcon className="mr-2 h-4 w-4 stroke-[1.3]" icon="ListFilter" />
            {t("sort")}
          </button>
        </Popover>
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
      </header>
      <main
        className={twMerge(
          "grid grid-cols-1 gap-6",
          (isLoading || (data && data.length > 0)) &&
            "md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {isLoading ? (
          <>
            <CaseCardSkeleton />
            <CaseCardSkeleton />
            <CaseCardSkeleton />
          </>
        ) : data && data.length > 0 ? (
          data.map((item) => (
            <CaseCard key={item.id} item={item} onDelete={handleDelete} />
          ))
        ) : (
          <NoDataAvailable border containerClassName="bg-white min-h-[240px]" />
        )}
      </main>
      <footer className="box p-3 mt-8 flex justify-center items-center">
        <Pagination
          size="small"
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handleListChange}
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
    </>
  );
};

export default CaseList;
