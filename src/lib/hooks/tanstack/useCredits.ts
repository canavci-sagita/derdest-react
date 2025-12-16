"use client";

import { getCreditsAction } from "@/actions/users.actions";
import { CreditBalanceResponse } from "@/services/users/users.types";
import { useQuery } from "@tanstack/react-query";

export const useCredits = () => {
  return useQuery<CreditBalanceResponse | null, Error>({
    queryKey: ["credits"],
    queryFn: async () => {
      const response = await getCreditsAction();
      if (response.isSuccess && response.result) {
        return response.result as CreditBalanceResponse;
      }
      return null;
    },
    // NOTE: Credits are important, so we can stick to defaults (refetch on window focus) or set a small staleTime like 1 minute.
    staleTime: 1000 * 60,
  });
};
