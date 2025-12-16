import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import {
  addEditTimelineAction,
  deleteTimelineAction,
  getAllTimelinesAction,
} from "@/actions/cases.actions";
import { getAllTimelinesForLookupAction } from "@/actions/lookups.actions";

export const useTimelines = (caseId: number, enabledLookup = true) => {
  const { message } = App.useApp();

  const queryClient = useQueryClient();
  const lookupQueryKey = ["timelines-lookup", caseId];
  const queryKey = ["timelines", caseId];

  const lookupQuery = useQuery({
    queryKey: lookupQueryKey,
    queryFn: async () => {
      return await getAllTimelinesForLookupAction(caseId);
    },
    enabled: enabledLookup,
    staleTime: 1000 * 60 * 5,
  });

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await getAllTimelinesAction(caseId);
      if (!response.isSuccess) {
        message.error(response.messages);
      }
      return response.result || [];
    },
  });

  const addEditMutation = useMutation({
    mutationFn: addEditTimelineAction,
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: lookupQueryKey });
        queryClient.invalidateQueries({ queryKey: ["evidences", caseId] });
        queryClient.invalidateQueries({
          queryKey: ["evidences-lookup", caseId],
        });
      } else {
        message.error(response.messages);
      }
    },
    onError: (e) => message.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (timelineId: number) =>
      deleteTimelineAction(caseId, timelineId),
    onSuccess: (response) => {
      if (response.isSuccess) {
        message.success(response.messages);
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: lookupQueryKey });
        queryClient.invalidateQueries({ queryKey: ["evidences", caseId] });
        queryClient.invalidateQueries({
          queryKey: ["evidences-lookup", caseId],
        });
      } else {
        message.error(response.messages);
      }
    },
    onError: (e) => message.error(e.message),
  });

  return {
    timelinesLookup: lookupQuery.data || [],
    isLoadingLookup: lookupQuery.isLoading,
    isLookupError: lookupQuery.isError,

    timelines: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,

    isSaving: addEditMutation.isPending,
    isDeleting: deleteMutation.isPending,

    addEditTimeline: addEditMutation.mutate,
    deleteTimeline: deleteMutation.mutate,
  };
};
