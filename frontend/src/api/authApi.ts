import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, UpdateProfileInput } from "@/types/authTypes";
import { API_BASE_URL } from "@/constants/constants";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    handleCallback: builder.mutation<
      { data: { user: User; redirectTo: string }; message: string },
      { code: string; redirectUri: string }
    >({
      query: (data) => ({
        url: "/auth/callback",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    getUserProfile: builder.query<
      { data: { user: User }; message: string },
      void
    >({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation<
      { data: { user: User }; message: string },
      UpdateProfileInput
    >({
      query: (body) => ({
        url: "users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useHandleCallbackMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = authApi;
