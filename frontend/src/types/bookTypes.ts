export interface Book {
  id: string;
  title: string;
  description?: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  language?: string;
  pageCount?: number;
  category?: string;
  price: number;
  stockQuantity: number;
  coverImageKey?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBooksResponse {
  items: Book[];
  count: number;
  lastEvaluatedKey?: string;
  hasMore: boolean;
}

export interface BookSearchParams {
  title?: string;
  author?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  lastKey?: string;
}
