export type RecentDocumentDto = {
  id: number;
  caseId: number;
  caseTitle: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdOn: Date;
};

export type ClientStatsDto = {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  activeClientsPercentage: number;
};

export type CaseTypeStatDto = {
  name: string;
  count: number;
};

export type LatestCaseItemDto = {
  caseId: number;
  title: string;
  client: string;
  date: Date;
};
