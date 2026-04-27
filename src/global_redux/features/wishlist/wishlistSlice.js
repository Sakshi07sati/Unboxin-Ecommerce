import { createSlice } from "@reduxjs/toolkit";

// Helper to load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const serializedState = localStorage.getItem("wishlist_items");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load wishlist from storage:", err);
    return [];
  }
};

// Helper to save wishlist to localStorage
const saveWishlistToStorage = (items) => {
  try {
    const serializedState = JSON.stringify(items);
    localStorage.setItem("wishlist_items", serializedState);
  } catch (err) {
    console.error("Could not save wishlist to storage:", err);
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const getProductKey = (item) => item?._id || item?.id;

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const key = getProductKey(action.payload);
      const exists = state.items.some((item) => getProductKey(item) === key);
      if (!exists) {
        state.items.push(action.payload);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const key =
        typeof action.payload === "object"
          ? getProductKey(action.payload)
          : action.payload;
      state.items = state.items.filter((item) => getProductKey(item) !== key);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
    toggleWishlist: (state, action) => {
      const key = getProductKey(action.payload);
      const existsIndex = state.items.findIndex(
        (item) => getProductKey(item) === key
      );
      if (existsIndex !== -1) {
        state.items.splice(existsIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToStorage(state.items);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
