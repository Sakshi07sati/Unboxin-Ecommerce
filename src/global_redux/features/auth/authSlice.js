import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, action) => {
      const { user, token } = action.payload;

      state.loading = false;
      state.user = user;
      state.token = token;
      state.permissions = user?.permissions || [];
    },

    authFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.error = null;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startLoading,
  authSuccess,
  authFail,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;