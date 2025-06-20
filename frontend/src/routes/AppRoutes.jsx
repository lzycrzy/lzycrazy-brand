import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/routes/PrivateRoute';
import AuthRedirect from '../components/routes/AuthRedirect';

import Auth from '../pages/Auth';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import AboutUs from '../components/static/AboutCompany';
import Services from '../components/Services/Services';
import NewsFeed from '../components/News/NewsFeed';
import TermPage from '../components/static/TermPage';
import PrivacyPolicyPage from '../components/static/PrivacyPolicyPage';
import MarketplaceHome from '../pages/Marketplace';
import PropertyListing from '../components/ProductDetail/ProductListing';
import PropertyViewPage from '../pages/PropertyViewPage';
import AddProduct from '../pages/AddProduct';
// import Searchbar from '../components/common/Searchbar';

const AppRoutes = () => (
  <Routes>
    {/* Public only routes */}
    <Route
      path="/"
      element={
        <AuthRedirect>
          <Auth />
        </AuthRedirect>
      }
    />
    <Route path="/password/forgot" element={<ForgotPassword />} />
    <Route path="/password/reset/:token" element={<ResetPassword />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/services" element={<Services />} />
    <Route path="/news" element={<NewsFeed />} />
    <Route path="/terms" element={<TermPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="/market" element={<MarketplaceHome />} />
    <Route path="/property" element={<PropertyListing />} />
    <Route path="/property-view" element={<PropertyViewPage />} />

    {/* Private Routes */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />
     <Route path="/Product" element={  <PrivateRoute><AddProduct /></PrivateRoute>} />

    {/* Dev/Test */}
    {/* <Route path="/test" element={<Home />} /> */}
    {/* <Route path="/searchbar" element={<Searchbar />} /> */}

    {/* Redirects */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
