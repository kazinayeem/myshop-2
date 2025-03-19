import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/reducer/authReducer";
import cartReducer from "@/reducer/cartReducer";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
