import React, { useEffect, useState } from 'react';
import axios from '../lib/axios/axiosInstance';
import { useSelector } from 'react-redux';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

const RightSidebar = () => {
  const [people, setPeople] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/v1/users/friends/search?q=');
      setPeople(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const sendRequest = async (id) => {
    try {
      await axios.post(`/v1/users/friends/send/${id}`);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="hidden min-w-[300px] px-7 max-w-[420px] lg:block">
      {/* People You May Know */}
      <div className="h-[400px] overflow-y-auto rounded-lg bg-white p-5  shadow-md">
        <h3 className="sticky top-0 z-10 mb-4 bg-white pb-2 text-lg font-semibold text-gray-800">
          People You May Know
        </h3>
        {people.length === 0 && (
          <p className="text-sm text-gray-500">No suggestions at the moment.</p>
        )}
        {people.map((p) => (
          <div key={p._id} className="mb-4 flex items-center">
            <img
              src={p.image}
              alt={p.fullName}
              className="mr-3 h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{p.fullName}</div>
              {p.status === 'friends' ? (
                <button
                  className="mt-1 flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
                  disabled
                >
                  <FaUserCheck /> Friends
                </button>
              ) : p.status === 'sent' ? (
                <button
                  className="mt-1 rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700"
                  disabled
                >
                  Request Sent
                </button>
              ) : p.status === 'incoming' ? (
                <div className="mt-1 flex flex-col gap-1">
                  <button
                    className="rounded-full bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                    onClick={() =>
                      axios
                        .post(`/api/friends/accept/${p._id}`)
                        .then(fetchUsers)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="rounded-full bg-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-300"
                    onClick={() =>
                      axios
                        .post(`/api/friends/reject/${p._id}`)
                        .then(fetchUsers)
                    }
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <button
                  className="mt-1 flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                  onClick={() => sendRequest(p._id)}
                >
                  <FaUserPlus /> Add Friend
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Friends */}
      <div className="h-4 bg-gray-100"></div>
      <div className="rounded-lg bg-white p-5 shadow-md">
        <h3 className="text-md mb-2 font-semibold text-gray-800">
          Invite Your Friends
        </h3>
        <input
          type="email"
          placeholder="Enter email address"
          className="w-full rounded-full border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button className="mt-3 w-full rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Send Invite
        </button>
      </div>

      {/* Footer */}
      <div className="h-4 bg-gray-100"></div>
      <div className="rounded-lg bg-white p-5 text-xs text-gray-500 shadow-md">
        <div>© 2025 LzyCrazy</div>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Blog
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            More
          </a>
        </div>
        <div className="mt-2">Languages</div>
      </div>
    </div>
  );
};

export default RightSidebar;
