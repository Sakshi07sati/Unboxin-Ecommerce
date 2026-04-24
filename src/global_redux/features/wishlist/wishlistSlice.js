import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [],
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
			}
		},
		removeFromWishlist: (state, action) => {
			const key = typeof action.payload === "object" ? getProductKey(action.payload) : action.payload;
			state.items = state.items.filter((item) => getProductKey(item) !== key);
		},
		clearWishlist: (state) => {
			state.items = [];
		},
		toggleWishlist: (state, action) => {
			const key = getProductKey(action.payload);
			const exists = state.items.some((item) => getProductKey(item) === key);
			if (exists) {
				state.items = state.items.filter((item) => getProductKey(item) !== key);
			} else {
				state.items.push(action.payload);
			}
		},
	},
});

export const { addToWishlist, removeFromWishlist, clearWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
