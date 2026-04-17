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
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);


export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Product Data:", productData);
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
      console.log("Add response:", res.data);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add product");
    }
  }
);

// FIXED: Update a product - using API instance instead of axios
// In your productThunks.js
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Updating product with ID:", id);
      if (productData instanceof FormData) {
        console.log("Updated data (FormData contents):");
        for (let pair of productData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }
      } else {
        console.log("Updated data:", productData);
      }

      const isFormData = productData instanceof FormData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // For FormData, let axios set Content-Type automatically (with boundary)
      // For JSON, explicitly set Content-Type
      if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
      }

      const res = await API.put(`/products/${id}`, productData, config);
      console.log("Update response:", res.data);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      console.error("Update error:", err);

      const errorMessage =
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

      const res = await API.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)
      return productId; // return the deleted product ID for updating Redux state
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
      // NO TOKEN NEEDED - Public endpoint
      const res = await API.get("/products");
      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

// ===== OPTIONAL: Add if you want category filtering from backend =====
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await API.get(`/product?category=${category}`);
      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

// ===== OPTIONAL: Add for single product page =====
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      console.log('API call for product ID:', id); // Check this
      const res = await API.get(`/products/${id}`);
      console.log('API Response:', res.data);
      
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      console.error('API Error:', err.response || err);
      return rejectWithValue(
        err.response?.data?.message || 
        err.message || 
        "Failed to fetch product"
      );
    }
  }
);


// productThunks.js
export const fetchProductsBySection = createAsyncThunk(
  "products/fetchProductsBySection",
  async (section, { rejectWithValue }) => {
    try {
      console.log("Fetching products for section:", section);
      const res = await API.get(`/section/${section}`); // ✅ correct backend URL
      console.log("API Response for section:", res.data);

      // ✅ Extract array from res.data.data
      return res.data.data || [];
    } catch (err) {
      console.error("API Error:", err.response || err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products by section"
      );
    }
  }
);


// export const fetchProductsByCategory = createAsyncThunk(
//   "products/fetchProductsByCategory",
//   async (categoryName, { rejectWithValue }) => {
//     try {
//       console.log("API call for category:", categoryName);
//       const res = await API.get(`/category/${categoryName}`);
//       console.log("API Response:", res.data);

//       // Assuming API returns an array or object with a 'products' key
//       const products = res.data.products || res.data;
//       console.log("Returning category products:", products);

//       return products;
//     } catch (err) {
//       console.error("API Error (category):", err.response || err);
//       return rejectWithValue(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to fetch products by category"
//       );
//     }
//   }
// );
