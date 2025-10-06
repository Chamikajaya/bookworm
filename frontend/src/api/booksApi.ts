import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Book,
  PaginatedBooksResponse,
  BookSearchParams,
} from "@/types/bookTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    // Get paginated books with search filters
    getBooks: builder.query<PaginatedBooksResponse, BookSearchParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.title) searchParams.append("title", params.title);
        if (params.author) searchParams.append("author", params.author);
        if (params.category) searchParams.append("category", params.category);
        if (params.minPrice)
          searchParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          searchParams.append("maxPrice", params.maxPrice.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.lastKey) searchParams.append("lastKey", params.lastKey);

        return `/books?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Books" as const,
                id,
              })),
              { type: "Books", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Books", id: "PARTIAL-LIST" }],
      keepUnusedDataFor: 300,
    }),

    // Get single book by ID
    getBookById: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Books", id }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetBooksQuery, useGetBookByIdQuery, usePrefetch } = booksApi;
