import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CartSummary, AddToCartInput, CartItem } from "../types/cartTypes";
import { API_BASE_URL } from "@/constants/constants";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<CartSummary, void>({
      query: () => "/cart",
      transformResponse: (response: any) => response?.data,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<CartItem, AddToCartInput>({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Cart"],
      onQueryStarted: async (
        { bookId, quantity },
        { dispatch, queryFulfilled }
      ) => {
        // optimistic increment only if item already exists in cache
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (!draft) return;
            const idx = draft.items.findIndex((i) => i.bookId === bookId);
            if (idx === -1) return;
            draft.items[idx].quantity += quantity;
            draft.totalItems = draft.items.reduce(
              (s, it) => s + it.quantity,
              0
            );
            draft.totalPrice = parseFloat(
              draft.items
                .reduce((s, it) => s + it.bookPrice * it.quantity, 0)
                .toFixed(2)
            );
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
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
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Cart"],
      onQueryStarted: async (
        { bookId, quantity },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (!draft) return;
            const idx = draft.items.findIndex((i) => i.bookId === bookId);
            if (idx === -1) return;
            draft.items[idx].quantity = quantity;
            draft.totalItems = draft.items.reduce(
              (s, it) => s + it.quantity,
              0
            );
            draft.totalPrice = parseFloat(
              draft.items
                .reduce((s, it) => s + it.bookPrice * it.quantity, 0)
                .toFixed(2)
            );
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    removeFromCart: builder.mutation<{}, string>({
      query: (bookId) => ({
        url: `/cart/${bookId}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Cart"],
      onQueryStarted: async (bookId, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (!draft) return;
            draft.items = draft.items.filter((i) => i.bookId !== bookId);
            draft.totalItems = draft.items.reduce(
              (s, it) => s + it.quantity,
              0
            );
            draft.totalPrice = parseFloat(
              draft.items
                .reduce((s, it) => s + it.bookPrice * it.quantity, 0)
                .toFixed(2)
            );
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    clearCart: builder.mutation<{}, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data,
      invalidatesTags: ["Cart"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (!draft) return;
            draft.items = [];
            draft.totalItems = 0;
            draft.totalPrice = 0;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
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
