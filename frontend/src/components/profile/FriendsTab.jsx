import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserFriends, FaCommentDots } from 'react-icons/fa';
import axios from '../../lib/axios/axiosInstance';

const FriendsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [friends, setFriends] = useState([]);      // confirmed friends + received requests
  const [following, setFollowing] = useState([]);  // requested (sent) users and following
  const [searchResults, setSearchResults] = useState([]); // for search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Your own user relations
  const [userRelations, setUserRelations] = useState({
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
  });

  // Fetch current user relations once
  useEffect(() => {
    const fetchUserRelations = async () => {
      try {
        const res = await axios.get('/v1/users/me'); // adjust endpoint if needed
        console.log(res.data.profile)
        setUserRelations({
          friends: res.data.profile.friends || [],
          friendRequestsSent: res.data.profile.friendRequestsSent || [],
          friendRequestsReceived: res.data.profile.friendRequestsReceived || [],
        });
      } catch (err) {
        console.error('Failed to fetch current user relations', err);
      }
    };
    fetchUserRelations();
  }, []);

  // Helper to get status of a user relative to current user
  const getUserStatus = (user) => {
    const id = user._id || user; // sometimes it could be ID directly
    // Check friends
    if (userRelations.friends.some(f => (typeof f === 'string' ? f === id : f._id === id))) return 'friend';
    // Check sent requests
    if (userRelations.friendRequestsSent.some(f => (typeof f === 'string' ? f === id : f._id === id))) return 'requested';
    // Check received requests
    if (userRelations.friendRequestsReceived.some(f => (typeof f === 'string' ? f === id : f._id === id))) return 'received';
    return 'none';
  };

  // Fetch friends/following/search based on activeTab and searchQuery
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'all' || activeTab === 'following') {
          const res = await axios.get('/v1/users/friends/list');
          const updatedList = (res.data || []).map(user => ({
            ...user,
            status: getUserStatus(user),
          }));
          setFriends(updatedList);
          setFollowing(updatedList);
          setSearchResults([]);
        } else if (activeTab === 'find') {
          const res = await axios.get(`/v1/users/friends/search?q=${encodeURIComponent(searchQuery)}`);
          const updatedList = (res.data || []).map(user => ({
            ...user,
            status: getUserStatus(user),
          }));
          setSearchResults(updatedList);
          setFriends([]);
          setFollowing([]);
        }
      } catch (err) {
        setError('Failed to load friends.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, searchQuery, userRelations]);

  // Update status in all lists (friends, following, searchResults)
  const updateStatus = (id, status) => {
    const updateList = (list) => list.map(f => f._id === id ? { ...f, status } : f);
    setFriends(prev => updateList(prev));
    setFollowing(prev => updateList(prev));
    setSearchResults(prev => updateList(prev));
  };

  const removeUser = (id) => {
    setFriends(prev => prev.filter(f => f._id !== id));
    setFollowing(prev => prev.filter(f => f._id !== id));
    setSearchResults(prev => prev.filter(f => f._id !== id));
  };

  const sendRequest = async (id) => {
    try {
      await axios.post(`/v1/users/friends/send/${id}`);
      updateStatus(id, 'requested');
      // Optionally, update your local sent requests array for consistency:
      setUserRelations(prev => ({
        ...prev,
        friendRequestsSent: [...prev.friendRequestsSent, id],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.post(`/v1/users/friends/accept/${id}`);
      updateStatus(id, 'friend');
      setUserRelations(prev => ({
        ...prev,
        friends: [...prev.friends, id],
        friendRequestsReceived: prev.friendRequestsReceived.filter(f => f !== id && f._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.post(`/v1/users/friends/reject/${id}`);
      removeUser(id);
      setUserRelations(prev => ({
        ...prev,
        friendRequestsReceived: prev.friendRequestsReceived.filter(f => f !== id && f._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const unfriend = async (id) => {
    try {
      await axios.post(`/v1/users/friends/unfriend/${id}`);
      updateStatus(id, 'none');
      setUserRelations(prev => ({
        ...prev,
        friends: prev.friends.filter(f => f !== id && f._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to merge friends and following lists for "all" tab without duplicates
  const mergeAllUsers = () => {
    const map = new Map();
    friends.forEach(u => map.set(u._id, u));
    following.forEach(u => {
      if (!map.has(u._id)) {
        map.set(u._id, u);
      }
    });
    return Array.from(map.values());
  };

  // Decide which list to show
  let listToShow = [];
  if (activeTab === 'all') {
    listToShow = mergeAllUsers();
  } else if (activeTab === 'following') {
    listToShow = following;
  } else if (activeTab === 'find') {
    listToShow = searchResults;
  }

  // Render user card with buttons based on status
  const renderUserCard = (user) => {
    const status = user.status || 'none';

    return (
      <div
        key={user._id}
        className="flex w-[400px] rounded-md bg-gray-50 p-4 shadow-sm hover:bg-gray-100"
      >
        <div className="flex-shrink-0">
          <img
            src={user.image}
            alt={user.fullName}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        <div className="ml-4 flex flex-grow flex-col">
          <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
          <p className="mb-1 text-sm text-gray-600">{user.email}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2 text-gray-400">📍</span>
            {user.location || 'Location not specified'}
          </div>

          <div className="flex-grow"></div>

          <div className="mt-4 flex w-full space-x-2">
            {status === 'friend' ? (
              <button
                onClick={() => unfriend(user._id)}
                className="flex w-1/2 items-center justify-center space-x-2 rounded-md bg-gray-200 px-3 py-2 text-gray-800 transition hover:bg-gray-300"
              >
                <FaUserFriends />
                <span>Friends</span>
              </button>
            ) : status === 'received' ? (
              <div className="flex w-1/2 space-x-1">
                <button
                  onClick={() => acceptRequest(user._id)}
                  className="w-1/2 rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(user._id)}
                  className="w-1/2 rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            ) : status === 'requested' ? (
              <button
                className="flex w-1/2 cursor-not-allowed items-center justify-center rounded-md bg-yellow-400 px-3 py-2 text-white"
                disabled
              >
                Request Sent
              </button>
            ) : (
              <button
                onClick={() => sendRequest(user._id)}
                className="flex w-1/2 items-center justify-center space-x-2 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              >
                <FaUserFriends />
                <span>Add Friend</span>
              </button>
            )}

            <button
              className={`flex w-1/2 items-center justify-center space-x-2 rounded-md px-3 py-2 transition ${
                status === 'friend'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              disabled={status !== 'friend'}
            >
              <FaCommentDots />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Friends</h2>
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
        <div className="flex flex-wrap gap-2">
          {['all', 'following', 'find'].map((tab) => (
            <button
              key={tab}
              className={`rounded-md px-4 py-2 text-sm ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all'
                ? 'All Friends'
                : tab === 'following'
                ? 'Following'
                : 'Find Friends'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading and Error */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Show merged/all or filtered lists */}
      {!loading && !error && (
        <>
          {listToShow.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {listToShow.map(renderUserCard)}
            </div>
          ) : (
            <p className="text-gray-600">
              {activeTab === 'find'
                ? 'No users found.'
                : activeTab === 'following'
                ? 'No following users found.'
                : 'No friends or following users found.'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FriendsTab;
