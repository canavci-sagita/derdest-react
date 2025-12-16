import { getAllEvidenceFilesAction } from "@/actions/cases.actions";
import { EvidenceFileDto } from "@/services/cases/cases.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const useEvidenceFiles = (caseId: number, evidenceId: number) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const queryKey = ["evidence-files", caseId, evidenceId];

  const { data: files = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getAllEvidenceFilesAction(caseId, evidenceId);
      if (!response.isSuccess) {
        message.error("Failed to load attached files.");
        return [];
      }
      return response.result || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const addFileToCache = (newFile: EvidenceFileDto) => {
    queryClient.setQueryData<EvidenceFileDto[]>(queryKey, (old) => {
      return [newFile, ...(old || [])];
    });
  };

  return { files, isLoading, addFileToCache };
};
