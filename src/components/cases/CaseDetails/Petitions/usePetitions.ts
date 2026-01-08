import { useCallback } from "react";
import { App } from "antd";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllPetitionsAction,
  getCurrentPetitionTypeIdAction,
  getDefaultPromptAction,
  getPetitionAction,
} from "@/actions/cases.actions";
import { getAllPetitionTypesForLookupAction } from "@/actions/lookups.actions";
import {
  GetAllPetitionsRequest,
  PetitionFilterRequest,
  PetitionGridDto,
} from "@/services/cases/cases.types";
import { PromptType } from "@/services/common/enums";
import { PaginatedResponse } from "@/services/common/PaginatedResponse";

export const usePetitions = (
  caseId: number,
  params: {
    pageNumber: number;
    pageSize: number;
    filters: PetitionFilterRequest;
    orderBy: string[];
  }
) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const queryKey = ["petitions", caseId, params];

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const request: GetAllPetitionsRequest = {
        caseId,
        ...params.filters,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        orderBy: params.orderBy,
      };

      const response = await getAllPetitionsAction(request);

      if ("isSuccess" in response && !response.isSuccess) {
        message.error(response.messages);
      }
      return response as PaginatedResponse<PetitionGridDto>;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1,
  });

  const prefetchCreateModalData = useCallback(async () => {
    const [prompt, typeId, types] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ["petition-prompt", PromptType.CreatePetition],
        queryFn: () =>
          getDefaultPromptAction(PromptType.CreatePetition).then(
            (r) => r.result
          ),
        staleTime: Infinity, // Prompt rarely changes
      }),
      queryClient.fetchQuery({
        queryKey: ["current-petition-type-id", caseId],
        queryFn: () =>
          getCurrentPetitionTypeIdAction(caseId).then((r) => r.result),
        staleTime: 1000 * 60 * 5,
      }),
      queryClient.fetchQuery({
        queryKey: ["petition-types-lookup"],
        queryFn: () => getAllPetitionTypesForLookupAction(),
        staleTime: Infinity,
      }),
    ]);

    return { prompt, typeId, types };
  }, [caseId, queryClient]);

  const getPetition = useCallback(
    async (petitionId: number) => {
      const response = await getPetitionAction(caseId, petitionId);
      if (!response.isSuccess) {
        message.error(response.messages);
        return null;
      }
      return response.result;
    },
    [caseId, message]
  );

  //   const deleteMutation = useMutation({
  //     mutationFn: (id: number) => deletePetitionAction(caseId, id),
  //     onSuccess: (response) => {
  //       if (response.isSuccess) {
  //         message.success(response.messages);
  //         queryClient.invalidateQueries({ queryKey: ["petitions", caseId] });
  //       } else {
  //         message.error(response.messages);
  //       }
  //     },
  //     onError: (e) => message.error(e.message),
  //   });

  return {
    petitions: data?.items || [],
    totalCount: data?.totalCount || 0,
    isLoading: isLoading || isFetching,

    prefetchCreateModalData,
    getPetition,
    refetch,
    //deletePetition: deleteMutation.mutate,
    //isDeleting: deleteMutation.isPending,
  };
};
