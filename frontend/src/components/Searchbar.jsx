// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Link, useNavigate } from 'react-router-dom';
// import logo from '../assets/lzy logo.jpg';
// import HiringFormModal from '../components/HiringFormModal'; // Make sure this path is correct
// import HiringTaskModal from '../components/HiringTaskModal';
// import SuccessPopup from '../components/SuccessPopup';
// import NewsFeed from '../components/NewsFeed'; // Adjust path as needed

// const Searchbar = () => {
//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('');
//   const { t, i18n } = useTranslation();
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const [showHiring, setShowHiring] = useState(false);
//   const [showTask, setShowTask] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       console.log('Search Query:', query, '| Category:', activeTab);
//     }
//   };

//   const tabs = [
//     { name: 'About Us', path: '/about' },
//     { name: 'LzyCrazy Services', path: '/services' },
//     { name: 'LzyCrazy Marketplace', path: '/market' },
//     { name: 'We Are Hiring', path: '/careers' }, // This will trigger modal
//     { name: 'LzyCrazy News', path: '/news' },
//   ];

//   const handleTabClick = (tab) => {
//     setActiveTab(tab.name);
//     if (tab.name === 'We Are Hiring') {
//       setShowHiring(true); // Open modal
//     }  else  {
//           navigate(tab.path);
//           }
//   };

//   return (
//     <div className="relative flex h-screen flex-col items-center justify-start bg-[#ebf3fe] pt-14 pb-24">
//       {/* Logo */}
//       <div className="mt-4 mb-8">
//         <img
//           src={logo}
//           alt="LzyCrazy Logo"
//           className="w-44 opacity-90 mix-blend-multiply md:w-60"
//         />
//       </div>

//       {/* Search Box */}
//       <form
//         onSubmit={handleSearch}
//         className="relative w-full max-w-2xl transition"
//       >
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search here..."
//           className="w-full rounded-full border border-gray-300 px-14 py-4 shadow-md focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="absolute top-1/2 left-5 -translate-y-[45%] text-xl text-purple-500"
//         >
//           🔍
//         </button>
//       </form>

//       {/* Hiring Form Modal */}
//       <HiringFormModal
//   isOpen={showHiring}
//   onClose={() => setShowHiring(false)}
//   onSubmitSuccess={() => setShowTask(true)}
// />

// <HiringTaskModal isOpen={showTask} onClose={() => setShowTask(false)} onSubmitSuccess={() => setShowSuccess(true)}/>
// <SuccessPopup  isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

//       {/* Tabs */}
//       <div className="absolute w-full right-0 bottom-60 flex justify-center left-0">
//         <div className="mx-auto flex w-fit justify-center gap-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab.name}
//               onClick={() => handleTabClick(tab)}
//               className={`max-w-xs rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition ${
//                 activeTab === tab.name
//                   ? 'bg-purple-100 text-purple-700'
//                   : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               {tab.name}
//             </button>
            
//           ))}
//         </div>
//       </div>
//       {activeTab === 'LzyCrazy News' && (
//   <div className="mt-12 w-full max-w-4xl">
//     <NewsFeed />
//   </div>
// )}
//     </div>
//   );
// };

// export default Searchbar;


import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/lzy logo.jpg';
import HiringFormModal from '../components/HiringFormModal';
import HiringTaskModal from '../components/HiringTaskModal';
import SuccessPopup from '../components/SuccessPopup';
import NewsFeed from '../components/NewsFeed';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'; // ✅ Modern search icon

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const { t, i18n } = useTranslation();
  const [showHiring, setShowHiring] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const navigate = useNavigate();

  const tabs = [
    { name: 'About Us', path: '/about' },
    { name: 'LzyCrazy Services', path: '/services' },
    { name: 'LzyCrazy Marketplace', path: '/market' },
    { name: 'We Are Hiring', path: '/careers' },
    { name: 'LzyCrazy News', path: '/news' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Search Query:', query, '| Category:', activeTab);
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 3000); // hide after 3s
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    if (tab.name === 'We Are Hiring') {
      setShowHiring(true);
    } else {
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
      <form onSubmit={handleSearch} className="relative w-full max-w-2xl transition">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
          className="w-full rounded-full border border-gray-300 px-14 py-4 shadow-md focus:outline-none"
        />
        <button
          type="submit"
          className="absolute top-1/2 left-5 -translate-y-1/2 text-purple-500"
        >
       <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-600">
    {/* Plain search icon (black/gray) */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  </div>
        </button>
      </form>

      {/* Coming Soon Text */}
      {showComingSoon && (
  <div className="mt-6 animate-fadeInScale rounded-full bg-yellow-100 px-6 py-3 text-sm font-semibold text-yellow-800 shadow-md transition-all duration-500 ease-in-out">
    🚧 This feature is coming next week — stay tuned!
  </div>
)}

      {/* Hiring Modals */}
      <HiringFormModal
        isOpen={showHiring}
        onClose={() => setShowHiring(false)}
        onSubmitSuccess={() => setShowTask(true)}
      />
      <HiringTaskModal
        isOpen={showTask}
        onClose={() => setShowTask(false)}
        onSubmitSuccess={() => setShowSuccess(true)}
      />
      <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

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

      {/* News Section */}
      {activeTab === 'LzyCrazy News' && (
        <div className="mt-12 w-full max-w-4xl">
          <NewsFeed />
        </div>
      )}
    </div>
  );
};

export default Searchbar;
