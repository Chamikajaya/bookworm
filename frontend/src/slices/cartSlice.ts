import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartState, CartSummary } from "@/types/cartTypes";

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartSummary>) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCart, clearCart, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;
