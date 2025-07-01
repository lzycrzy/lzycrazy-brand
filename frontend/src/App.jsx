// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router';
// import { Provider } from 'react-redux';
// import store from './lib/redux/store';

// import { UserProvider } from './context/UserContext'; //  import UserContext

// import Auth from './pages/Auth';
// import Home from './pages/Home';
// import Profile from './pages/Profile';
// import Searchbar from './components/Searchbar';
// import PrivateRoute from './components/routes/PrivateRoute';
// import AuthRedirect from './components/AuthRedirect';
// import ResetPassword from './components/ResetPassword';
// import AboutUs from './components/About2';
// import NewsFeed from './components/NewsFeed';
// import Services from './components/Services';
// import TermPage from './components/TermPage';
// import ForgotPassword from './components/ForgotPassword';
// import PrivacyPolicyPage from './components/PrivacyPagePolicy';
// import MarketplaceHome from './pages/MarketPlace';
// import { ToastContainer } from 'react-toastify'; // ✅ Import Toast
// import 'react-toastify/dist/ReactToastify.css'; // ✅ Toast styles
// import PropertyListing from './components/ProductDetail/ProductListing';
// import PropertyViewPage from './pages/PropertyViewPage';


// const App = () => {
//   return (
//     <Provider store={store}>
//       <UserProvider> {/*  Wrap everything in UserProvider */}

//           {/* ✅ Global ToastContainer */}
//           <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
         
//         />

//         <Routes>
//           {/* Routes restricted to unauthenticated users only */}
//           <Route
//             path="/"
//             element={
//               <AuthRedirect>
//                 <Auth />
//               </AuthRedirect>
//             }
//           />
//           <Route path="/property-view" element={<PropertyViewPage />} />
//            <Route
//             path="/about"
//             element={
//               <AuthRedirect>
//                 <AboutUs />
//               </AuthRedirect>
//             }
//           />
        
//           <Route path="/terms" element={<TermPage />} />
          
//             <Route path="/news" element={<NewsFeed />} />
//             <Route path="/privacy" element={<PrivacyPolicyPage />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="/market" element={ <MarketplaceHome />} />
//             <Route path="/property" element={  <PropertyListing />} />

            

//           {/* Password recovery flow (publicly accessible) */}
//           <Route path="/password/forgot" element={<ForgotPassword />} />
//           <Route path="/password/reset/:token" element={<ResetPassword />} />
         
//           {/* Authenticated routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Home />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <Profile />
//               </PrivateRoute>
//             }
//           />

//           {/* Redirect root URL to dashboard */}
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />

//           {/* Catch-all for unknown paths */}
//           <Route path="*" element={<Navigate to="/auth" replace />} />

//           {/* Dev/test routes */}
//           <Route path="/test" element={<Home />} />
//           <Route path="/searchbar" element={<Searchbar />} />
//         </Routes>
//       </UserProvider>
//     </Provider>
//   );
// };

// export default App;



//new

import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './lib/redux/store';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes/AppRoutes';

import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Provider store={store} >
     
    <UserProvider>
    
        {/* <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
          style={{ zIndex: 9999 }}
        
        
          pauseOnHover
        /> */}
        <AppRoutes />
      
    </UserProvider>
  </Provider>
);

export default App;
