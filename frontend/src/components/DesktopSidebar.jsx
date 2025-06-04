import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';
import { LayoutDashboard, Users, ShoppingBag, Heart, Settings, LogOut, HelpCircle, Info } from 'lucide-react';

export function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  // Menu items with icons
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get('/users/logout', { withCredentials: true });
      dispatch(logout()); // clear redux & localStorage
      navigate('/auth'); // redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Header with Logo */}
      <div className="border-b border-gray-200 px-6 py-5">
        <h1 className="text-xl font-bold text-gray-900">
          <span className="text-blue-600">LZY</span> CRAZY
        </h1>
      </div>

      {/* User Profile Section */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-purple-400">
            <img
              src={user?.image || "https://ui-avatars.com/api/?name=" + (user?.fullName || "User") + "&background=4747ED&color=fff"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.fullName || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
          
          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>
          
          {/* Help & Info */}
          <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
            Help & Support
          </button>
          
          <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Info className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
            Information
          </button>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
            Logout
          </button>
        </nav>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 mt-auto">
        <p className="text-xs text-gray-500">© 2025 LZYCRAZY PVT LTD</p>
      </div>
    </>
  );
}
