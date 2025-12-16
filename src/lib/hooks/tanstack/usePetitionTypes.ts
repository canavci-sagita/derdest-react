import { getAllPetitionTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useQuery } from "@tanstack/react-query";

export const usePetitionTypes = (caseTypeId?: number) => {
  return useQuery<LookupResponse[], Error>({
    queryKey: ["petition-types", caseTypeId],
    queryFn: () => getAllPetitionTypesForLookupAction(caseTypeId),
    enabled: !!caseTypeId,
  });
};
