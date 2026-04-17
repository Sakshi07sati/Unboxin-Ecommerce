// src/global_redux/features/order/orderThunks.js
import API from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create Order - existing
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await API.post("/orders", orderData);
      return res.data;
    } catch (err) {
      console.error("❌ Create Order Error Details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      return rejectWithValue(
        err.response?.data || { 
          message: err.message || "Failed to create order",
          status: err.response?.status 
        }
      );
    }
  }
);

// ✅ NEW: Fetch All Orders (Admin or Sub-Admin)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      // Get valid token (admin or sub-admin)
      // Headers are handled by the axios interceptor in api.js
      const response = await API.get("/orders");
      return response.data; // { success: true, message: "...", orders: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// ✅ NEW: Fetch User Orders
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (email, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/orders/user", {
        params: { email },
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data; // { success: true, message: "...", orders: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user orders");
    }
  }
);

// ✅ NEW: Update Order Status (Admin)
export const adminUpdateOrderStatus = createAsyncThunk(
  "order/adminUpdateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/orders/${orderId}/status`, { status });
      return response.data; // { success: true, message: "...", order: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

// ✅ NEW: Update Shipment Details (Admin)
export const adminUpdateShipment = createAsyncThunk(
  "order/adminUpdateShipment",
  async ({ orderId, shipmentData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/orders/${orderId}/shipment`, shipmentData);
      return response.data; // { success: true, message: "...", order: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update shipment details");
    }
  }
);

// ✅ NEW: Delete Order (Admin)
export const adminDeleteOrder = createAsyncThunk(
  "order/adminDeleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/orders/${orderId}`);
      return { orderId, ...response.data }; // { success: true, message: "...", orderId }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
  }
);