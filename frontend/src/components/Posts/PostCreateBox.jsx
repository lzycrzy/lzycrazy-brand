import React, { useState, useEffect } from 'react';
import { FaCamera, FaFileAlt } from 'react-icons/fa';
import axios from '../../lib/axios/axiosInstance';
import { useUser } from '../../context/UserContext';
import CreatePost from './CreatePost'; // Ensure path is correct

const PostCreateBox = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false); // Modal state

  const { profilePic } = useUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setUser(res.data.profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const openCreatePost = () => setShowCreatePost(true);
  const closeCreatePost = () => setShowCreatePost(false);

  return (
    <>
      <div className="mb-6 w-full rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-start space-x-4">
          <img
            src={
              profilePic || 'https://i.ibb.co/2kR5zq0/default-avatar.png'
            }
            alt="User"
            onError={(e) => {
              e.target.src = 'https://i.ibb.co/2kR5zq0/default-avatar.png';
            }}
            className="h-12 w-12 rounded-full object-cover"
          />
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            rows={2}
            onFocus={openCreatePost} // 👈 Triggers full modal
            readOnly // Prevents direct input here
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-100 px-5 py-2 text-sm text-blue-700 hover:bg-blue-200">
              <FaCamera />
              Photo/Video
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onClick={openCreatePost} // 👈 Triggers modal too
                readOnly
              />
            </label>
            {file && (
              <span className="mt-1 max-w-xs truncate text-xs text-gray-500">
                {file.name}
              </span>
            )}
          </div>

          <button
            className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm text-white opacity-50 cursor-not-allowed"
            disabled
            type="button"
          >
            <FaFileAlt />
            Post
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="max-w-2xl w-full relative">
            <button
              onClick={closeCreatePost}
              className="absolute top-2 right-2 text-white bg-red-600 rounded-full px-2 py-1 text-sm z-50 hover:bg-red-700"
            >
              ✖
            </button>
            <CreatePost />
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreateBox;
