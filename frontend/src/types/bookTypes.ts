export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  language?: string;
  pageCount?: number;
  category: BookCategory;
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
  category?: BookCategory;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  lastKey?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface CreateBookInput {
  title: string;
  description: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear: number;
  language: string;
  pageCount: number;
  category: BookCategory;
  price: number;
  stockQuantity?: number;
}

export type SortBy = "updatedAt" | "price";
export type SortOrder = "asc" | "desc";

export type BookCategory =
  | "Fiction"
  | "Non-Fiction"
  | "Science"
  | "History"
  | "Biography"
  | "Children"
  | "Fantasy"
  | "Mystery"
  | "Romance"
  | "Self-Help"
  | "Health";

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export interface UploadUrlRequest {
  fileExtension: string;
  contentType: string;
}
