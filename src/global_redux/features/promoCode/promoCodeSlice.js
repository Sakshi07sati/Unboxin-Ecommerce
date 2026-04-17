// src/global_redux/features/promoCode/promoCodeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPromoCodes,
  updatePromoCode,
  deletePromoCode,
  applyPromoCode,
  removePromoCode,
} from "./promoCodeThunks";
import { addPromoCode } from "./promoCodeThunks";

const initialState = {
  promoCodes: [], // All promo codes (for admin)
  appliedPromo: null, // Currently applied promo code (for user)
  discount: 0, // Discount amount from applied promo
  finalAmount: 0, // Final amount after discount
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  message: null,
};

const promoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {
    // Clear messages
    clearPromoMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    // Remove applied promo code
    removeAppliedPromo: (state) => {
      state.appliedPromo = null;
      state.discount = 0;
      state.finalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get All Promo Codes
      .addCase(getAllPromoCodes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllPromoCodes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.promoCodes = action.payload.promo || [];
        state.message = action.payload.message;
      })
      .addCase(getAllPromoCodes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Create Promo Code
      .addCase(addPromoCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newPromo = action.payload.promo || action.payload.promoCode;
        if (newPromo) {
          state.promoCodes.push(newPromo);
        }
        state.message = action.payload.message;
      })
      .addCase(addPromoCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Update Promo Code
      .addCase(updatePromoCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Update fulfilled payload:", action.payload);
        
        // Handle different response structures
        const updatedPromo = action.payload.promoCode || action.payload.promo || action.payload.data;
        
        if (updatedPromo && updatedPromo._id) {
          const index = state.promoCodes.findIndex(
            (promo) => promo._id === updatedPromo._id
          );
          if (index !== -1) {
            state.promoCodes[index] = updatedPromo;
          }
        }
        state.message = action.payload.message || "Promo code updated successfully";
      })
      .addCase(updatePromoCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Delete Promo Code
      .addCase(deletePromoCode.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Use the id we passed along in the thunk
        const deletedId = action.payload.id;
        state.promoCodes = state.promoCodes.filter(
          (promo) => promo._id !== deletedId
        );
        state.message = action.payload.message || "Promo code deleted successfully";
      })
      .addCase(deletePromoCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Apply Promo Code
        .addCase(applyPromoCode.pending, (state) => {
        state.status = "loading";
      })
      // ✅ Apply Promo Code
.addCase(applyPromoCode.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.appliedPromo = { 
    code: action.meta.arg.code,
    productName: action.meta.arg.productName // Store product name
  };
  state.discount = action.payload.discount;
  state.finalAmount = action.payload.finalAmount;
})
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Remove Promo Code
     // Remove Promo Code
.addCase(removePromoCode.fulfilled, (state) => {
  state.appliedPromo = null;
  state.discount = 0;
  state.finalAmount = 0;
  state.message = "Promo code removed";
  state.error = null;
  state.status = "idle"; // ✅ Reset status
})

  },
});

export const { clearPromoMessage, removeAppliedPromo } = promoCodeSlice.actions;
export default promoCodeSlice.reducer;