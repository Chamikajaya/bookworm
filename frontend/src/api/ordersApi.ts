import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Order,
  OrderWithItems,
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "@/types/orderTypes";
import { API_BASE_URL } from "@/constants/constants";

// ! TODO: If error encounters , try with transformResponse 😊😊😊
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderWithItems, CreateOrderInput>({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    // get all orders for the logged-in user
    getOrders: builder.query<{ orders: Order[] }, void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<OrderWithItems, string>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    // ADMIN
    getAllOrders: builder.query<{ orders: Order[] }, string | undefined>({
      query: (status) => ({
        url: "/admin/orders",
        params: status ? { status } : undefined,
      }),
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation<
      { order: Order },
      { orderId: string; data: UpdateOrderStatusInput }
    >({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        "Orders",
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
