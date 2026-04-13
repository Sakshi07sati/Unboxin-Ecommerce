import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, fetchAllUsers } from "./authThunks";

// ✅ Retrieve stored data from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedUserId = localStorage.getItem("userId");
const storedAdmin = localStorage.getItem("admin");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  userId: storedUserId || null,
  status: "idle",
  error: null,
  role: null,
  permissions: {}, // Store permissions as an object for module/action checks
  message: null,
  allUsers: [],
  usersLoading: false,
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
      state.role = user?.role || null;
      state.permissions = user?.permissions || {};
      state.status = "succeeded";
    },

    authFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
      state.status = "failed";
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.admin = null;
      state.userId = null;
      state.role = null;
      state.permissions = {};
      state.allUsers = [];
      state.error = null;
      state.loading = false;
      state.status = "idle";
      
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("usertoken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("admin");
    },
    clearUsers: (state) => {
      state.allUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Users (Admin)
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.allUsers = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })

      // ✅ Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        
        localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        localStorage.setItem("adminToken", action.payload.token);
        
        console.log("✅ Admin logged in - data stored:", action.payload.admin);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearUsers, authSuccess, authFail, startLoading } = authSlice.actions;
export const selectAllUsers = (state) => state.auth.allUsers;
export const selectUsersLoading = (state) => state.auth.usersLoading;
export const selectAuth = (state) => state.auth;
export const selectAdmin = (state) => state.auth.admin;

export default authSlice.reducer;