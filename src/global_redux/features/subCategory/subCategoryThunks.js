import API from "../../api"
import { createAsyncThunk } from "@reduxjs/toolkit";

/* ======================
   📦 GET ALL SUBCATEGORIES
====================== */
export const fetchSubCategories = createAsyncThunk(
  "subCategory/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await API.get("/subCategories", config);
      // Backend might return subCategories in different structures
      const data = res.data.subCategories || res.data.data || (Array.isArray(res.data) ? res.data : []);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch subCategories"
      );
    }
  }
);

/* ======================
   ➕ ADD NEW SUBCATEGORY
====================== */
export const addSubCategory = createAsyncThunk(
  "subCategory/addSubCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await API.post("/subCategories", formData, config);
      console.log(res.data);
      // Return the created subCategory data
      return res.data.subCategory || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add subCategory"
      );
    }
  }
);

/* ======================
   ✏️ UPDATE SUBCATEGORY
====================== */
export const updateSubCategory = createAsyncThunk(
  "subCategory/updateSubCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await API.put(`/subCategories/${id}`, formData, config);
      // Return the updated subCategory from response or fallback to local version
      return res.data.subCategory || res.data.data || { _id: id, ...Object.fromEntries(formData.entries()) };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update subCategory"
      );
    }
  }
);

/* ======================
   ❌ DELETE SUBCATEGORY
====================== */
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await API.delete(`/subCategories/${id}`, config);
      return id; // Return ID to remove from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete subCategory"
      );
    }
  }
);
