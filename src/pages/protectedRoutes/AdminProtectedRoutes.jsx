import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  // Helper to safely get and validate token
  const getValidToken = (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value || value === 'null' || value === 'undefined' || value.trim() === '') {
        return null;
      }
      // Remove "Bearer " prefix if present
      const clean = value.startsWith('Bearer ') ? value.substring(7) : value;
      // Validate it looks like a JWT
      if (clean.length > 20 && clean.includes('.') && !clean.includes('null')) {
        return clean;
      }
      return null;
    } catch (e) {
      return null;
    }
  };
  
  const adminToken = getValidToken("adminToken");
  const hasValidAdminToken = !!(adminToken && adminToken !== 'null');
  
  if (!hasValidAdminToken) {
    console.log("AdminProtectedRoute: No valid admin token, redirecting to login");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
