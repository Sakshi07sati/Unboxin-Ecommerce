import API from "../../api"
import { createAsyncThunk } from "@reduxjs/toolkit";

/* ======================
   📦 GET ALL BANNERS
====================== */
export const fetchBanners = createAsyncThunk(
  "banner/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await API.get("/banners", config);
      // Backend might return banners in different structures
      const data = res.data.banners || res.data.data || (Array.isArray(res.data) ? res.data : []);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch banners"
      );
    }
  }
);

/* ======================
   ➕ ADD NEW BANNER
====================== */
export const addBanner = createAsyncThunk(
  "banner/addBanner",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await API.post("/banners", formData, config);
      console.log(res.data);
      // Return the created banner data
      return res.data.banner || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add banner"
      );
    }
  }
);

/* ======================
   ✏️ UPDATE BANNER
====================== */
export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await API.put(`/banners/${id}`, formData, config);
      // Return the updated banner from response or fallback to local version
      return res.data.banner || res.data.data || { _id: id, ...Object.fromEntries(formData.entries()) };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update banner"
      );
    }
  }
);

/* ======================
   ❌ DELETE BANNER
====================== */
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await API.delete(`/banners/${id}`, config);
      return id; // Return ID to remove from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete banner"
      );
    }
  }
);
