// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/ProductSlice";
import userReducer from "../features/user/userSlice"; // Corrected import name
import cartSlice from "../features/cart/cartSlice";
import orderSlice from "../features/order/orderSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer, // Corrected reducer name
    cart: cartSlice,
    order: orderSlice,
  },
});

export default store;
