import API from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";


// 🔹 FETCH ALL SECTIONS + PRODUCTS
export const fetchSectionsProduct = createAsyncThunk(
  "sectionProduct/fetchSectionsProduct",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await API.get("/section-products", config);
      console.log("Fetched sections response:", res.data.products);
      return res.data.products || []; // ✅ backend returns { products: [...] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sections"
      );
    }
  }
);


// 🔹 ADD PRODUCT TO SECTION
export const addSectionProduct = createAsyncThunk(
  "sectionProduct/addSectionProduct",
  async ({ section, products }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const body = { section, products }; // ✅ section name + array of product IDs
      const res = await API.post("/section-products", body, config);

      return res.data; // ✅ backend returns updated section + message
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add product to section"
      );
    }
  }
);



// 🔹 REPLACE PRODUCT IN SECTION
export const replaceSectionProduct = createAsyncThunk(
  "sectionProduct/replaceSectionProduct",
  async ({ sectionName, oldProductId, newProductId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const body = { sectionName, oldProductId, newProductId };
      const res = await API.post("/section-products/replace-product", body, config);

      return { ...res.data, sectionName, oldProductId, newProductId }; // ✅ include params for local update
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to replace product"
      );
    }
  }
);

// 🔹 DELETE PRODUCT FROM SECTION
export const deleteSectionProduct = createAsyncThunk(
  "sectionProduct/deleteSectionProduct",
  async ({ section, productId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const body = { section, productId };
      const res = await API.post("/section-products/product-remove", body, config);

      return { ...res.data, section, productId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove product from section"
      );
    }
  }
);

