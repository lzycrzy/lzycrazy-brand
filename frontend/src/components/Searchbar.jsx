import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/lzy logo.jpg';
import HiringFormModal from '../components/HiringFormModal'; // Make sure this path is correct
import HiringTaskModal from '../components/HiringTaskModal';
import SuccessPopup from '../components/SuccessPopup';
import NewsFeed from '../components/NewsFeed'; // Adjust path as needed

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showHiring, setShowHiring] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Search Query:', query, '| Category:', activeTab);
    }
  };

  const tabs = [
    { name: 'About Us', path: '/about' },
    { name: 'LzyCrazy Services', path: '/services' },
    { name: 'LzyCrazy Marketplace', path: '/market' },
    { name: 'We Are Hiring', path: '/careers' }, // This will trigger modal
    { name: 'LzyCrazy News', path: '/news' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    if (tab.name === 'We Are Hiring') {
      setShowHiring(true); // Open modal
    }  else  {
          navigate(tab.path);
          }
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-start bg-[#ebf3fe] pt-14 pb-24">
      {/* Logo */}
      <div className="mt-4 mb-8">
        <img
          src={logo}
          alt="LzyCrazy Logo"
          className="w-44 opacity-90 mix-blend-multiply md:w-60"
        />
      </div>

      {/* Search Box */}
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-2xl transition"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
          className="w-full rounded-full border border-gray-300 px-14 py-4 shadow-md focus:outline-none"
        />
        <button
          type="submit"
          className="absolute top-1/2 left-5 -translate-y-[45%] text-xl text-purple-500"
        >
          🔍
        </button>
      </form>

      {/* Hiring Form Modal */}
      <HiringFormModal
  isOpen={showHiring}
  onClose={() => setShowHiring(false)}
  onSubmitSuccess={() => setShowTask(true)}
/>

<HiringTaskModal isOpen={showTask} onClose={() => setShowTask(false)} onSubmitSuccess={() => setShowSuccess(true)}/>
<SuccessPopup  isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Tabs */}
      <div className="absolute w-full right-0 bottom-60 flex justify-center left-0">
        <div className="mx-auto flex w-fit justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab)}
              className={`max-w-xs rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition ${
                activeTab === tab.name
                  ? 'bg-purple-100 text-purple-700'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.name}
            </button>
            
          ))}
        </div>
      </div>
      {activeTab === 'LzyCrazy News' && (
  <div className="mt-12 w-full max-w-4xl">
    <NewsFeed />
  </div>
)}
    </div>
  );
};

export default Searchbar;
