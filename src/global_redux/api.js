import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: `${(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "")}/api`, // Added /api prefix to match backend routes
  headers: {
    "Content-Type": "application/json",
  },
});

// Store and logout function references - will be set after store is created
let storeRef = null;
let logoutAction = null;

// Function to handle logout without circular dependency
const handleLogout = () => {
  if (storeRef && logoutAction) {
    // Dispatch logout action
    storeRef.dispatch(logoutAction());
  }
  
  // Clear localStorage manually as fallback
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("usertoken");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("admin");
  localStorage.removeItem("teezine_cart");
  
  // Show toast notification
  toast.error("Session expired. Please login again.");
  
  // Redirect to appropriate login page
  const currentPath = window.location.pathname;
  
  // Prevent redirect loop if already on login page
  if (currentPath !== "/login" && currentPath !== "/admin/login") {
    setTimeout(() => {
     if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }, 1000); // Small delay to show toast
  }
};

// Function to setup interceptors after store is initialized
export const setupApiInterceptors = (store, logoutFn) => {
  storeRef = store;
  logoutAction = logoutFn;

  // Request interceptor - Add token to requests if not already set
  API.interceptors.request.use(
    (config) => {
      // Handle FormData - remove Content-Type so axios can set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
      
        // Only add token if Authorization header is not already set
        if (!config.headers.Authorization) {
          // Helper function to safely get and validate token from localStorage
          const getValidToken = (key) => {
            try {
              const rawValue = localStorage.getItem(key);
              if (!rawValue || rawValue === 'null' || rawValue === 'undefined' || rawValue.trim() === '') {
                return null;
              }
              const clean = rawValue.startsWith('Bearer ') ? rawValue.substring(7) : rawValue;
              if (clean.length > 20 && clean.includes('.') && !clean.includes('null')) {
                return clean;
              }
              return null;
            } catch (e) {
              return null;
            }
          };
          
          const token = getValidToken("token");
          const adminToken = getValidToken("adminToken");
          
          const isAdminRoute = config.url?.includes("/admin") || 
                               config.url?.includes("/ai/") || 
                               config.url?.includes("/promo-code") ||
                               config.url?.includes("/contect") || // Contact management routes
                               (config.url?.includes("/orders") && config.method === "get" && !config.url?.includes("/user")) ||
                               (config.url === "/auth" && config.method === "get"); // GET /auth is admin-only
          
          let authToken = isAdminRoute ? adminToken : token;
          
          if (authToken && typeof authToken === 'string' && authToken.length > 20 && authToken.includes('.')) {
            config.headers.Authorization = `Bearer ${authToken}`;
          }
        }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle JWT expiration
  API.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message?.toLowerCase() || "";
      const errorData = error.response?.data || {};
      
      // Check if it's a permission denied error (should not trigger logout)
      const isPermissionDenied = 
        errorMessage.includes("permission denied") ||
        errorMessage.includes("don't have permission") ||
        errorData.message?.toLowerCase().includes("permission denied") ||
        errorData.message?.toLowerCase().includes("don't have permission") ||
        errorData.code === 'PERMISSION_DENIED';
      
      const isJwtError = (status === 401 || status === 403) && !isPermissionDenied && (
        errorMessage.includes("jwt expired") ||
        errorMessage.includes("token expired") ||
        errorMessage.includes("invalid token") ||
        errorMessage.includes("jwt malformed") ||
        errorMessage.includes("token missing") ||
        errorMessage.includes("unauthorized") ||
        errorData.code === 'INVALID_TOKEN' ||
        errorData.code === 'TOKEN_EXPIRED' ||
        errorData.code === 'INVALID_TOKEN_FORMAT'
      );

      if (isJwtError) {
        console.log("JWT error detected, triggering logout:", {
          status,
          message: errorMessage,
          code: errorData.code
        });
        handleLogout();
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};

export default API;
