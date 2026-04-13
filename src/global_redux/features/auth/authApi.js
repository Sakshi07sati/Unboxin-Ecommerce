import axios from "axios";
console.log("BASE URL:", import.meta.env.VITE_API_URL);
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // if using cookies
});

export const registerUser = (data) => {console.log("🚀 API CALLED"); return API.post("/userauth/signup", data);};

// export const verifyOTP = (data) => API.post("/userauth/verify-otp", data);
export const verifyOTP = async ({ email, otp }) => {  ///mock implementation for OTP verification
  const storedOtp = localStorage.getItem("otp");
  const expiry = localStorage.getItem("otpExpiry");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Date.now() > expiry) {
        return reject({ message: "OTP Expired" });
      }

      if (otp === storedOtp) {
        resolve({
          data: {
            token: "fake-token-123",
            user: {
              email,
              role: email === "admin@gmail.com" ? "admin" : "user",
            },
          },
        });
      } else {
        reject({ message: "Invalid OTP" });
      }
    }, 500);
  });
};
export const loginUser = (data) => API.post("/userauth/login", data);
export const forgotPassword = (data) => API.post("/userauth/forgot-password", data);
export const resetPassword = (data) => API.post("/userauth/reset-password", data);