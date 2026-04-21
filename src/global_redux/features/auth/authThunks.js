// src/global_redux/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api"; // Axios instance


export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Get valid token (admin or sub-admin)
      const adminToken = localStorage.getItem("adminToken");

      // Use adminToken if available, otherwise subAdminToken
      // Don't set header manually - let the interceptor handle it
      // This ensures proper token validation
      const response = await API.get("/userauth", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      return response.data; // { message: "All users", data: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);


// ✅ Admin Login
export const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await API.post("/admin/login", { username, password });
        console.log(response.data);
      // 🔥 CLEAR ALL TOKENS FIRST TO AVOID CONFLICTS
      // localStorage.clear();
      
      // ✅ STORE ONLY ADMIN TOKEN
      localStorage.setItem("adminToken", response.data.token);
      
      console.log("✅ Admin logged in - adminToken stored");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


//  SIGNUP → SEND OTP

export const registerUser = createAsyncThunk(
  "userauth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await API.post("/userauth/signup", userData);
     
     console.log(" Email OTP:", res.data.emailOtp);
console.log(" Phone OTP:", res.data.phoneOtp);

      return res.data; // no token here (OTP flow)
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);


//  VERIFY OTP
export const verifyOtp = createAsyncThunk(
  "userauth/verifyOtp",
  async ({ email, emailOtp,phoneOtp }, { rejectWithValue }) => {
    try {
      const res = await API.post("/userauth/verify-otp", {
        email,
        emailOtp,
        phoneOtp
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);


//  LOGIN (NO OTP)

export const loginUser = createAsyncThunk(
  "userauth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await API.post("/userauth/login", {
        email,
        password,
      });

      return res.data; 
      // MUST return: { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const forgotPassword = async (data) => {
  try {
    const res = await API.post("/userauth/forgot-password", data);
    return res;
  } catch (error) {
    console.log("API ERROR:", error); // IMPORTANT
    throw error; // don't forget this
  }
};
export const resetPassword = async (data) => {
  try {
    const res = await API.post("/userauth/reset-password", data);
    return res;
  } catch (error) {
    console.log("API ERROR:", error); // IMPORTANT
    throw error; // don't forget this
  }
};

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        console.warn("⚠️ fetchUserProfile called with null/undefined userId");
        return rejectWithValue("User ID is required to fetch profile");
      }
      
      const token = localStorage.getItem("token");
      const res = await API.get(`/userauth/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("user",res.data.user);
      return res.data.user; // should return { success: true, user: {...} }

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user profile");
    }
  }
);

// ✅ Update User Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ userId, username, email, phone, address, dateOfBirth }, { rejectWithValue }) => {
    try {
      if (!userId) {
        console.warn("⚠️ updateUserProfile called with null/undefined userId");
        return rejectWithValue("User ID is required to update profile");
      }

      console.log("📝 Updating profile for User:", userId);
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/userauth/update-profile/${userId}`,
        { username, email, phone, address, dateOfBirth },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Update Response:", res.data);
      return res.data.user; // return only the user object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

