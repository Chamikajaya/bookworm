import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/authTypes";
import { authApi } from "@/api/authApi";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Handle successful user profile fetch
    builder.addMatcher(
      authApi.endpoints.getUserProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data.user;
        state.isAuthenticated = true;
      }
    );
    // Handle failed user profile fetch
    builder.addMatcher(
      authApi.endpoints.getUserProfile.matchRejected,
      (state, _action) => {
        state.user = null;
        state.isAuthenticated = false;
      }
    );
    // Handle successful callback
    builder.addMatcher(
      authApi.endpoints.handleCallback.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data.user;
        state.isAuthenticated = true;
      }
    );
    // Handle logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
