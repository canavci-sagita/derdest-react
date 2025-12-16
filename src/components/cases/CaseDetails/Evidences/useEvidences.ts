import { useCallback, useMemo } from "react";
import { App } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addEditEvidenceAction,
  AddEditEvidenceFormValues,
  deleteEvidenceAction,
  getAllEvidencesAction,
  getEvidenceAction,
} from "@/actions/cases.actions";
import {
  EvidenceGridDto,
  GetAllEvidencesRequest,
} from "@/services/cases/cases.types";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";

export const useEvidences = (caseId: number) => {
  const { message } = App.useApp();

  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["evidences", caseId], [caseId]);

  const getCachedEvidences = useCallback(() => {
    const defaultParams: Omit<GetAllEvidencesRequest, "caseId"> = {
      pageNumber: 1,
      pageSize: 10,
      orderBy: ["lastModifiedOn desc"],
      searchText: "",
    };

    return queryClient.getQueryData<PaginatedResponse<EvidenceGridDto>>([
      ...queryKey,
      defaultParams,
    ]);
  }, [queryKey, queryClient]);

  const fetchEvidences = useCallback(
    async (params: Omit<GetAllEvidencesRequest, "caseId">) => {
      return queryClient.fetchQuery({
        queryKey: [...queryKey, params],
        queryFn: async () => {
          const response = await getAllEvidencesAction({ ...params, caseId });
          if ("messages" in response) {
            message.error(response.messages);
          }
          return response;
        },
        staleTime: 1000 * 60 * 5,
      });
    },
    [caseId, queryClient, queryKey, message]
  );

  const getEvidence = useCallback(
    async (id: number) => {
      const response = await getEvidenceAction(id);
      if (!response.isSuccess) {
        message.error(response.messages);
      }
      return response;
    },
    [message]
  );

  const addEditMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return addEditEvidenceAction({} as AddEditEvidenceFormValues, formData);
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        message.success(response.message);

        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ["timelines", caseId] });
      } else if (response.status === "error") {
        if (response.message) {
          message.error(response.message);
        }
      }
    },
    onError: (e) => message.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (evidenceId: number) =>
      deleteEvidenceAction(caseId, evidenceId),
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ["timelines", caseId] });
      } else {
        message.error(response.messages);
      }
    },
    onError: (e) => message.error(e.message),
  });

  return {
    isSaving: addEditMutation.isPending,
    isDeleting: deleteMutation.isPending,

    fetchEvidences,
    getCachedEvidences,
    getEvidence,
    saveEvidence: addEditMutation.mutateAsync,
    deleteEvidence: deleteMutation.mutate,
  };
};
