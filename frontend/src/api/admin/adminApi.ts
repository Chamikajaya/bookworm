import type {
  CreateBookInput,
  UploadUrlRequest,
  UploadUrlResponse,
} from "@/types/bookTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    // Create a book
    createBook: builder.mutation<{ message: string }, CreateBookInput>({
      query: (book) => ({
        url: "/books",
        method: "POST",
        body: book,
      }),
      invalidatesTags: [{ type: "Books", id: "PARTIAL-LIST" }],
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
        { type: "Books", id: bookId },
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
