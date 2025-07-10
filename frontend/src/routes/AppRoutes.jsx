import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

const RequireAuth = React.lazy(() => import('../components/protected/RequireAuth'));
const AuthRedirect = React.lazy(() => import('../components/routes/AuthRedirect'));
const Auth = React.lazy(() => import('../pages/Auth'));
const Home = React.lazy(() => import('../pages/Home'));
const Profile = React.lazy(() => import('../pages/Profile'));
const ForgotPassword = React.lazy(() => import('../components/Auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../components/Auth/ResetPassword'));
const AboutUs = React.lazy(() => import('../components/static/AboutCompany'));
const Services = React.lazy(() => import('../components/Services/Services'));
const NewsFeed = React.lazy(() => import('../components/News/NewsFeed'));
const TermPage = React.lazy(() => import('../components/static/TermPage'));
const PrivacyPolicyPage = React.lazy(() => import('../components/static/PrivacyPolicyPage'));
const PropertyListing = React.lazy(() => import('../components/ProductDetail/ProductListing'));
const PropertyViewPage = React.lazy(() => import('../pages/PropertyViewPage'));
const AddProduct = React.lazy(() => import('../pages/AddProduct'));
const MarketplaceHome = React.lazy(() => import('../pages/MarketPlace'));
const EnquiryForm = React.lazy(() => import('../components/EnquiryForm'));
const AddAdvertisement = React.lazy(() => import('../pages/AddAdvertisement'));
const VerifiedPage = React.lazy(() => import('../pages/Verify'));
const AddPage = React.lazy(() => import('../pages/AddPage'));
const WorkInProgress = React.lazy(() => import('../components/workInProgress/WorkInProgress'));
const ImageDetail = React.lazy(() => import('../components/Posts/ImageDetail'));
const Temp = React.lazy(() => import('../pages/temp'));

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
    {/* <Route path="/progress" element={<WorkInProgress />} /> // Work in Progress Page
    <Route path="/password/forgot" element={<ForgotPassword />} />
    <Route path="/password/reset/:token" element={<ResetPassword />} />
    <Route path="/enquire" element={<EnquiryForm />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/services" element={<Services />} />
    <Route path="/news" element={<WorkInProgress />} />
    <Route path="/terms" element={<TermPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="/market" element={<WorkInProgress />} />
    <Route path="/property" element={<PropertyListing />} />
    <Route path="/property-view" element={<PropertyViewPage />} />
    <Route path="/verify" element={<VerifiedPage />} /> */}
    <Route path="/temp" element={<Temp />} />
         
    <Route path="/onBoarding" element={<WorkInProgress />} /> // Work in Progress Page
    <Route path="/progress" element={<WorkInProgress />} /> // Work in Progress Page
    <Route path="/password/forgot" element={<ForgotPassword/>} />
    <Route path="/password/reset/:token" element={<ResetPassword/>} />
    <Route path="/enquire" element={<EnquiryForm />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/services" element={<Services />} />
    <Route path="/news" element={<NewsFeed />} />
    <Route path="/terms" element={<TermPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    {/* <Route path="/market" element={<WorkInProgress />} /> */}
    <Route path="/market" element={<MarketplaceHome />} />
    <Route path="/property" element={<PropertyListing />} />
    <Route path="/property-view" element={<PropertyViewPage />} />
    <Route path="/verify" element={<VerifiedPage />} />

      {/* Private Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/image-detail" element={<ImageDetail />} />

        <Route path="/profile" element={<Profile />} />
        
        <Route path="/product" element={<AddProduct />} />
        <Route path="/ads" element={< AddPage/>} />
      </Route>

      {/* Fallback Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  // </Suspense>
);

export default AppRoutes;