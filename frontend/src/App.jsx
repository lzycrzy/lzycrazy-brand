import React from 'react';
import { Routes, Route, Navigate } from 'react-router';

import Auth from './pages/Auth';
import store from './lib/redux/store';
import { Provider } from 'react-redux';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Searchbar from './components/Searchbar';
import PrivateRoute from './components/PrivateRoute';
import AuthRedirect from './components/AuthRedirect';
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        {/* Routes restricted to unauthenticated users only (e.g., login/register) */}
        <Route
          path="auth"
          element={
            <AuthRedirect>
              <Auth />
            </AuthRedirect>
          }
        />

        {/* Password recovery flow (accessible without login) */}
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* ✅ Authenticated user dashboard (only accessible after login) */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* 👤 Profile page (protected route, requires authentication) */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/*  Redirect root URL to dashboard for logged-in users */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/*  Catch-all route: redirect any unknown path to auth page */}
        <Route path="*" element={<Navigate to="/auth" replace />} />

        {/*  Dev/test routes (used during development, not protected) */}
        <Route path="test" element={<Home />} />
        <Route path="searchbar" element={<Searchbar />} />
      </Routes>
    </Provider>
  );
};

export default App;
