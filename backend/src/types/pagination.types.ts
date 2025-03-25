export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
} 