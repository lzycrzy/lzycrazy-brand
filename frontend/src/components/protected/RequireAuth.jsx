// // src/components/protected/AuthChecker.jsx
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from '../../lib/axios/axiosInstance';

// const AuthChecker = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res =  await axios.get('/v1/users/getMe', {
          
//             withCredentials: true,
//           });
//         if (!res.data) throw new Error('Unauthorized');
//       } catch (err) {
//         console.warn('🔒 Session expired. Redirecting...');
//         navigate('/');
//       }
//     };

//     checkAuth(); // Run on first load

//     const interval = setInterval(() => {
//       checkAuth(); // Re-run every 60 seconds (you can change this)
//     }, 60000);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [navigate]);

//   return null; // No UI, just logic
// };

// export default AuthChecker;


// src/components/protected/RequireAuth.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function RequireAuth() {
  const { user, authChecked } = useUser();

  if (!authChecked) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500 text-lg">
        Checking authentication...
      </div>
    );
  }

  // ✅ If not authenticated, redirect to /
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};




