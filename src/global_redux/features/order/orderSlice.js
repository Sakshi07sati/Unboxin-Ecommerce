// src/global_redux/features/order/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
  createOrder, 
  fetchAllOrders, 
  fetchUserOrders,
  adminUpdateOrderStatus,
  adminUpdateShipment,
  adminDeleteOrder
} from "./orderThunks";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
  ordersLoading: false, 
  ordersError: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.success = false;
    },
    clearOrdersError: (state) => {
      state.ordersError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      })
      
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      })

      // Admin Update Order Status
      .addCase(adminUpdateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order;
        state.orders = state.orders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(adminUpdateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin Update Shipment
      .addCase(adminUpdateShipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUpdateShipment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order;
        state.orders = state.orders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(adminUpdateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin Delete Order
      .addCase(adminDeleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
      });
  },
});

export const { clearOrderState, clearOrdersError } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderSuccess = (state) => state.order.success;
export const selectAllOrders = (state) => state.order.orders;
export const selectOrdersLoading = (state) => state.order.ordersLoading;
export const selectOrdersError = (state) => state.order.ordersError;

export default orderSlice.reducer;