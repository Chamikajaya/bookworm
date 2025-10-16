import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CartSummary, AddToCartInput, CartItem } from "../types/cartTypes";
import { API_BASE_URL } from "@/constants/constants";

// ! TODO: If an error occurrs check the response type and need to transform
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<CartSummary, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<CartItem, AddToCartInput>({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      CartItem,
      { bookId: string; quantity: number }
    >({
      query: ({ bookId, quantity }) => ({
        url: `/cart/${bookId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<{}, string>({
      query: (bookId) => ({
        url: `/cart/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<{}, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
