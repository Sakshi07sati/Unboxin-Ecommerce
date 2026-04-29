import { createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  fetchPublicProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchProductsBySection,
} from "./productThunks";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentProduct: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    loading: false,
    error: null,
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    hasLoaded: false,
    retryCount: 0,
    lastErrorTime: null,
    errorCooldown: 30000,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    resetProductsState: (state) => {
      state.products = [];
      state.status = "idle";
      state.hasLoaded = false;
      state.error = null;
      state.retryCount = 0;
      state.lastErrorTime = null;
    },
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
      // ─────────────────────────────────────────
      // FETCH ALL PRODUCTS (ADMIN)
      // ─────────────────────────────────────────
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
        state.hasLoaded = true;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // ─────────────────────────────────────────
      // ADD PRODUCT (ADMIN)
      // ─────────────────────────────────────────
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

      // ─────────────────────────────────────────
      // UPDATE PRODUCT (ADMIN)
      // ─────────────────────────────────────────
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updated = action.payload;
        if (!updated || !updated._id) return;

        // FIX #2: Update products array
        const index = state.products.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.products[index] = updated;
        } else {
          state.products.push(updated);
        }

        // FIX #2: Also update currentProduct so EditProduct shows fresh data
        state.currentProduct = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ─────────────────────────────────────────
      // DELETE PRODUCT (ADMIN)
      // ─────────────────────────────────────────
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ─────────────────────────────────────────
      // FETCH PUBLIC PRODUCTS (SHOP PAGE)
      // ─────────────────────────────────────────
      .addCase(fetchPublicProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.hasLoaded = false;
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.hasLoaded = true;
        state.retryCount = 0;
        state.lastErrorTime = null;
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // ─────────────────────────────────────────
      // FETCH PRODUCTS BY CATEGORY (SHOP PAGE)
      // ─────────────────────────────────────────
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.hasLoaded = false;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.hasLoaded = true;
        state.retryCount = 0;
        state.lastErrorTime = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.hasLoaded = true;
        state.retryCount += 1;
        state.lastErrorTime = Date.now();
      })

      // ─────────────────────────────────────────
      // FETCH SINGLE PRODUCT BY ID
      // ─────────────────────────────────────────
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

      // ─────────────────────────────────────────
      // FETCH PRODUCTS BY SECTION
      // ─────────────────────────────────────────
      .addCase(fetchProductsBySection.pending, (state) => {
        state.status = "loading";
        state.hasLoaded = false;
      })
      .addCase(fetchProductsBySection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.hasLoaded = true;
        state.retryCount = 0;
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

export const {
  clearCurrentProduct,
  resetProductsState,
  resetErrorState,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;
