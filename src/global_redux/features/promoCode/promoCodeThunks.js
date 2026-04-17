// src/global_redux/features/promoCode/promoCodeThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/global_redux/api";

// ✅ Admin/Sub-Admin - Get All Promo Codes
export const getAllPromoCodes = createAsyncThunk(
  "promoCode/getAllPromoCodes",
  async (_, { rejectWithValue }) => {
    try {
      // Let the API interceptor handle token injection
      const response = await API.get("/promos/show");
      console.log("Fetched promo codes:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get All Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch promo codes"
      );
    }
  }
);

// ✅ Admin/Sub-Admin - Create Promo Code
export const addPromoCode = createAsyncThunk(
  "promoCode/addPromoCode",
  async (promoData, { rejectWithValue }) => {
    try {
      console.log("Creating promo code with data:", promoData);
      
      // Let the API interceptor handle token injection
      const response = await API.post("/promos", promoData, {
        headers: { 
          "Content-Type": "application/json"
        },
      });
      
      console.log("Create Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create promo code"
      );
    }
  }
);

// ✅ Admin/Sub-Admin - Update Promo Code
export const updatePromoCode = createAsyncThunk(
  "promoCode/updatePromoCode",
  async ({ id, promoData }, { rejectWithValue }) => {
    try {
      console.log("Updating promo code:", id, "with data:", promoData);

      const backendPayload = {
        code: promoData.code,
        discountValue: Number(promoData.discountValue),
        startDate: promoData.startDate, // ✅ Added startDate
        expiryDate: promoData.expiryDate,
        usageLimit: promoData.usageLimit,
      };

      if (promoData.applicableCategory) {
        backendPayload.applicableCategory = promoData.applicableCategory;
      }
      if (promoData.applicableProduct) {
        backendPayload.applicableProduct = promoData.applicableProduct;
      }

      console.log("Backend Payload:", backendPayload);

      // Let the API interceptor handle token injection
      const response = await API.put(`/promos/${id}`, backendPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Update Response:", response.data);

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
      console.error("Update Error Details:", {
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
  async (id, { rejectWithValue }) => {
    try {
      console.log("Deleting promo code:", id);
      
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
  async ({ code, productId, categoryId, totalAmount, productName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Applying promo code:", { code, productId, categoryId, totalAmount });
      
      const payload = { 
        code, 
        totalAmount 
      };
      
      if (productId) {
        payload.productId = productId;
      }
      
      if (categoryId) {
        payload.categoryId = categoryId;
      }
      
      const response = await API.post(
        "/promo-code/apply",
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
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
  async (_, { rejectWithValue }) => {
    try {
      console.log("Removing promo code from state");
      return { success: true, message: "Promo code removed" };
    } catch (error) {
      return rejectWithValue("Failed to remove promo code");
    }
  }
);