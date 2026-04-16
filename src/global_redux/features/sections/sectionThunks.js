// src/global_redux/features/section/sectionThunks.js
import API from "@/global_redux/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 FETCH SECTIONS
export const fetchSections = createAsyncThunk(
  "section/fetchSections",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await API.get("/sections", config);
      return res.data.products || []; // ✅ backend returns { products: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sections"
      );
    }
  }
);



// 🔹 ADD SECTION
// 🔹 ADD SECTION - FINAL VERSION
export const addSection = createAsyncThunk(
  "section/addSection",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await API.post("/sections", formData, config);
      
      // ✅ Backend doesn't return the section object, just success message
      // The component will refetch all sections after this succeeds
      return res.data;
      
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add section"
      );
    }
  }
);

// 🔹 UPDATE SECTION
// 🔹 UPDATE SECTION - FIXED VERSION
// 🔹 UPDATE SECTION - CORRECTED
export const updateSection = createAsyncThunk(
  "section/updateSection",
  async ({ id, section }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await API.put(`/sections/${id}`, { section }, config);
      
      // ✅ Backend returns: { success: true, message: "...", data: {...} }
      return res.data.data; // Return the section object inside 'data'
      
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update section"
      );
    }
  }
);

// 🔹 DELETE SECTION
export const deleteSection = createAsyncThunk(
  "section/deleteSection",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await API.delete(`/sections/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete section"
      );
    }
  }
);
