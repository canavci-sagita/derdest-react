/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { App, type TableProps } from "antd";
import {
  TablePaginationConfig,
  type SorterResult,
} from "antd/es/table/interface";
import { PaginatedRequest } from "@/services/common/PaginatedRequest";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";
import { ApiResponse } from "@/services/common/ApiResponse";
import { useTranslation } from "@/stores/TranslationContext";

//TODO: All logic in this file will be optimized.

interface DataTableContextType<T extends { id: number }> {
  data: T[];
  loading: boolean;
  pagination: TableProps<T>["pagination"];
  sorter: SorterResult<T>;
  handleTableChange: TableProps<T>["onChange"];
}

const DataTableContext = createContext<DataTableContextType<any> | undefined>(
  undefined
);

export const useDataTable = <T extends { id: any }>() => {
  const context = useContext(DataTableContext);
  if (context === undefined) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context as DataTableContextType<T>;
};

interface DataTableProviderProps<T extends { id: any }> {
  children: React.ReactNode;
  initialData?: PaginatedResponse<T>;
  initialSort?: string[];
  filters?: Record<string, any>;
  reloadTrigger?: number;
  initialFetch?: boolean;
  fetchAction: (
    request: PaginatedRequest
  ) => Promise<PaginatedResponse<T> | ApiResponse>;
}

const emptyInitialData: PaginatedResponse<any> = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const DataTableProvider = <T extends { id: any }>({
  children,
  initialData = emptyInitialData,
  initialSort = [],
  filters,
  reloadTrigger,
  initialFetch = false,
  fetchAction,
}: DataTableProviderProps<T>) => {
  const { message } = App.useApp();
  const { t, tHtml } = useTranslation();

  const prevReloadTriggerRef = useRef(reloadTrigger);
  const prevRequestRef = useRef<string>(
    initialFetch
      ? ""
      : JSON.stringify({
          pageNumber: initialData?.currentPage || 1,
          pageSize: initialData?.pageSize || 10,
          orderBy: initialSort,
          ...filters,
        })
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginatedResponse<T>>(initialData);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: initialData?.currentPage || 1,
    pageSize: initialData?.pageSize || 10,
    total: initialData?.totalCount || 0,
    hideOnSinglePage: false,
    position: ["bottomCenter"],
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
  const [sorter, setSorter] = useState<SorterResult<T>>(() => {
    const [field, order] = initialSort[0]?.split(" ") || [];
    return {
      field: field || undefined,
      order: order === "desc" ? "descend" : field ? "ascend" : undefined,
    };
  });

  const stableFilters = useMemo(() => {
    return filters;
  }, [JSON.stringify(filters)]);

  const fetchData = useCallback(async () => {
    const orderBy = [];
    if (sorter.field && sorter.order) {
      const direction = sorter.order === "ascend" ? "asc" : "desc";
      orderBy.push(`${sorter.field} ${direction}`);
    }

    const request: PaginatedRequest = {
      pageNumber: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      orderBy: orderBy.length > 0 ? orderBy : initialSort,
      ...filters,
    };

    const requestString = JSON.stringify(request);
    const isReload = reloadTrigger !== prevReloadTriggerRef.current;

    if (!isReload && requestString === prevRequestRef.current) {
      return;
    }

    prevRequestRef.current = requestString;
    prevReloadTriggerRef.current = reloadTrigger;

    setLoading(true);
    const response = await fetchAction(request);
    setLoading(false);

    if (response && "items" in response) {
      const paginatedData = response as PaginatedResponse<T>;
      setData(paginatedData);
      setPagination((prev) => ({
        ...prev,
        total: paginatedData.totalCount,
        current: paginatedData.currentPage,
        pageSize: paginatedData.pageSize,
      }));
    } else {
      message.error((response as ApiResponse).messages);
    }
  }, [
    fetchAction,
    pagination.current,
    pagination.pageSize,
    sorter,
    initialSort,
    filters,
    message,
    reloadTrigger,
  ]);

  const handleTableChange: TableProps<T>["onChange"] = (
    newPagination,
    _, // NOTE: Ignore Antd's original filters.
    newSorter
  ) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    }));
    //TODO: Will be checked and implemented if valid.
    // setPagination((prev) => {
    //   const samePage =
    //     (newPagination.current || 1) === prev.current &&
    //     (newPagination.pageSize || 10) === prev.pageSize;

    //   if (samePage) {
    //     return prev;
    //   }

    //   return {
    //     ...prev,
    //     current: newPagination.current || 1,
    //     pageSize: newPagination.pageSize || 10,
    //   };
    // });

    const sorterResult = Array.isArray(newSorter) ? newSorter[0] : newSorter;
    setSorter(sorterResult);
    //TODO: Will be checked and implemented if valid.
    // setSorter((prev) => {
    //   const sameSorter =
    //     prev.field === sorterResult.field && prev.order === sorterResult.order;

    //   if (sameSorter) {
    //     return prev;
    //   }

    //   return sorterResult;
    // });
  };

  useEffect(() => {
    setPagination((prev) => {
      if (prev.current === 1) {
        return prev;
      }
      return { ...prev, current: 1 };
    });
  }, [stableFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData, reloadTrigger]);

  const contextValue = useMemo(
    () => ({
      data: data.items,
      loading: loading,
      pagination,
      sorter,
      handleTableChange,
    }),
    [data.items, loading, pagination, sorter, handleTableChange]
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
};
