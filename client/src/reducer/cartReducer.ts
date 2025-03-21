import { CartState } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  discountPrice: 0,
  shippingPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{
        productId: string;
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
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          productId: action.payload.productId,
          name: action.payload.name,
          image: action.payload.image,
          price: action.payload.price,
          quantity: action.payload.quantity,
          size: action.payload.size,
          color: action.payload.color || "",
          variant: action.payload.variantsName,
        });
      }
      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    removeItem(state, action: PayloadAction<string>) {
      const itemToRemove = state.items.find(
        (item) => item.productId === action.payload
      );
      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.discountPrice = 0;
      state.shippingPrice = 0;
    },
    updateItemQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const itemToUpdate = state.items.find(
        (item) => item.productId === action.payload.id
      );
      if (itemToUpdate) {
        const quantityDifference =
          action.payload.quantity - itemToUpdate.quantity;
        itemToUpdate.quantity = action.payload.quantity;
        state.totalQuantity += quantityDifference;
        state.totalPrice += itemToUpdate.price * quantityDifference;
      }
    },
    setDiscountPrice(state, action: PayloadAction<number>) {
      state.discountPrice = action.payload;
    },
    setShippingPrice(state, action: PayloadAction<number>) {
      state.shippingPrice = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  clearCart,
  updateItemQuantity,
  setDiscountPrice,
  setShippingPrice,
} = cartSlice.actions;
export default cartSlice.reducer;
