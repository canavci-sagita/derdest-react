import { ApiResponseOf } from "@/services/common/ApiResponse";
import {
  getClientStats,
  getRecentDocuments,
  getCaseTypeStats,
  getLatestCases,
} from "@/services/reports/reports.service";
import {
  CaseTypeStatDto,
  ClientStatsDto,
  LatestCaseItemDto,
  RecentDocumentDto,
} from "@/services/reports/reports.types";

export const getRecentDocumentsAction = async (): Promise<
  ApiResponseOf<RecentDocumentDto[]>
> => {
  return await getRecentDocuments();
};

export const getClientStatsAction = async (): Promise<
  ApiResponseOf<ClientStatsDto>
> => {
  return await getClientStats();
};

export const getCaseTypeStatsAction = async (): Promise<
  ApiResponseOf<CaseTypeStatDto[]>
> => {
  return await getCaseTypeStats();
};

export const getLatestCasesAction = async (): Promise<
  ApiResponseOf<LatestCaseItemDto[]>
> => {
  return await getLatestCases();
};
