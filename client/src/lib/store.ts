import addressApi from "@/api/addressApi";
import brandsApi from "@/api/BrandApi";
import categoryApi from "@/api/categoryApi";
import ordersApi from "@/api/orderApi";
import productApi from "@/api/productApi";
import sliderApi from "@/api/sliderApi";
import userApi from "@/api/userApi";
import authReducer from "@/reducer/authReducer";
import cartReducer from "@/reducer/cartReducer";
import { configureStore } from "@reduxjs/toolkit";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      [brandsApi.reducerPath]: brandsApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [sliderApi.reducerPath]: sliderApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [ordersApi.reducerPath]: ordersApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(brandsApi.middleware)
        .concat(categoryApi.middleware)
        .concat(userApi.middleware)
        .concat(productApi.middleware)
        .concat(addressApi.middleware)
        .concat(ordersApi.middleware)
        .concat(sliderApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
