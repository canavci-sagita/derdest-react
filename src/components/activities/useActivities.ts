import { useQuery } from "@tanstack/react-query";
import { App } from "antd";
import { getAllActivitiesAction } from "@/actions/activities.actions";
import {
  ActivityCalendarItemDto,
  ActivityFilterRequest,
} from "@/services/activities/activities.types";
import dayjs from "dayjs";
import { useMemo } from "react";

export const useActivities = (filter: ActivityFilterRequest) => {
  const { message } = App.useApp();

  const queryKey = ["activities"];

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getAllActivitiesAction(filter);

      if (!response.isSuccess) {
        message.error(response.messages);
        return [];
      }
      return response.result || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, ActivityCalendarItemDto[]>();

    data.forEach((activity) => {
      //TODO: Date format localization.
      const dateKey = dayjs(activity.startDate).format("YYYY-MM-DD");

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(activity);
    });

    return map;
  }, [data]);

  return {
    activities: data,
    activitiesByDate,
    isLoading,
    isError,
  };
};
