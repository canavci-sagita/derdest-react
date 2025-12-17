import { apiFetch } from "@/lib/api-fetch";
import { ApiResponseOf } from "../common/ApiResponse";
import {
  ActivityCalendarItemDto,
  ActivityFilterRequest,
} from "./activities.types";

const ACTIVITIES_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Activities`;

/**
 * Fetches all activity entries for current user.
 * @returns A promise that resolves to a activity DTOs.
 */
export const getAllActivities = async (
  request: ActivityFilterRequest
): Promise<ApiResponseOf<ActivityCalendarItemDto[]>> => {
  const params = new URLSearchParams();

  if (request.startDate) {
    params.append("startDate", request.startDate.toISOString());
  }

  if (request.endDate) {
    params.append("endDate", request.endDate.toISOString());
  }
  return await apiFetch(
    `${ACTIVITIES_ENDPOINT}/GetAllActivities?${params.toString()}`,
    {
      method: "GET",
    }
  );
};
