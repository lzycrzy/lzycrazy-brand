import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If user is logged in, redirect to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRedirect;
