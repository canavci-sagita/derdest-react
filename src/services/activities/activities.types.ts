export type ActivityCalendarItemDto = {
  id: number;
  caseId: number;
  startDate: Date;
  endDate: Date;
  caseTitle: string;
  client: string;
  title: string;
  description: string;
};

export type ActivityFilterRequest = {
  startDate: Date | null;
  endDate: Date | null;
};
