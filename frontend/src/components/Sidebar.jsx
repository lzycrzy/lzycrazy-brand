import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';
import { LayoutDashboard, Users, ShoppingBag, Heart, Settings, LogOut, HelpCircle, Info } from 'lucide-react';

export function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const currentPath =
    location.pathname === '/' ? '/dashboard' : location.pathname;



  // Menu items with icons
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get('/users/logout', { withCredentials: true });
      dispatch(logout()); // clear redux & localStorage
      navigate('/auth'); // redirect to login page
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, still clear the local state and redirect
      dispatch(logout());
      navigate('/auth');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header with Logo */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-blue-600">LZY</span> CRAZY
          </h1>
          <button
            className="text-gray-500 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
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
                  onClick={() => setIsOpen(false)}
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
        <div className="border-t border-gray-200 px-6 py-3">
          <p className="text-xs text-gray-500">© 2025 LZYCRAZY PVT LTD</p>
        </div>
      </div>
    </>
  );
}
