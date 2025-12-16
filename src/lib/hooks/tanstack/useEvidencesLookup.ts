import { useQuery } from "@tanstack/react-query";
import { getAllEvidencesForLookupAction } from "@/actions/lookups.actions";

//TODO: Can be moved to useEvidences like useTimelines?
export const useEvidencesLookup = (caseId: number) => {
  return useQuery({
    queryKey: ["evidences-lookup", caseId],
    queryFn: async () => {
      const result = await getAllEvidencesForLookupAction(caseId);
      return result || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
