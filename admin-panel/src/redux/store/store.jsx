import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSclice";
import cartReducer from "../slice/cartSlice";
import productApi from "../Api/porductApi";
import categoryApi from "../Api/categoryApi";
import subCategoryApi from "../Api/subcategoryApi";
import ordersApi from "../Api/orderApi";
import userApi from "../Api/userApi";
import { sliderApi } from "../Api/sliderApi";
import brandsApi from "../Api/brandApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subCategoryApi.reducerPath]: subCategoryApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [sliderApi.reducerPath]: sliderApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(categoryApi.middleware)
      .concat(subCategoryApi.middleware)
      .concat(ordersApi.middleware)
      .concat(userApi.middleware)
      .concat(sliderApi.middleware)
      .concat(brandsApi.middleware),
});

export default store;
