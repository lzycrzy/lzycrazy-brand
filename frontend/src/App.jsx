// import React, { useEffect } from 'react';
// import {
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
//   useNavigate,
// } from 'react-router';
// import Layout from './components/Layout';
// import Auth from './pages/Auth';
// import store from './lib/redux/store';
// import { Provider } from 'react-redux';
// import Home from './components/Home';
// import Searchbar from './components/Searchbar';

// // Protected route wrapper component
// const ProtectedRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

//   useEffect(() => {
//     if (!isLoggedIn && location.pathname !== '/auth') {
//       navigate('/auth');
//     }
//   }, [isLoggedIn, navigate, location.pathname]);

//   return isLoggedIn ? children : null;
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           {/* Auth route - accessible without login */}
//           <Route path="auth" element={<Auth />} />

//           {/* Protected routes - require login */}
//           <Route
//             path="/"
//             element={
//               // <ProtectedRoute>
//               <Navigate to="/dashboard" replace />
//               // </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/auth" replace />} />
//         </Route>
//          <Route path="test" element={<Home/>} />
//           <Route paht="searchbar" element={<Searchbar />}/>
//       </Routes>
//     </Provider>
//   );
// };

// export default App;




import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import store from './lib/redux/store';
import { Provider } from 'react-redux';
import Home from './components/Home';
import Profile from './components/Profile';
import Searchbar from './components/Searchbar';
import PrivateRoute from './components/PrivateRoute';
import AuthRedirect from './components/AuthRedirect';

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 👇 Auth route - accessible only if NOT logged in */}
          <Route
            path="auth"
            element={
              <AuthRedirect>
                <Auth />
              </AuthRedirect>
            }
          />

          {/* 👇 Protected routes */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Redirect base "/" to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>

        {/* Standalone test routes */}
        <Route path="test" element={<Home />} />
        <Route path="searchbar" element={<Searchbar />} />
      </Routes>
    </Provider>
  );
};

export default App;
