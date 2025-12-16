import { getErrorResponse } from "@/lib/utils/error.utils";
import { getAllActivities } from "@/services/activities/activities.service";
import {
  ActivityCalendarItemDto,
  ActivityFilterRequest,
} from "@/services/activities/activities.types";
import { ApiResponseOf } from "@/services/common/ApiResponse";

export const getAllActivitiesAction = async (
  request: ActivityFilterRequest
): Promise<ApiResponseOf<ActivityCalendarItemDto[]>> => {
  try {
    return await getAllActivities(request);
  } catch (error: unknown) {
    return getErrorResponse(error);
  }
};
