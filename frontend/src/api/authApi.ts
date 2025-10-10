import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, UpdateProfileInput } from "@/types/authTypes";
import { API_BASE_URL } from "@/constants/constants";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include", // include cookies
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // get id, access and refresh tokens
    handleCallback: builder.mutation<
      { user: User; redirectTo: string }, // redirectTo is the pageurl = depends on user role
      { code: string; redirectUrl: string }
    >({
      query: (data) => ({
        url: "/auth/callback",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // refresh access / id token
    refreshToken: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    // get current user profile
    getUserProfile: builder.query<{ user: User }, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // update user profile
    updateUserProfile: builder.mutation<{ user: User }, UpdateProfileInput>({
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
