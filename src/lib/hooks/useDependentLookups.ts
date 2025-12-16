"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

/**
 * A generic custom hook to manage dependent lookups (e.g., A -> B)
 * using TanStack Query for efficient caching and data fetching.
 *
 * @param primaryQueryKey A unique key for the primary lookup data.
 * @param primaryQueryFn The server action to fetch the primary options.
 * @param secondaryQueryKey A unique key prefix for the secondary lookup data.
 * @param secondaryQueryFn The server action to fetch the secondary options, which receives the selected primary ID.
 * @param initialPrimaryId The initial ID for the primary dropdown.
 * @param initialSecondaryId The initial ID for the secondary dropdown.
 */
export function useDependentLookups<TPrimary, TSecondary>({
  primaryQueryKey,
  primaryQueryFn,
  secondaryQueryKey,
  secondaryQueryFn,
  initialPrimaryId,
  initialSecondaryId,
}: {
  primaryQueryKey: string;
  primaryQueryFn: () => Promise<TPrimary[]>;
  secondaryQueryKey: string;
  secondaryQueryFn: (primaryId: number | undefined) => Promise<TSecondary[]>;
  initialPrimaryId?: number;
  initialSecondaryId?: number;
}) {
  const [primaryId, setPrimaryId] = useState(initialPrimaryId);
  const [secondaryId, setSecondaryId] = useState(initialSecondaryId);

  const { data: primaryOptions = [], isLoading: isLoadingPrimary } = useQuery({
    queryKey: [primaryQueryKey],
    queryFn: primaryQueryFn,
    staleTime: Infinity,
  });

  const { data: secondaryOptions = [], isLoading: isLoadingSecondary } =
    useQuery({
      queryKey: [secondaryQueryKey, primaryId],
      queryFn: () => secondaryQueryFn(primaryId),
      enabled: !!primaryId,
      staleTime: 5 * 60 * 1000, //5min.
    });

  const handlePrimaryChange = (newId: number | undefined) => {
    setPrimaryId(newId);
    setSecondaryId(undefined);
  };

  return {
    primaryId,
    secondaryId,
    primaryOptions,
    secondaryOptions,
    isLoadingPrimary,
    isLoadingSecondary,
    handlePrimaryChange,
    setSecondaryId,
  };
}
