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
      const response = await API.get("/auth");
      return response.data; // { message: "All users", data: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// ✅ Send OTP for Registration
// export const sendOtp = createAsyncThunk(
//   "auth/sendOtp",
//   async ({ username, email, password, phone, dateOfBirth }, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/auth/send-otp", {
//         username,
//         email,
//         password,
//         phone,
//         
//       });
//       return res.data; // e.g. { message: "OTP sent to email. Please verify to complete registration." }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
//     }
//   }
// );

// ✅ Verify OTP and Complete Registration
// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async ({ email, otp }, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/auth/verify-otp", {
//         email,
//         otp,
//       });
//       return res.data; // e.g. { message: "Email verified and user registered successfully!" }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "OTP verification failed");
//     }
//   }
// );

// ✅ User Register (Legacy - kept for backward compatibility)
// export const userRegister = createAsyncThunk(
//   "auth/userRegister",
//   async ({ username, email, phone, dateOfBirth, password }, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/auth/register", {
//         username,
//         email,
//         phone,
//         dateOfBirth,
//         password,
//       });
//       return res.data; // e.g. { success: true, message: "User registered successfully", user: {...} }

//       console.log("✅ User registered:", res.data.user);
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Registration failed");
//     }
//   }
// );

// ✅ User Login
// export const userLogin = createAsyncThunk(
//   "auth/userLogin",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await API.post("/auth/login", { email, password });
      
//       // 🔥 CLEAR ALL TOKENS FIRST TO AVOID CONFLICTS
//       // localStorage.clear();
      
//       // ✅ STORE ONLY USER TOKEN
//       localStorage.setItem("token", response.data.token);
      
//       console.log("✅ User logged in - token stored");
      
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// ✅ Send OTP for Password Reset
// export const sendPasswordResetOtp = createAsyncThunk(
//   "auth/sendPasswordResetOtp",
//   async ({ email }, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/auth/send-password-reset-otp", {
//         email,
//       });
//       return res.data; // { success: true, message: "OTP sent to your email..." }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to send OTP"
//       );
//     }
//   }
// );

// ✅ Reset Password with OTP
// export const resetPasswordWithOtp = createAsyncThunk(
//   "auth/resetPasswordWithOtp",
//   async ({ email, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/auth/reset-password-with-otp", {
//         email,
//         otp,
//         newPassword,
//         confirmPassword,
//       });
//       return res.data; // { success: true, message: "Password reset successful..." }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Password reset failed"
//       );
//     }
//   }
// );

// Legacy forgot password (kept for backward compatibility)
// export const forgotPassword = createAsyncThunk(
//   "auth/forgotPassword",
//   async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/auth/forgot-password", {
//         email,
//         newPassword,
//         confirmPassword,
//       });
//       return res.data; // { success: true, message: "Password updated successfully" }
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Password reset failed"
//       );
//     }
//   }
// );

// export const updatePassword = createAsyncThunk(
//   "auth/updatePassword",
//   async ({ userId, email, oldPassword, newPassword }, { rejectWithValue }) => {
//     try {
//       const response = await API.put(`/auth/updatepass/${userId}`, {
//         email,
//         oldPassword,
//         newPassword,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Update failed");
//     }
//   }
// );

// ✅ Admin Login
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", { username, password });
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

// export const fetchUserProfile = createAsyncThunk(
//   "auth/fetchUserProfile",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await API.get(`/auth/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data.user; // should return { success: true, user: {...} }

//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch user profile");
//     }
//   }
// );

// ✅ Update User Profile
// export const updateUserProfile = createAsyncThunk(
//   "auth/updateUserProfile",
//   async ({ userId, username, email, phone, address,dateOfBirth }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await API.put(
//         `/auth/updateprofile/${userId}`,
//         { username, email, phone, address ,dateOfBirth},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("update",res);
//       return res.data; // e.g. { success: true, user: {...}, message: "Updated successfully" }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to update profile");
//     }
//   }
// );
