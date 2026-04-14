import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import categoryReducer from "../features/category/categorySlice";
import bannerReducer from "../features/banner/bannerSlice";
import productReducer from "../features/product/productSlice";
import subCategoryReducer from "../features/subCategory/subCategorySlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ✅ Vite compatibility for redux-persist storage
const fixedStorage = storage.default || storage;

// 🔐 Persist config
const authPersistConfig = {
  key: "auth",
  storage: fixedStorage,
  whitelist: ["user", "token", "permissions", "admin"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    category: categoryReducer,
    banner: bannerReducer,
    subCategory: subCategoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
