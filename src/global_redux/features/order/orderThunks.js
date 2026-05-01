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
      const adminToken = localStorage.getItem("adminToken");
      const response = await API.get("/orders", {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log("✅ Fetch All Orders Response:", response.data);
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
      const adminToken = localStorage.getItem("adminToken");
      const response = await API.patch(`/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
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
      const adminToken = localStorage.getItem("adminToken");
      const response = await API.patch(`/orders/${orderId}/shipment`, shipmentData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
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
      const adminToken = localStorage.getItem("adminToken");
      const response = await API.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      return { orderId, ...response.data }; // { success: true, message: "...", orderId }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
  }
);

// Cancel Order (User)
export const cancelUserOrder = createAsyncThunk(
  "order/cancelUserOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/orders/${orderId}/cancel`);
      return response.data; // { success: true, message: "...", order }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
  }
);