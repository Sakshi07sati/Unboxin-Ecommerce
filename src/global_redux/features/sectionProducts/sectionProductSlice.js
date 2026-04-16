import { createSlice } from "@reduxjs/toolkit";
import { fetchSectionsProduct, addSectionProduct, replaceSectionProduct, deleteSectionProduct } from "./sectionProductThunks";

const sectionProductSlice = createSlice({
  name: "sectionProduct",
  initialState: {
    sections: [],
    loading: false,
    error: null,
    success: null,
    hasLoaded: false, // Track if sections have been loaded at least once
  },
  reducers: {
    clearSectionState: (state) => {
      state.sections = [];
      state.loading = false;
      state.error = null;
      state.success = null;
      state.hasLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Section Products
      .addCase(fetchSectionsProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionsProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
        state.hasLoaded = true; // Mark as loaded
      })
      .addCase(fetchSectionsProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasLoaded = true; // Mark as loaded even on error to prevent infinite retries
      })

      // 🔹 Add Product to Section
      .addCase(addSectionProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSectionProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Product added successfully";

        // ✅ update the specific section locally (optional)
        const updatedSection = action.payload.updatedSection || action.payload.section;
        if (updatedSection) {
          const index = state.sections.findIndex(
            (sec) => sec._id === updatedSection._id
          );
          if (index !== -1) {
            state.sections[index] = updatedSection;
          } else {
            state.sections.push(updatedSection);
          }
        }
      })
      .addCase(addSectionProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      // 🔹 Replace Product in Section
.addCase(replaceSectionProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
  state.success = null;
})
.addCase(replaceSectionProduct.fulfilled, (state, action) => {
  state.loading = false;
  state.success = action.payload.message || "Product replaced successfully";

  // ✅ Update the section locally
  const { sectionName, oldProductId, newProductId } = action.payload;
  const sectionIndex = state.sections.findIndex(
    (sec) => sec.section === sectionName
  );

  if (sectionIndex !== -1) {
    const products = state.sections[sectionIndex].products;
    const productIndex = products.findIndex((p) => {
      const pid = typeof p === "string" ? p : p._id || p;
      return pid === oldProductId;
    });

    if (productIndex !== -1) {
      state.sections[sectionIndex].products[productIndex] = newProductId;
    }
  }
})
.addCase(replaceSectionProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// 🔹 Delete Product from Section
.addCase(deleteSectionProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
  state.success = null;
})
.addCase(deleteSectionProduct.fulfilled, (state, action) => {
  state.loading = false;
  state.success = action.payload.message || "Product removed successfully";

  const { section: sectionName, productId } = action.payload;
  const sectionIndex = state.sections.findIndex(
    (sec) => sec.section === sectionName
  );

  if (sectionIndex !== -1) {
    state.sections[sectionIndex].products = state.sections[
      sectionIndex
    ].products.filter((p) => {
      const pid = typeof p === "string" ? p : p._id || p;
      return pid !== productId;
    });
  }
})
.addCase(deleteSectionProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },
});

export const { clearSectionState } = sectionProductSlice.actions;
export default sectionProductSlice.reducer;
