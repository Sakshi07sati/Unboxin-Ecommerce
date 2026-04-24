// src/global_redux/features/promoCode/promoCodeThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/global_redux/api";

// ✅ Admin/Sub-Admin - Get All Promo Codes
export const getAllPromoCodes = createAsyncThunk(
  "promoCode/getAllPromoCodes",
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log("Thunk: getAllPromoCodes started");
      // Let the API interceptor handle token injection
      const response = await API.get("/promos/show");
      console.log("Thunk: getAllPromoCodes success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Thunk: getAllPromoCodes error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch promo codes"
      );
    }
  }
);

// ✅ Admin/ - Create Promo Code
export const addPromoCode = createAsyncThunk(
  "promoCode/addPromoCode",
  async (promoData, { getState, rejectWithValue }) => {
    try {
      console.log("Thunk: addPromoCode started with data:", promoData);
      
      // Let the API interceptor handle token injection
      const response = await API.post("/promos", promoData, {
        headers: { 
          "Content-Type": "application/json"
        },
      });
      
      console.log("Thunk: addPromoCode success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Thunk: addPromoCode error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create promo code"
      );
    }
  }
);

// ✅ Admin/Sub-Admin - Update Promo Code
export const updatePromoCode = createAsyncThunk(
  "promoCode/updatePromoCode",
  async ({ id, promoData }, { getState, rejectWithValue }) => {
    try {
      console.log("Thunk: updatePromoCode started for id:", id, "data:", promoData);

      const backendPayload = {
        code: promoData.code,
        discountValue: Number(promoData.discountValue),
        startDate: promoData.startDate, // ✅ Added startDate
        expiryDate: promoData.expiryDate,
        usageLimit: promoData.usageLimit,
      };

      if (promoData.applicableSubCategory) {
        backendPayload.applicableSubCategory = promoData.applicableSubCategory;
      }
      if (promoData.applicableProduct) {
        backendPayload.applicableProduct = promoData.applicableProduct;
      }

      // console.log("Backend Payload:", backendPayload);

      // Let the API interceptor handle token injection
      const response = await API.put(`/promos/${id}`, backendPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Thunk: updatePromoCode success:", response.data);

      // Normalize returned data
      if (response.data && !response.data.promoCode && !response.data.promo) {
        return {
          success: true,
          message: response.data.message || "Updated successfully",
          promoCode: response.data,
        };
      }
      return response.data;
    } catch (error) {
      console.error("Thunk: updatePromoCode error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update promo code"
      );
    }
  }
);

// ✅ Admin/Sub-Admin - Delete Promo Code
export const deletePromoCode = createAsyncThunk(
  "promoCode/deletePromoCode",
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log("Thunk: deletePromoCode started for id:", id);
      
      // Let the API interceptor handle token injection
      const response = await API.delete(`/promos/${id}`);
      
      console.log("Delete Response:", response.data);
      return { ...response.data, id };
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete promo code"
      );
    }
  }
);

// ✅ User - Apply Promo Code
export const applyPromoCode = createAsyncThunk(
  "promoCode/applyPromoCode",
  async ({ code, productId, subCategoryId, totalAmount, productName, userEmail: providedEmail }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userEmail = providedEmail || state.auth?.user?.email || "";
      // const token = localStorage.getItem("token");
      console.log("Thunk: applyPromoCode started with:", { code, productId, subCategoryId, userEmail, totalAmount, productName });
        
      const payload = { 
        code, 
        totalAmount ,
        userEmail
      };
      
      if (productId) {
        payload.productId = productId;
      }
      
      if (subCategoryId) {
        payload.subCategoryId = subCategoryId;
      }
      
      const response = await API.post(
        "/promos/apply",
        payload,
        // {
        //   headers: { 
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json"
        //   },
        // }
      );

      console.log("Apply Response:", response.data);
        
      return response.data;
    } catch (error) {
      console.error("Apply Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply promo code"
      );
    }
  }
);

export const removePromoCode = createAsyncThunk(
  "promoCode/removePromoCode",
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log("Thunk: removePromoCode started");
      return { success: true, message: "Promo code removed" };
    } catch (error) {
      return rejectWithValue("Failed to remove promo code");
    }
  }
);