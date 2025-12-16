import { useCallback, useMemo } from "react";
import { App } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addEditPartyAction,
  AddEditPartyFormValues,
  deletePartyAction,
  getAllPartiesAction,
  getPartyAction,
} from "@/actions/cases.actions";
import {
  GetAllPartiesRequest,
  PartyGridDto,
} from "@/services/cases/cases.types";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";

export const useParties = (caseId: number) => {
  const { message } = App.useApp();

  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["parties", caseId], [caseId]);

  const getCachedParties = useCallback(() => {
    const defaultParams: Omit<GetAllPartiesRequest, "caseId"> = {
      pageNumber: 1,
      pageSize: 10,
      orderBy: ["fullName asc"],
      searchText: "",
    };

    return queryClient.getQueryData<PaginatedResponse<PartyGridDto>>([
      ...queryKey,
      defaultParams,
    ]);
  }, [queryKey, queryClient]);

  const fetchParties = useCallback(
    async (params: Omit<GetAllPartiesRequest, "caseId">) => {
      return queryClient.fetchQuery({
        queryKey: [...queryKey, params],
        queryFn: async () => {
          const response = await getAllPartiesAction({ ...params, caseId });
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

  const getParty = useCallback(
    async (id: number) => {
      const response = await getPartyAction(id);
      if (!response.isSuccess) {
        message.error(response.messages);
      }
      return response;
    },
    [message]
  );

  const addEditMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return addEditPartyAction({} as AddEditPartyFormValues, formData);
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        message.success(response.message);

        queryClient.invalidateQueries({ queryKey });
      } else if (response.status === "error") {
        if (response.message) {
          message.error(response.message);
        }
      }
    },
    onError: (e) => message.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (partyId: number) => deletePartyAction(caseId, partyId),
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({ queryKey });
      } else {
        message.error(response.messages);
      }
    },
    onError: (e) => message.error(e.message),
  });

  return {
    isSaving: addEditMutation.isPending,
    isDeleting: deleteMutation.isPending,

    fetchParties,
    getCachedParties,
    getParty,
    saveParty: addEditMutation.mutateAsync,
    deleteParty: deleteMutation.mutate,
  };
};
