import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSclice";
import productApi from "../Api/porductApi";
import categoryApi from "../Api/categoryApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware)
    .concat(categoryApi.middleware),
});

export default store;
