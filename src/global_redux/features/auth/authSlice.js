import { createSlice } from "@reduxjs/toolkit";
import { 
  adminLogin, 
  fetchAllUsers,
  registerUser,
  verifyOtp,
  loginUser,
  fetchUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword
} from "./authThunks";

// LocalStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedUserId = localStorage.getItem("userId");
const storedAdmin = localStorage.getItem("admin");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  userId: storedUserId || null,

  // (for auth flow)
  step: "login",          // login | signup | otp | forgot-password | forgot-otp | reset-password
  otpData: null,

  status: "idle",
  loading: false,
  error: null,

  role: null,
  permissions: {},
  message: null,

  allUsers: [],
  usersLoading: false,
  isModalOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    //  UI FLOW CONTROL
    setStep: (state, action) => {
      state.step = action.payload;
      state.error = null;
    },

    setOtpData: (state, action) => {
      state.otpData = action.payload;
    },

    toggleModal: (state, action) => {
      state.isModalOpen = action.payload !== undefined ? action.payload : !state.isModalOpen;
      if (!state.isModalOpen) {
        state.error = null;
        state.step = "login";
      }
    },

    // EXISTING
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.loading = false;
      state.user = user;
      state.token = token;
      state.userId = user?._id || user?.id || null;
      state.role = user?.role || null;
      state.permissions = user?.permissions || {};
      state.status = "succeeded";

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      if (state.userId) {
        localStorage.setItem("userId", state.userId);
      }
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
      state.step = "login";
      state.otpData = null;

      localStorage.clear();
    },

    clearUsers: (state) => {
      state.allUsers = [];
    },
  },

  extraReducers: (builder) => {
    builder

      
      //  SIGNUP (OTP SEND)
    
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = { 
          ...action.meta.arg,
          emailOtp: action.payload?.emailOtp,
          phoneOtp: action.payload?.phoneOtp
        };
        state.step = "otp";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
      // VERIFY OTP
      
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.step = "login";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
      // USER LOGIN (NO OTP)
      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.user;
        const token = action.payload.token;

        state.user = user;
        state.token = token;
        state.userId = user?._id || user?.id || null;
        state.role = user?.role || null;
        state.permissions = user?.permissions || {};

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        if (state.userId) {
          localStorage.setItem("userId", state.userId);
        }

        state.step = "login"; // reset modal
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      //  FETCH USERS (ADMIN)
     
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
//admin login
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload.admin;
        state.token = action.payload.token;

        localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        localStorage.setItem("adminToken", action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ FETCH USER PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.userId = action.payload?._id || action.payload?.id || state.userId;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ UPDATE USER PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.userId = action.payload?._id || action.payload?.id || state.userId;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = action.meta.arg; // Save phone for OTP step
        state.step = "forgot-otp";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // VERIFY FORGOT PASSWORD OTP
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpData = { ...state.otpData, otp: action.meta.arg.otp };
        state.step = "reset-password";
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.step = "login";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearUsers,
  authSuccess,
  authFail,
  startLoading,
  setStep,
  setOtpData,
  toggleModal,
} = authSlice.actions;

// SELECTORS
export const selectAuth = (state) => state.auth;
export const selectAdmin = (state) => state.auth.admin;
export const selectAllUsers = (state) => state.auth.allUsers;
export const selectUsersLoading = (state) => state.auth.usersLoading;

export default authSlice.reducer;