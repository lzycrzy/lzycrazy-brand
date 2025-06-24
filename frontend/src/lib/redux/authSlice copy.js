import { createSlice } from '@reduxjs/toolkit';

// Safe parse user from localStorage
let user = null;
try {
  const userData = localStorage.getItem('user');
  if (userData && userData !== 'undefined') {
    user = JSON.parse(userData);
  }
} catch (error) {
  console.error('Invalid user JSON in localStorage:', error);
  localStorage.removeItem('user'); // Optional: Clean up corrupted value
}

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const isAuthenticated = action.payload.success;
      const userData = action.payload.data || null;

      state.isAuthenticated = isAuthenticated;
      state.user = userData;

      localStorage.setItem('isAuthenticated', isAuthenticated);

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
