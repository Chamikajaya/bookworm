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
  tagTypes: ["Books"], // tags --> labels you can attach to cached data. These labels are used to tell RTK Query which pieces of data are related. This becomes extremely important for automatically refetching data when something changes (cache invalidation)
  endpoints: (builder) => ({
    // Get paginated books with search filters
    getBooks: builder.query<PaginatedBooksResponse, BookSearchParams>({
      // <response, arguments>
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
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);

        return `/books?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data, // response => data ==> items, count, lastEvaluatedKey, hasMore
      providesTags: (
        result // result -> result of the query (the paginated book data)
      ) =>
        result
          ? [
              // * iterating over every single book in the fetched list and creating a specific tag for each one, to target individual books for cache invalidation later
              ...result.items.map(({ id }) => ({
                type: "Books" as const,
                id,
              })),
              { type: "Books", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Books", id: "PARTIAL-LIST" }], // tag for the list of books itself, useful for invalidating the entire list, for instance, after we add or delete a book, which would require a refetch of the list to show the change.
      keepUnusedDataFor: 300, // if a user navigates away and comes back within 5 minutes, the cached data will be served instantly without a new network request
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
