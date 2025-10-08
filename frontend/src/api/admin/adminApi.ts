import { API_BASE_URL } from "@/constants/constants";
import type {
  CreateBookInput,
  UploadUrlRequest,
  UploadUrlResponse,
} from "@/types/bookTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Books"], // admin api will not provide any tags itself, however it needs to know this tag type exists so it can invalidate tags provided by other API slices (like the booksApi).
  endpoints: (builder) => ({
    // Create a book
    createBook: builder.mutation<{ message: string }, CreateBookInput>({
      query: (book) => ({
        url: "/books",
        method: "POST",
        body: book,
      }),
      invalidatesTags: [{ type: "Books", id: "PARTIAL-LIST" }], // After this createBook mutation completes successfully, any cached data that is tagged with { type: "Books", id: "PARTIAL-LIST" } is now out-of-date.
    }),

    // get the pre-signed url for image upload
    generateUploadUrl: builder.mutation<
      UploadUrlResponse,
      { bookId: string } & UploadUrlRequest
    >({
      query: ({ bookId, ...body }) => ({
        url: `/books/${bookId}/upload-url`,
        method: "POST",
        body,
      }),
    }),

    // update book image
    updateBookImage: builder.mutation<
      void,
      { bookId: string; coverImageKey: string }
    >({
      query: ({ bookId, coverImageKey }) => ({
        url: `/books/${bookId}`,
        method: "PUT",
        body: { coverImageKey },
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: "Books", id: bookId }, // invalidate the specific book that was updated
      ],
    }),

    // upload to s3 via the received pre-signed url - direct s3 bucket upload not via our api
    uploadToS3: builder.mutation<void, { url: string; file: File }>({
      queryFn: async ({ url, file }) => {
        try {
          const response = await fetch(url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: { message: "Upload failed" },
              },
            };
          }

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: String(error),
            },
          };
        }
      },
    }),
  }),
});

export const {
  useCreateBookMutation,
  useGenerateUploadUrlMutation,
  useUpdateBookImageMutation,
  useUploadToS3Mutation,
} = adminApi;
