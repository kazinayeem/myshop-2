import { CartState } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        size?: string;
        color?: string;
        variantsName?: string;
      }>
    ) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    removeItem(state, action: PayloadAction<string>) {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    updateItemQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const itemToUpdate = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (itemToUpdate) {
        const quantityDifference =
          action.payload.quantity - itemToUpdate.quantity;
        itemToUpdate.quantity = action.payload.quantity;
        state.totalQuantity += quantityDifference;
        state.totalPrice += itemToUpdate.price * quantityDifference;
      }
    },
  },
});

export const { addItem, removeItem, clearCart, updateItemQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
