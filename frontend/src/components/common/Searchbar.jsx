// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import logo from '../../assets/lzy logo.jpg';
// import HiringFormModal from '../HiringFormModal';
// import HiringTaskModal from '../HiringTaskModal';
// import SuccessPopup from '../SuccessPopup';
// import NewsFeed from '../News/NewsFeed';

// const Searchbar = () => {
//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('');
//   const { t } = useTranslation();
//   const [showHiring, setShowHiring] = useState(false);
//   const [showTask, setShowTask] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showComingSoon, setShowComingSoon] = useState(false);

//   const navigate = useNavigate();

//   const tabs = [
//     { name: 'About Us', path: '/about' },
//     { name: 'LzyCrazy Services', path: '/services' },
//     { name: 'LzyCrazy Marketplace', path: '/market' },
//     { name: 'We Are Hiring', path: '/careers' },
//     { name: 'LzyCrazy News', path: '/news' },
//   ];

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       console.log('Search Query:', query, '| Category:', activeTab);
//       setShowComingSoon(true);
//       setTimeout(() => setShowComingSoon(false), 3000);
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab.name);
//     if (tab.name === 'We Are Hiring') {
//       setShowHiring(true);
//     } else {
//       navigate(tab.path);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center justify-start bg-[#ebf3fe] pt-2">
//       {/* Logo */}
//       <div className="mb-4">
//         <img
//           src={logo}
//           alt="LzyCrazy Logo"
//           className="w-28 md:w-40 lg:w-52 opacity-90 mix-blend-multiply"
//         />
//       </div>

//       {/* Search Box */}
//       <form
//         onSubmit={handleSearch}
//         className="relative w-full max-w-xl px-1 transition"
//       >
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search here..."
//           className="w-full rounded-full border border-gray-300 px-12 py-3 shadow-md focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
//             />
//           </svg>
//         </button>
//       </form>

//       {/* Coming Soon Text */}
//       {showComingSoon && (
//         <div className="mt-4 animate-fadeInScale rounded-full bg-yellow-100 px-6 py-3 text-sm font-semibold text-yellow-800 shadow-md">
//           🚧 This feature is coming next week — stay tuned!
//         </div>
//       )}

//       {/* Tabs */}
//       <div className="mt-5 w-full max-w-3xl px-4">
//         <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
//           {tabs.map((tab) => (
//             <button
//               key={tab.name}
//               onClick={() => handleTabClick(tab)}
//               className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition ${
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

//       {/* News Section */}
//       {activeTab === 'LzyCrazy News' && (
//         <div className="mt-6 w-full max-w-4xl px-4">
//           <NewsFeed />
//         </div>
//       )}

//       {/* Hiring Modals */}
//       <HiringFormModal
//         isOpen={showHiring}
//         onClose={() => setShowHiring(false)}
//         onSubmitSuccess={() => setShowTask(true)}
//       />
//       <HiringTaskModal
//         isOpen={showTask}
//         onClose={() => setShowTask(false)}
//         onSubmitSuccess={() => setShowSuccess(true)}
//       />
//       <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
//     </div>
//   );
// };

// export default Searchbar;



// new code with responsiveness
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/lzy logo.jpg';
import HiringFormModal from '../HiringFormModal';
import HiringTaskModal from '../HiringTaskModal';
import SuccessPopup from '../SuccessPopup';
import NewsFeed from '../News/NewsFeed';

const Searchbar = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const { t } = useTranslation();
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
      setTimeout(() => setShowComingSoon(false), 3000);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    if (tab.name === 'We Are Hiring') {
      setShowHiring(true);
      // navigate('/progress');
    } else if (tab.name === 'LzyCrazy News') {
      
      navigate('/progress');
    } else {
      navigate(tab.path);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start bg-[#ebf3fe] pt-4 px-3">
      {/* Logo */}
      <div className="mb-4">
        <img
          src={logo}
          alt="LzyCrazy Logo"
          className="w-24 sm:w-32 md:w-40 lg:w-52 opacity-90 mix-blend-multiply"
        />
      </div>

      {/* Search Box */}
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-sm sm:max-w-md md:max-w-xl px-1"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
          className="w-full rounded-full border border-gray-300 px-12 py-3 text-sm sm:text-base shadow-md focus:outline-none"
        />
        <button
          type="submit"
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
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
        </button>
      </form>

      {/* Coming Soon Text */}
      {showComingSoon && (
        <div className="mt-4 animate-fadeInScale rounded-full bg-yellow-100 px-6 py-3 text-xs sm:text-sm font-semibold text-yellow-800 shadow-md text-center">
          🚧 This feature is coming next week — stay tuned!
        </div>
      )}

      {/* Tabs */}
      <div className="mt-5 w-full max-w-3xl px-2">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab)}
              className={`rounded-full px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap shadow-md transition ${
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
        <div className="mt-6 w-full max-w-4xl px-4">
          <NewsFeed />
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
    </div>
  );
};

export default Searchbar;
