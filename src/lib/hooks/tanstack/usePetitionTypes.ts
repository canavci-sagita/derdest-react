import { getAllPetitionTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import { PetitionTypeLookupResponse } from "@/services/lookups/lookups.types";
import { useQuery } from "@tanstack/react-query";

export const usePetitionTypes = (caseTypeId?: number | null) => {
  return useQuery<PetitionTypeLookupResponse[], Error>({
    queryKey: ["petition-types", caseTypeId],
    queryFn: () => getAllPetitionTypesForLookupAction(caseTypeId),
    enabled: !!caseTypeId,
  });
};
