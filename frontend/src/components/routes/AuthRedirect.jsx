import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const { user, authChecked } = useUser();

  // Wait for auth check
  if (!authChecked) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500 text-lg">
        Checking authentication...
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRedirect;
