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
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
