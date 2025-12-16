import { apiFetch } from "@/lib/api-fetch";
import { ApiResponseOf } from "../common/ApiResponse";
import {
  CaseTypeStatDto,
  ClientStatsDto,
  LatestCaseItemDto,
  RecentDocumentDto,
} from "./reports.types";

const REPORTS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/Reports`;

/**
 * Fetches the recently uploaded documents.
 * @returns A promise that resolves to the DocumentDto.
 */
export const getRecentDocuments = async (): Promise<
  ApiResponseOf<RecentDocumentDto[]>
> => {
  return await apiFetch(`${REPORTS_ENDPOINT}/GetRecentDocuments`, {
    method: "GET",
  });
};

/**
 * Fetches all clients' statistics.
 * @returns A promise that resolves to the ClientStatsDto.
 */
export const getClientStats = async (): Promise<
  ApiResponseOf<ClientStatsDto>
> => {
  return await apiFetch(`${REPORTS_ENDPOINT}/GetClientStats`, {
    method: "GET",
  });
};

/**
 * Fetches case types of the recent cases.
 * @returns A promise that resolves to the ClientStatsDto.
 */
export const getCaseTypeStats = async (): Promise<
  ApiResponseOf<CaseTypeStatDto[]>
> => {
  return await apiFetch(`${REPORTS_ENDPOINT}/GetCaseTypeStats`, {
    method: "GET",
  });
};

/**
 * Fetches latest cases.
 * @returns A promise that resolves to the LatestCaseItemDto.
 */
export const getLatestCases = async (): Promise<
  ApiResponseOf<LatestCaseItemDto[]>
> => {
  return await apiFetch(`${REPORTS_ENDPOINT}/GetLatestCases`, {
    method: "GET",
  });
};
