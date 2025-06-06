import React from 'react';

const FriendsList = ({ friends }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg mt-4 p-6">
      {/* Top Line: Title + Link */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold">Friends</h3>
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm"
          onClick={(e) => e.preventDefault()}
        >
          See all friends
        </a>
      </div>

      {/* Second Line: Total Friends */}
      <div className="text-sm text-gray-600 mb-4">
        Total friends: {friends.length}
      </div>

      {/* Responsive Grid of Friends */}
      <div className="grid  grid-cols-2 sm:grid-cols-3 min-h-0 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-2 gap-4">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="flex w-26 flex-col items-center text-center"
          >
            <div className="w-full aspect-square">
              <img
                src={friend.image}
                alt={friend.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="text-sm text-gray-800 mt-2 break-words w-full">
              {friend.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
