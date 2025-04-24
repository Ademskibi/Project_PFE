// src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Stores user information (e.g., role, id, name)
  token: null, // Stores the JWT token
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Save user and token on login
    setUser: (state, action) => {
      const { user, token } = action.payload;

      if (!user || !token) {
        console.error('❌ Invalid payload for setUser:', action.payload);
        return;
      }

      state.user = user; // Set user details
      state.token = token; // Set token
    },

    // Optional: Update specific user fields without overwriting the entire user object
    updateUser: (state, action) => {
      if (!state.user) {
        console.error('❌ Cannot update user: No user exists in state.');
        return;
      }

      state.user = { ...state.user, ...action.payload };
    },

    // Clear everything on logout
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;