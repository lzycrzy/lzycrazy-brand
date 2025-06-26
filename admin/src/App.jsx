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
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserTable from './pages/UserTable';
import Profile from './pages/Profile';
import MarketPost from './pages/MarketPost';
import AddNews from './pages/AddNews';
import AddService1 from './pages/AddServices';
import AddCategory from './pages/AddCategory';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ClientEnquiry from './components/Client/ClientEnquiry';
import NewsForm from './components/News/AddNews';
import NewsList from './components/News/NewsList';
import ApplicationsList from './components/Applications/ApplicationsList';
import AddService from './components/Services/AddService';
import ServiceList from './components/Services/ServiceList';
import AddServices1 from './pages/AddServices';
import Banner from './components/Business/Banner';
import Category from './components/Business/Category';
import Logo from './components/Business/Logo';
import Card from './components/Business/Card';
import HiringApplicationsTable from './components/Applications/Hiring';
// Protected route wrapper
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
          <Route path="auth" element={<Auth />} />
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
          
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <UserTable />
              </ProtectedRoute>
            }
          />

<Route  path="/shop/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
           <Route
            path="/shop/banner"
            element={
              <ProtectedRoute>
                <Banner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop/logo"
            element={
              <ProtectedRoute>
                <Logo />
              </ProtectedRoute>
            }
          />
           <Route
            path="/shop/card"
            element={
              <ProtectedRoute>
                <Card/>
              </ProtectedRoute>
            }
          />
          <Route path="/services/add" element={ <ProtectedRoute>
                <AddService />
              </ProtectedRoute>} />
          <Route path="/services/list"  element={ <ProtectedRoute>
                <ServiceList />
              </ProtectedRoute>} />
              <Route path="/edit-service/:id" element={<AddService />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/News/list"
            element={
              <ProtectedRoute>
                < NewsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                < ApplicationsList />
              </ProtectedRoute>
            }
          />
                <Route
            path="/news/add"
            element={
              <ProtectedRoute>
                < NewsForm/>
              </ProtectedRoute>
            }
          />
            <Route
            path="/Applications/Hiring"
            element={
              <ProtectedRoute>
                <HiringApplicationsTable />
              </ProtectedRoute>
            }
          />

           <Route
            path="/client-enquiry"
            element={
              <ProtectedRoute>
                <ClientEnquiry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <AddServices1 />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/services"
            element={
              <ProtectedRoute>
                <AddService />
              </ProtectedRoute>
            }
          /> */}
           <Route
            path="/services"
            element={
              <ProtectedRoute>
                <AddService />
              </ProtectedRoute>
            }
          />
           <Route
            path="/category"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;