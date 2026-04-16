// src/global_redux/features/section/sectionSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSections,
  addSection,
  updateSection,
  deleteSection,
} from "./sectionThunks";

const initialState = {
  sections: [],
  loading: false,
  success: null,
  error: null,
};

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    clearSectionStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 FETCH
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 ADD
      // 🔹 ADD - Updated
.addCase(addSection.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(addSection.fulfilled, (state, action) => {
  state.loading = false;
  // ✅ Don't push anything since backend doesn't return the section
  // The component will call fetchSections() to refresh the list
  state.success = "Section added successfully";
})
.addCase(addSection.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      // 🔹 UPDATE
      .addCase(updateSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = state.sections.map((section) =>
          section._id === action.payload._id ? action.payload : section
        );
        state.success = "Section updated successfully!";
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 DELETE
      .addCase(deleteSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = state.sections.filter(
          (section) => section._id !== action.payload
        );
        state.success = "Section deleted successfully!";
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSectionStatus } = sectionSlice.actions;
export default sectionSlice.reducer;