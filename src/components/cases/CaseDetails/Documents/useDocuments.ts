import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import {
  getAllDocumentsAction,
  uploadDocumentAction,
} from "@/actions/cases.actions";
import { getAllDocumentTypesForLookupAction } from "@/actions/lookups.actions";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useTranslation } from "@/stores/TranslationContext";
import { useMemo } from "react";

export const useDocuments = (
  caseId: number,
  selectedFolderId: number | null,
  searchText: string
) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const documentsQueryKey = ["documents", caseId, selectedFolderId, searchText];
  const foldersQueryKey = ["document-folders"];

  const foldersQuery = useQuery({
    queryKey: foldersQueryKey,
    queryFn: () => getAllDocumentTypesForLookupAction(),
    staleTime: Infinity,
  });

  const folders = useMemo(() => {
    const defaults = [
      new LookupResponse(-1, t("all")),
      new LookupResponse(0, t("unclassified")),
    ];
    return defaults.concat(foldersQuery.data || []);
  }, [foldersQuery.data, t]);

  const documentsQuery = useQuery({
    queryKey: documentsQueryKey,
    queryFn: async () => {
      if (selectedFolderId === null) return [];

      const response = await getAllDocumentsAction({
        caseId,
        documentTypeId: selectedFolderId,
        searchText,
      });

      if (!response.isSuccess) {
        message.error(response.messages);
        return [];
      }
      return response.result || [];
    },
    enabled: selectedFolderId !== null,
    staleTime: 1000 * 60 * 1,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocumentAction,
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
      } else {
        message.error(response.messages);
      }
    },
    onError: (e) => message.error(e.message),
  });

  return {
    folders,
    isLoadingFolders: foldersQuery.isLoading,

    documents: documentsQuery.data || [],
    isLoadingDocuments: documentsQuery.isLoading,

    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,

    invalidateDocuments: () =>
      queryClient.invalidateQueries({ queryKey: ["documents", caseId] }),
  };
};
