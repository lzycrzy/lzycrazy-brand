import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from '../components/protected/RequireAuth';
import AuthRedirect from '../components/routes/AuthRedirect';

import Auth from '../pages/Auth';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import AboutUs from '../components/static/AboutCompany';
import Services from '../components/Services/Services';
import NewsFeed from '../components/News/NewsFeed';
import TermPage from '../components/static/TermPage';
import PrivacyPolicyPage from '../components/static/PrivacyPolicyPage';
import PropertyListing from '../components/ProductDetail/ProductListing';
import PropertyViewPage from '../pages/PropertyViewPage';
import AddProduct from '../pages/AddProduct';
import MarketplaceHome from '../pages/MarketPlace';
import EnquiryForm from '../components/EnquiryForm';
import AddAdvertisement from '../pages/AddAdvertisement';
import VerifiedPage from '../pages/Verify';
import AddPage from '../pages/AddPage';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
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
    <Route path="/enquire" element={<EnquiryForm />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/services" element={<Services />} />
    <Route path="/news" element={<NewsFeed />} />
    <Route path="/terms" element={<TermPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="/market" element={<MarketplaceHome />} />
    <Route path="/property" element={<PropertyListing />} />
    <Route path="/property-view" element={<PropertyViewPage />} />
    <Route path="/verify" element={<VerifiedPage />} />
         


    {/* Private Routes */}
    <Route element={<RequireAuth />}>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      
      <Route path="/product" element={<AddProduct />} />
      <Route path="/ads" element={< AddPage/>} />
    </Route>

    {/* Fallback Routes */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
