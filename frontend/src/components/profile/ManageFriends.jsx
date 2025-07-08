// src/components/settings/ManageFriends.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios/axiosInstance';

const ManageFriends = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/v1/users/friends/pending');
      console.log('Received requests:', res.data);
      setReceivedRequests(res.data.received);
    } catch (err) {
      console.error('Error fetching requests', err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(`/v1/users/friends/accept/${id}`);
      fetchRequests(); // refresh after action
    } catch (err) {
      console.error('Accept error', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/v1/users/friends/reject/${id}`);
      fetchRequests();
    } catch (err) {
      console.error('Reject error', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Friend Requests</h2>
      {receivedRequests.length === 0 ? (
        <p className="text-sm text-gray-500">No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {receivedRequests.map((user) => (
            <li key={user._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.image || "/missing.png"} alt={user.fullName || "User"} className="w-10 h-10 rounded-full" loading="lazy" />
                <div>
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                  onClick={() => handleAccept(user._id)}
                >
                  Accept
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-300"
                  onClick={() => handleReject(user._id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageFriends;
