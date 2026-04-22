import { createSlice } from "@reduxjs/toolkit";
import { addSubCategory, deleteSubCategory, fetchSubCategories, updateSubCategory } from "./subCategoryThunks";


const subCategorySlice = createSlice({
  name: "subCategory",
  initialState: {
    subCategories: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearSubCategoryState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch SubCategories
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add SubCategory
      .addCase(addSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subCategories.unshift(action.payload); // Add to start (latest first)
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update SubCategory
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.subCategories.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.subCategories[index] = action.payload;
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete SubCategory
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subCategories = state.subCategories.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubCategoryState } = subCategorySlice.actions;

export const selectSubCategories = (state) => state.subCategory.subCategories;
export const selectSubCategoryLoading = (state) => state.subCategory.loading;

export default subCategorySlice.reducer;