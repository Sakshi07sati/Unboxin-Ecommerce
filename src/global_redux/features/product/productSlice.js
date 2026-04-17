// productSlice.js - UPDATED
import { createSlice } from "@reduxjs/toolkit";
import { 
  addProduct, 
  deleteProduct, 
  fetchProducts, 
  updateProduct,
  fetchPublicProducts,
  fetchProductById,
  fetchProductsByCategory, 
  fetchProductsBySection
} from "./productThunks";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentProduct: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    loading: false, // Specific loading state for single product
    error: null,
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    // NEW: Track if products have been loaded at least once
    hasLoaded: false,
    // NEW: Track retry attempts and last error time to prevent infinite retries
    retryCount: 0,
    lastErrorTime: null,
    errorCooldown: 30000, // 30 seconds cooldown after error (in milliseconds)
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    // NEW: Reset loading state
    resetProductsState: (state) => {
      state.products = [];
      state.status = "idle";
      state.hasLoaded = false;
      state.error = null;
      state.retryCount = 0;
      state.lastErrorTime = null;
    },
    // NEW: Reset error state to allow retry
    resetErrorState: (state) => {
      state.error = null;
      state.retryCount = 0;
      state.lastErrorTime = null;
      state.status = "idle";
    },
    clearProducts: (state) => {
    state.products = [];
    state.hasLoaded = false;
    state.status = "idle";
    state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      // ========================================
      // EXISTING ADMIN CASES
      // ========================================
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.data || [];
        state.totalProducts = action.payload.totalProducts || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.hasLoaded = true; // NEW
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // Add product (ADMIN)
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload && action.payload._id) {
          state.products.push(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update product (ADMIN)
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (!action.payload || !action.payload._id) return;
        
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete product (ADMIN)
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ========================================
      // PUBLIC SHOP PAGE CASES - UPDATED
      // ========================================
      
      // Fetch public products (SHOP PAGE)
      .addCase(fetchPublicProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.hasLoaded = false; // NEW
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.hasLoaded = true;
        state.retryCount = 0; // Reset retry count on success
        state.lastErrorTime = null;
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // Fetch products by category (SHOP PAGE)
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.hasLoaded = false; // NEW
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.hasLoaded = true;
        state.retryCount = 0; // Reset retry count on success
        state.lastErrorTime = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // Fetch single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProduct = null;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // Fetch products by section
      .addCase(fetchProductsBySection.pending, (state) => {
        state.status = "loading";
        state.hasLoaded = false; // NEW
      })
      .addCase(fetchProductsBySection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.hasLoaded = true;
        state.retryCount = 0; // Reset retry count on success
        state.lastErrorTime = null;
      })
      .addCase(fetchProductsBySection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      });

      
  },
});

export const { clearCurrentProduct, resetProductsState, resetErrorState, clearProducts  } = productSlice.actions;
export default productSlice.reducer;