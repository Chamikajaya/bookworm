import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "./api/booksApi";
import { adminApi } from "./api/admin/adminApi";

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer, // auto-generated reducer for bookSlice
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(booksApi.middleware)
      .concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
