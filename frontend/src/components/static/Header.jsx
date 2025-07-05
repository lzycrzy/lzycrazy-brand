import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../../lib/axios/axiosInstance';
import {
  FaHome,
  FaBell,
  FaPlus,
  FaSignOutAlt,
  FaSearch,
  FaFileVideo,
} from 'react-icons/fa';

import store from '../../assets/store.png'; // Replace with your actual path
import logo from '../../assets/logo.png';
import home from '../../assets/home.png';
import movie from '../../assets/movie-reel.png';
import play from '../../assets/play-button-arrowhead.png';
import add from '../../assets/add.png';
import hand from '../../assets/hand.png';
import { auth } from '../../lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../../lib/redux/authSlice';
import { useUser } from '../../context/UserContext';
import Loader from '../common/Spinner';
import AddPage from '../../pages/AddPage';
import AddProduct from '../../pages/AddProduct';
import { useProduct } from '../../store/useProduct';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, profilePic, displayName, setUser, logout1 } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      logout1();
      dispatch(logout());

      await axios.post('/v1/users/logout', {}, { withCredentials: true });

      navigate('/');
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
    console.log('User object:', user);

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
          <HeaderIcon image={home} to="/" user={user} />
          <HeaderIcon image={store} to="/market" user={user} />

          <HeaderIcon image={add} user={user} />
          <HeaderIcon image={movie} to="/" user={user} />
          <HeaderIcon image={play} to="/" user={user} />
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

          <HeaderIcon icon={FaBell} to="/" user={user} />

          {/* Profile Button & Dropdown - Only show if user is logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-300"
              >
                <img
                  src={
                    profilePic || 'https://i.ibb.co/2kR5zq0/default-avatar.png'
                  }
                  alt="Profile"
                  onError={(e) => {
                    e.target.src =
                      'https://i.ibb.co/2kR5zq0/default-avatar.png';
                  }}
                  className="h-full w-full object-cover"
                />
              </button>

    {isDropdownOpen && (
      <div
        ref={dropdownRef}
        className="absolute top-12 right-0 z-50 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow-md"
      >
        <div className="px-4 py-3">
          <p
            onClick={() => {
              navigate('/profile');
              setIsDropdownOpen(false);
            }}
            className="cursor-pointer text-sm font-semibold text-gray-900 hover:underline"
          >
            {displayName || 'User'}
          </p>
          {user?.profile?.companyId && (
    <p className="text-xs text-gray-500 mt-1">
      ID: <span className="font-mono">{user.profile.companyId.replace(/^lc\d{8}/, 'lc')}</span>
    </p>
  )}
          <p className="truncate text-sm text-gray-600">
            {user?.profile?.email || 'user@example.com'}
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
)}
        </div>
      </div>
    </div>
  );
};

const HeaderIcon = ({ icon: Icon, to, user, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      alert('Please login first');
      navigate('/');
    } else {
      navigate(to);
    }
  };

  const {setIsAddProductModal} = useProduct();

  const openProductModal = () => {
    setIsAddProductModal(true);
  }

  return (
    <div
      onClick={to ? handleClick : openProductModal}
      className="group cursor-pointer rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
    >
      {image ? (
        <img
          src={image}
          alt="custom icon"
          className="h-[22px] w-[22px] object-contain group-hover:brightness-110"
        />
      ) : (
        <Icon className="text-[22px] group-hover:text-blue-600" />
      )}
    </div>
  );
};


export default Header;
