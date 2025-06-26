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
  hiringInProgress: localStorage.getItem('hiringInProgress') === 'true', // NEW: Track hiring process
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

    // NEW: Set hiring in progress
    setHiringInProgress: (state, action) => {
      state.hiringInProgress = action.payload;
      localStorage.setItem('hiringInProgress', action.payload);
    },

    // NEW: Clear hiring process and complete login
    completeHiringLogin: (state, action) => {
      const userData = action.payload.data || null;
      const token = action.payload.token;

      state.isAuthenticated = true;
      state.user = userData;
      state.hiringInProgress = false;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('hiringInProgress');
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.hiringInProgress = false;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('hiringInProgress');
      localStorage.removeItem('token');
    },
  },
});

export default authSlice.reducer;
export const { login, logout, setHiringInProgress, completeHiringLogin } = authSlice.actions;