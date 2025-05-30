// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    itemsByUserId: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const { userId, item } = action.payload;
      if (!state.itemsByUserId[userId]) {
        state.itemsByUserId[userId] = [];
      }
      state.itemsByUserId[userId].push(item);
    },
    clearCart: (state, action) => {
      const userId = action.payload;
      delete state.itemsByUserId[userId];
    },
    removeFromCart: (state, action) => {
      const userId = action.payload.userId;
      const productId = action.payload.productId;
    
      if (state.itemsByUserId[userId]) {
        state.itemsByUserId[userId] = state.itemsByUserId[userId].filter(
          (item) => item.productId !== productId
        );
      }
    },
    
  },
});

export const { addToCart, clearCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
