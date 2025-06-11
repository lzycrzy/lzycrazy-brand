import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FaHome,
  FaBell,
  FaPlus,
  FaSignOutAlt,
  FaSearch,
  FaFileVideo,
} from 'react-icons/fa';
import { SiCoinmarketcap } from 'react-icons/si';
import { BsCameraReels } from 'react-icons/bs';
import { MdOutlineChat } from 'react-icons/md';

import logo from '../assets/logo.png';
import { auth } from '../lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../lib/redux/authSlice';
import { useUser } from '../context/UserContext'; // ✅ context hook

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user,profilePic, setUser } = useUser(); // ✅ access context

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      dispatch(logout());
      setUser(null); // ✅ clear context
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 left-0 z-[100] w-full bg-white px-4 py-2 shadow-sm">
      <div className="relative mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-[40px] w-[100px] cursor-pointer object-contain"
            />
          </Link>
        </div>

        {/* Center - Tabs */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-4 lg:flex">
          <HeaderIcon icon={FaHome} />
          <HeaderIcon icon={SiCoinmarketcap} />
          <HeaderIcon icon={FaFileVideo} />
          <HeaderIcon icon={BsCameraReels} />
          <HeaderIcon icon={MdOutlineChat} />
        </div>

        {/* Right - Search + Icons */}
        <div className="flex items-center gap-3">
          <div className="mr-2 hidden w-[250px] items-center rounded-full bg-gray-100 px-4 py-2 md:flex">
            <FaSearch className="text-lg text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent px-3 text-sm text-gray-700 placeholder-gray-500 outline-none"
            />
          </div>

          {/* Action Icons */}
          <HeaderIcon icon={FaBell} to="/notifications" />
          <HeaderIcon icon={FaPlus} to="/add" />

          {/* Profile Button */}
          <button
            onClick={() => {
              setIsDropdownOpen((prev) => !prev);
              navigate('/profile');
            }}
            className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-300"
          >
            <img
              src={profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-16 right-4 z-50 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow-md"
            >
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="truncate text-sm text-gray-600">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <div className="py-2 hover:bg-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-700"
                >
                  <FaSignOutAlt /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeaderIcon = ({ icon: Icon, to }) => {
  const content = (
    <div className="group cursor-pointer rounded-full p-2 text-gray-700 transition hover:bg-gray-100">
      <Icon className="text-[22px] group-hover:text-blue-600" />
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default Header;
