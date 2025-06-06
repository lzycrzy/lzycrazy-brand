// components/AuthRedirect.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRedirect;
