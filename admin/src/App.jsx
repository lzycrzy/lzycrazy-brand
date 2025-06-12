import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import store from './lib/redux/store';
import { Provider } from 'react-redux';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserTable from './pages/Usertable';
import Profile from './pages/Profile';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return isLoggedIn ? children : null;
};

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="auth" element={<Auth />} />
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <UserTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;
