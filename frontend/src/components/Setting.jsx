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
import { useNavigate } from 'react-router-dom';

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
  
    // Close on outside click logic here...
  
    const handleOptionClick = (tabName) => {
      setActiveTab(tabName);
      setIsOpen(false);
    };
  
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setActiveTab('settings'); // Optional, if you want highlight
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
