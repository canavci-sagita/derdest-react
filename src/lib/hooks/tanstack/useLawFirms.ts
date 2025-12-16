import { getAllLawFirmsForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useQuery } from "@tanstack/react-query";

export const useLawFirms = (enabled: boolean = true) => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["law-firms"],
    queryFn: () => getAllLawFirmsForLookupAction(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled,
  });
};
