import React, { useState, useRef, useEffect } from 'react';
import {
  FaCog,
  FaUserLock,
  FaUserShield,
  FaBell,
  FaLock,
  FaUserFriends,
  FaGlobe,
  FaTools,
  FaFileAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

const SettingsMenu = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const options = [
    { label: 'Blocked Users', icon: <FaUserLock />, tabName: 'blockedUsers' },
    { label: 'Privacy Settings', icon: <FaUserShield />, tabName: 'privacySettings' },
    { label: 'Notifications', icon: <FaBell />, tabName: 'notifications' },
    { label: 'Password & Security', icon: <FaLock />, tabName: 'passwordSecurity' },
    { label: 'Manage Friends', icon: <FaUserFriends />, tabName: 'manageFriends' },
    { label: 'Language & Region', icon: <FaGlobe />, tabName: 'languageRegion' },
    { label: 'Tools & Support', icon: <FaTools />, tabName: 'toolsSupport' },
    { label: 'Reports', icon: <FaFileAlt />, tabName: 'reports' },
    { label: 'Terms & Policy', icon: <FaFileAlt />, tabName: 'termsPolicy' },
    { label: 'Logout', icon: <FaSignOutAlt />, tabName: 'logout' },
  ];

  //  Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (tabName) => {
    setActiveTab(tabName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          setActiveTab('settings'); // optional tab highlight
        }}
        className={`flex items-center justify-center rounded-md px-6 py-2 transition ${
          activeTab === 'settings'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title="Settings"
      >
        <FaCog size={22} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          {options.map(({ label, icon, tabName }, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(tabName)}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="text-gray-500 mr-3">{icon}</div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
