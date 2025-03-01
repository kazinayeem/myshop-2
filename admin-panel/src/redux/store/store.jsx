import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSclice";
import productApi from "../Api/porductApi";
import categoryApi from "../Api/categoryApi";
import subCategoryApi from "../Api/subcategoryApi";
import ordersApi from "../Api/orderApi";
import userApi from "../Api/userApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subCategoryApi.reducerPath]: subCategoryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(categoryApi.middleware)
      .concat(subCategoryApi.middleware)
      .concat(ordersApi.middleware)
      .concat(userApi.middleware),
});

export default store;
