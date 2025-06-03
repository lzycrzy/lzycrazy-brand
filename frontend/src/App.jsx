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
import Home from './components/Home';

// Protected route wrapper component
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
          {/* Auth route - accessible without login */}
          <Route path="auth" element={<Auth />} />

          {/* Protected routes - require login */}
          <Route
            path="/"
            element={
              // <ProtectedRoute>
              <Navigate to="/dashboard" replace />
              // </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>
         <Route path="test" element={<Home/>} />
      </Routes>
    </Provider>
  );
};

export default App;
