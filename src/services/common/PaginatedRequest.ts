export interface PaginatedRequest {
  pageNumber: number;
  pageSize: number;
  orderBy?: string[];
}
