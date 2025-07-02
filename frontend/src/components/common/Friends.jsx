import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios/axiosInstance';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`/v1/users/friends/list`);
        console.log("friends", res.data);
        setFriends(res.data || []);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

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
        {loading
          ? 'Loading friends...'
          : error
          ? error
          : `Total friends: ${friends.length}`}
      </div>

      {/* Responsive Grid of Friends */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 min-h-0 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex w-26 flex-col items-center text-center"
            >
              <div className="w-full aspect-square">
                <img
                  src={friend.image}
                  alt={friend.fullName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <span className="text-sm text-gray-800 mt-2 break-words w-full">
                {friend.fullName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
