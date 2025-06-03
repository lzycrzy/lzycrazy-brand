import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/lzy logo.jpg';

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const { t, i18n } = useTranslation();

  // 🔍 Handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Search Query:', query, '| Filter:', activeTab);

      // ✅ TODO: Call your search API here
      // Example (pseudo-code):
      // const response = await fetch(`https://api.example.com/search?q=${query}&filter=${activeTab}`);
      // const data = await response.json();
      // setResults(data);

      // Right now, you are just logging to console
    }
  };

  // 🌐 Change site language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // 🔖 Available filter tabs
  const filters = ['All', 'Images', 'Videos', 'News', 'Shopping'];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/* 🖼️ Logo Section */}
      <div className="flex flex-col items-center">
        <img src={logo} alt="LzyCrazy Logo" className="mb-2 w-40 md:w-60" />
      </div>

      {/* 🔍 Search Input */}
      <form onSubmit={handleSearch} className="relative mt-8 w-full max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-full border border-gray-300 px-12 py-3 shadow-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute top-1/2 left-4 -translate-y-1/2 transform text-lg text-purple-500"
        >
          🔍
        </button>
      </form>

      {/* 🧭 Filter Tabs */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {filters.map((tab) => (
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

      {/* 💼 Hiring Banner */}
      <div className="mt-4">
        <button className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-800 shadow-sm transition hover:bg-gray-100">
          {t('weAreHiring')}
        </button>
      </div>

      {/* 📊 Search Results Summary */}
      {query && (
        <div className="mt-8 text-center text-lg text-gray-700">
          {t('resultFor')}: <span className="font-semibold">{query}</span>
          <br />
          <span className="text-sm text-purple-600">
            {t('filter')}: {activeTab}
          </span>
        </div>
      )}

      {/* 🌐 Language Selector */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        <span className="font-semibold">LzyCrazy</span> {t('offeredIn')}
        <div className="mt-2 flex justify-center gap-3">
          {[
            { code: 'hi', label: 'Hindi' },
            { code: 'en', label: 'English' },
            { code: 'bn', label: 'Bengali' },
            { code: 'ar', label: 'Arbi' },
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
      </footer>
    </div>
  );
};

export default Searchbar;
