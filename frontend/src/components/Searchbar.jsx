import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/lzy logo.jpg';

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const { t, i18n } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Search Query:', query, '| Category:', activeTab);
      // TODO: API call here
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const categories = [
    'Direct By Farm',
    'Self Made',
    'Rental Items',
    'Real Estate',
    'Vehicle',
    'Mobiles',
    'Furniture',
    'Fashion',
    'Electronics',
    'Coming Soon',
    'Coming Soon',
  ];

  return (
    <div className="flex min-h-screen flex-col items-center pt-20 bg-[#ebf3fe] pb-4">
      {/* Logo */}
      <div className="mb-8 mt-4">
        <img src={logo} alt="LzyCrazy Logo" className="w-44 md:w-60 mix-blend-multiply opacity-90" />
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
          className="w-full rounded-full border border-gray-300 px-14 py-4 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute left-5 top-1/2 -translate-y-[45%] text-xl text-purple-500"
        >
          🔍
        </button>
      </form>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-purple-100 text-purple-700'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Language Selector
      <footer className="mt-16 text-center text-sm text-gray-500">
        <span className="font-semibold">LzyCrazy</span> {t('offeredIn')}
        <div className="mt-2 flex justify-center gap-3">
          {[
            { code: 'hi', label: 'Hindi' },
            { code: 'en', label: 'English' },
            { code: 'bn', label: 'Bengali' },
            { code: 'ar', label: 'Arabic' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="underline hover:text-purple-600"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </footer> */}

      {/* Optional: Display active search */}
      {query && (
        <div className="mt-10 text-center text-gray-600">
          <p>
            Showing results for: <span className="font-medium">{query}</span>
          </p>
          <p className="text-sm text-purple-600">Category: {activeTab}</p>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
