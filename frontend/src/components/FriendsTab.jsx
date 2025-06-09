import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaUserFriends, FaCommentDots } from 'react-icons/fa';

const friendsData = [
  {
    name: 'Zeeshu Ali',
    mutual: '58 mutual friends, including Zeeshan Shareef and Moin Kassar',
    location: 'Delhi, India',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Anjali Mehta',
    mutual: '35 mutual friends, including Raj and Pooja',
    location: 'Mumbai, India',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Amit Verma',
    mutual: '41 mutual friends, including Ravi and Sneha',
    location: 'Lucknow, India',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
];

const FriendsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFriends = friendsData.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      {/* Header Row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title */}
        <h2 className="text-2xl font-bold text-gray-800">Friends</h2>

        {/* Middle: Search */}
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:outline-none"
          />
        </div>

        {/* Right: Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-md px-4 py-2 text-sm ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Friends
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm ${
              activeTab === 'following'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm ${
              activeTab === 'find'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setActiveTab('find')}
          >
            Find Friends
          </button>
        </div>
      </div>

      {/* Friends List */}
      {activeTab === 'following' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filteredFriends.map((friend, index) => (
           <div className="flex w-[400px] rounded-md bg-gray-50 p-4 shadow-sm hover:bg-gray-100">
           {/* Left: Profile pic */}
           <div className="flex-shrink-0">
             <img
               src={friend.image}
               alt={friend.name}
               className="h-16 w-16 rounded-full object-cover"
             />
           </div>
         
           {/* Middle and right content */}
           <div className="ml-4 flex flex-grow flex-col">
             {/* Top row: Name and mutual friends */}
             <h3 className="text-lg font-semibold text-gray-900">
               {friend.name}
             </h3>
             <p className="mb-1 text-sm text-gray-600">
               58 mutual friends, including Zeeshan Shareef and Moin Kassar
             </p>
         
             {/* Location with icon inline */}
             <p className="flex items-center text-sm text-gray-500">
               <span className="mr-2 text-gray-400">📍</span>
               Lives in Delhi, India
             </p>
         
             {/* Spacer */}
             <div className="flex-grow"></div>
         
             {/* Bottom row: buttons spanning full 400px width */}
             <div className="mt-4 flex w-full space-x-2">
               <button className="flex w-1/2 items-center justify-center space-x-2 rounded-md bg-gray-300 px-3 py-2 text-gray-800 transition hover:bg-gray-400">
                 <FaUserFriends />
                 <span>Friends</span>
               </button>
               <button className="flex w-1/2 items-center justify-center space-x-2 rounded-md bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700">
                 <FaCommentDots />
                 <span>Message</span>
               </button>
             </div>
           </div>
         </div>
         
          ))}
        </div>
      )}

      {activeTab === 'all' && (
        <p className="mt-6 text-center text-gray-600">
          All friends feature coming soon...
        </p>
      )}

      {activeTab === 'find' && (
        <p className="mt-6 text-center text-gray-600">
          Find friends feature coming soon...
        </p>
      )}
    </div>
  );
};

export default FriendsTab;
