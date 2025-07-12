import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../../lib/axios/axiosInstance';
import { FaBell, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { auth } from '../../lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../../lib/redux/authSlice';
import { useUser } from '../../context/UserContext';
import { useProduct } from '../../store/useProduct';
import { toast } from 'react-toastify';
import { useAsset } from '../../store/useAsset';
import Notification from '../Header/Notification';
import { useBusinessChat } from '../../store/useBusinessChat';
import Title from '../Header/Title';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [title, setTitle] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, profilePic, displayName, setUser, logout1 } = useUser();
  const { getAssetUrl, loaded } = useAsset();
  const {
    unseenMessage,
    unreadMessagesMap,
    messages,
    subscribeToMessage,
    unsubscribeToMessage,
  } = useBusinessChat();

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);

  const totalUnreadCount = useMemo(() => {
    return (
      unseenMessage.length +
      Object.values(unreadMessagesMap).reduce(
        (acc, curr) => acc + (curr?.count || 0),
        0,
      )
    );
  }, [unseenMessage, unreadMessagesMap]);

  console.log(location.pathname)

  useEffect(() => {
    subscribeToMessage(location.pathname);
    return () => unsubscribeToMessage();
  }, [location.pathname, subscribeToMessage, unsubscribeToMessage]);

  return (
    <div className="sticky top-0 left-0 z-[100] w-full bg-white px-4 py-4 shadow-sm">
      <div className="relative mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={loaded ? getAssetUrl('logo.png') : '/missing.png'}
              alt="Logo"
              className="h-[40px] w-[100px] cursor-pointer object-contain"
            />
          </Link>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-4 lg:flex">
          <HeaderIcon
            image={loaded ? getAssetUrl('home.png') : '/missing.png'}
            to="/dashboard"
            user={user}
            alt="Home"
            name="Home"
          />
          <HeaderIcon
            image={loaded ? getAssetUrl('store.png') : '/missing.png'}
            to="/market"
            user={user}
            name="Marketplace"
            alt="Store"
          />
          <HeaderIcon
            image={loaded ? getAssetUrl('add.png') : '/missing.png'}
            user={user}
            name="Add Post"
            alt="Add"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="mr-2 hidden w-[250px] items-center rounded-full bg-gray-100 px-4 py-2 md:flex">
            <FaSearch className="text-lg text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent px-3 text-sm text-gray-700 placeholder-gray-500 outline-none"
            />
          </div>

          <div
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotification((prev) => !prev);
            }}
            onMouseLeave={() => setTitle(null)}
            onMouseEnter={() => setTitle('Notification')}
          >
            <HeaderIcon icon={FaBell} user={user} />
            {title === 'Notification' && (
              <Title title={title} setTitle={setTitle} />
            )}
            {showNotification && (
              <Notification setShowNotification={setShowNotification} />
            )}
          </div>

          <div
            className="relative"
            onMouseLeave={() => setTitle(null)}
            onMouseEnter={() => setTitle('Chat')}
            onClick={() =>
              !location.pathname.includes('/business-chat') &&
              navigate('/business-chat')
            }
          >
            <HeaderIcon icon={MdMessage} user={user} />
            <span
              className={`${
                totalUnreadCount > 0 ? 'flex' : 'hidden'
              } absolute -top-2 right-0 h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white`}
            >
              {totalUnreadCount > 0 ? `${totalUnreadCount}` : ''}
            </span>
            {title === 'Chat' && <Title title={title} setTitle={setTitle} />}
          </div>

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-300"
              >
                <img
                  src={profilePic || '/missing.png'}
                  alt="Profile"
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
                      <p className="mt-1 text-xs text-gray-500">
                        ID:{' '}
                        <span className="font-mono">
                          {user.profile.companyId.replace(/^lc\d{8}/, 'lc')}
                        </span>
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

const HeaderIcon = ({ icon: Icon, to, user, image, alt, name }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAddProductModal } = useProduct();

  const handleClick = () => {
    if (!user) {
      toast.warning('please login first!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      navigate(to);
    }
  };

  const openProductModal = () => {
    if (!user) {
      toast.warning('please login first!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }
    setIsAddProductModal(true);
  };

  const isActive = to ? location.pathname.includes(to) : false;

  return (
    <div
      onClick={name !== 'Add Post' ? handleClick : openProductModal}
      className="group relative flex cursor-pointer flex-col items-center rounded-full p-2 text-gray-700 transition"
    >
      {image ? (
        <img
          src={image || '/missing.png'}
          alt={alt || 'icon'}
          className="h-[22px] w-[22px] object-contain group-hover:brightness-110"
        />
      ) : Icon && typeof Icon === 'function' ? (
        <Icon className="text-[22px] group-hover:text-blue-600" />
      ) : null}
      <span>{name}</span>
      <div
        className={`absolute bottom-0 ${
          isActive ? 'block' : 'hidden'
        } h-1 w-full rounded bg-blue-400 group-hover:block`}
      ></div>
    </div>
  );
};

export default Header;
