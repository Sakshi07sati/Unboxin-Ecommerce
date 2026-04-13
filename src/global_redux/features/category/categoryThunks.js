import API from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import API from "@/api/API"; // adjust the path based on your structure

/* ======================
   📦 GET ALL CATEGORIES (Admin)
====================== */
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await API.get("/categories", config);
      console.log(res)
      // Backend might return categories in different structures
      const data = res.data.categories || res.data.products || res.data.data || (Array.isArray(res.data) ? res.data : []);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

/* ======================
   ➕ ADD CATEGORY (Admin)
====================== */
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      console.log("data:", categoryData);
      const res = await API.post("/categories", categoryData, config);
      // Return the created category data
      console.log(res);
      return res.data.category || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add category"
      );
    }
  }
);

/* ======================
   ✏️ UPDATE CATEGORY (Admin)
====================== */
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await API.put(`/categories/${id}`, updatedData, config);
      
      // return the updated category from response or fallback to local version
      return res.data.category || res.data.data || { _id: id, ...updatedData };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update category"
      );
    }
  }
);

/* ======================
   ❌ DELETE CATEGORY (Admin)
====================== */
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await API.delete(`/categories/${id}`, config);
      return id; // return deleted category id
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

