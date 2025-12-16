import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import {
  deleteEvidenceFileAction,
  downloadEvidenceFileAction,
  getEvidenceFileDescriptionAction,
  setEvidenceFileDescriptionAction,
  transcribeEvidenceFileAction,
} from "@/actions/cases.actions";
import { EvidenceFileDto } from "@/services/cases/cases.types";

export const useEvidenceFile = (
  caseId: number,
  evidenceId: number,
  file: EvidenceFileDto,
  isPanelVisible: boolean
) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const descriptionQueryKey = ["evidence-file-description", file.id];
  const listQueryKey = ["evidence-files", caseId, evidenceId];

  const descriptionQuery = useQuery({
    queryKey: descriptionQueryKey,
    queryFn: async () => {
      const response = await getEvidenceFileDescriptionAction(caseId, file.id);
      if (!response.isSuccess) {
        message.error(response.messages);
      }
      return response.result || "";
    },
    enabled: isPanelVisible,
    staleTime: Infinity,
  });

  const saveDescriptionMutation = useMutation({
    mutationFn: async (description: string) => {
      return await setEvidenceFileDescriptionAction({
        caseId,
        evidenceFileId: file.id,
        description,
      });
    },
    onSuccess: (response, newDescription) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.setQueryData(descriptionQueryKey, newDescription);
      } else {
        message.error(response.messages);
      }
    },
  });

  const transcribeMutation = useMutation({
    mutationFn: async () => {
      return await transcribeEvidenceFileAction({
        caseId,
        evidenceFileId: file.id,
        language: "tur", //currentLang
      });
    },
    onSuccess: (response) => {
      if (response.isSuccess && response.result) {
        message.success(response.messages);
        queryClient.setQueryData(descriptionQueryKey, response.result);
      } else {
        message.error(response.messages);
      }
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      return await downloadEvidenceFileAction(
        caseId,
        evidenceId,
        file.fileName
      );
    },
    onSuccess: (response) => {
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        message.error(response.messages);
      }
    },
    onError: (e) => message.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await deleteEvidenceFileAction(caseId, evidenceId, file.fileName);
    },
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({ queryKey: listQueryKey });
      } else {
        message.error(response.messages);
      }
    },
  });

  return {
    description: descriptionQuery.data || "",
    isLoadingDescription: descriptionQuery.isLoading,

    saveDescription: saveDescriptionMutation.mutateAsync,
    isSaving: saveDescriptionMutation.isPending,

    transcribe: transcribeMutation.mutateAsync,
    isTranscribing: transcribeMutation.isPending,

    download: downloadMutation.mutate,
    isDownloading: downloadMutation.isPending,

    deleteFile: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
