import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./categoryThunks";

const initialState = {
  categories: [],
  loading: false,
  success: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 ADD
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Category added successfully";
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 UPDATE
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(updateCategory.fulfilled, (state, action) => {
  state.loading = false;
  state.success = "Category updated successfully";

  if (action.payload) {
    const index = state.categories.findIndex(
      (cat) => (cat._id || cat.id) === (action.payload._id || action.payload.id)
    );
    if (index !== -1) {
      state.categories[index] = action.payload;
    }
  }
})
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Category deleted successfully";
        state.categories = state.categories.filter(
          (cat) => (cat._id || cat.id) !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryStatus } = categorySlice.actions;

// 🔹 Selectors
export const selectCategories = (state) => state.category.categories;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryError = (state) => state.category.error;
export const selectCategorySuccess = (state) => state.category.success;

export default categorySlice.reducer;
