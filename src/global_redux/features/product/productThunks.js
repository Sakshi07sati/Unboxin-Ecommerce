import API from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const { page, limit } = params;
      const token = localStorage.getItem("adminToken");
      const res = await API.get(`/products?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const isFormData = productData instanceof FormData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
        },
      };

      const res = await API.post("/products", productData, config);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const isFormData = productData instanceof FormData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Axios automatically handles FormData — don't set Content-Type manually
      if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
      } else {
        // Remove in case any global interceptor added it
        delete config.headers["Content-Type"];
      }

      const res = await API.put(`/products/${id}`, productData, config);

      // FIX #1: Backend returns { success, message, data: updatedProduct }
      // Extract correctly — res.data.data is the updated product
      const updatedProduct = res.data.data || res.data.product || res.data;
      return updatedProduct;
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      const normalizedValidationMessage =
        Array.isArray(validationErrors) && validationErrors.length > 0
          ? validationErrors
              .map((e) =>
                typeof e === "string"
                  ? e
                  : e?.msg || e?.message || e?.path || JSON.stringify(e)
              )
              .join(", ")
          : "";

      const errorMessage =
        normalizedValidationMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update product";

      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      await API.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return productId; // return deleted ID to remove from Redux state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const fetchPublicProducts = createAsyncThunk(
  "products/fetchPublicProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/products?limit=1000");
      return res.data.data || res.data.products || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await API.get(`/product?category=${category}`);
      return res.data.data || res.data.products || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/products/${id}`);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchProductsBySection = createAsyncThunk(
  "products/fetchProductsBySection",
  async (section, { rejectWithValue }) => {
    try {
      const res = await API.get(`/section/${section}`);
      return res.data.data || res.data.products || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products by section"
      );
    }
  }
);