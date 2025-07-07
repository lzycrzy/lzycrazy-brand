import React, { useState, useEffect, useRef } from 'react';
import { logout } from '../lib/redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router';
import instance from '../utils/axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Map paths to page names
  const getPageName = (path) => {
    const route = path === '/' ? '/dashboard' : path;
    const pathSegments = route.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Dashboard';

    // Convert kebab-case to Title Case
    return pathSegments[0]
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageName = getPageName(location.pathname);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await instance.get('/admin/logout', { withCredentials: true }); // send cookie
      dispatch(logout()); // clear redux & localStorage
      navigate('/auth'); // redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Sidebar Menu - slides from left */}
      <div 
        style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        className={`bg-opacity-5 fixed inset-0 z-40 transition-opacity duration-300 sm:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:hidden`}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              className="text-gray-500 focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
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
        </div>

        <div className="px-4 py-4">
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-500">Search</p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="w-full rounded-lg border-0 bg-[#f3f6fd] py-2 pr-4 pl-10 text-sm placeholder-gray-400 focus:outline-none"
                placeholder="Search"
              />
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              <button className="flex w-full items-center rounded-lg p-2 text-left text-gray-700 hover:bg-gray-100">
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                <span>Notifications</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center rounded-lg p-2 text-left text-gray-700 hover:bg-gray-100">
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
                <span>Dark Mode</span>
              </button>
            </li>
            <li>
              <button className="flex w-full items-center rounded-lg p-2 text-left text-gray-700 hover:bg-gray-100">
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Information</span>
              </button>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex w-full items-center rounded-lg p-2 text-left text-gray-700 hover:bg-gray-100"
              >
                <div className="mr-3 h-5 w-5 flex-shrink-0 overflow-hidden rounded-full">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <button
                className="flex w-full items-center rounded-lg p-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  handleLogout();
                }}
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-blue-50/70 px-6 py-3">
        {/* Top section with breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium text-green-600">Pages</span>
          <span className="mx-1">/</span>
          <span>{pageName}</span>
        </div>

        {/* Bottom section with title and actions */}
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          {/* Title */}
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            {pageName}
          </h1>

          {/* Mobile menu button - only visible on smallest screens */}
          <button
            className="absolute top-4 right-4 text-gray-500 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Right side with search and actions - only visible on desktop */}
          <div className="hidden flex-shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm sm:flex">
            {/* Search */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="xs:w-32 w-24 rounded-full border-0 bg-[#f4f7fe] py-2 pr-4 pl-10 text-sm placeholder-gray-400 focus:outline-none sm:w-36 md:w-44 lg:w-56"
                placeholder="Search"
              />
            </div>

            {/* Action items container */}
            <div className="flex items-center">
              {/* Notification Bell */}
              <button className="mx-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
              </button>

              {/* Theme Toggle - Moon Icon */}
              <button className="mx-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              </button>

              {/* Info Icon */}
              <button className="mx-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>

              {/* Profile Avatar with Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  className="ml-1 h-8 w-8 overflow-hidden rounded-full focus:outline-none"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-4 w-48 rounded-md bg-white py-1 shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
