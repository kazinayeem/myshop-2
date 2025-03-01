import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSclice";
import productApi from "../Api/porductApi";
import categoryApi from "../Api/categoryApi";
import subCategoryApi from "../Api/subcategoryApi";
import ordersApi from "../Api/orderApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subCategoryApi.reducerPath]: subCategoryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(categoryApi.middleware)
      .concat(subCategoryApi.middleware)
      .concat(ordersApi.middleware),
});

export default store;
