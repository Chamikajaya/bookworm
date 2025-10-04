export interface PaginationParams {
  limit?: number;
  lastEvaluatedKey?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  count: number;
  lastEvaluatedKey?: string;
  hasMore: boolean;
}

export interface BookSearchParams extends PaginationParams {
  title?: string;
  author?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
