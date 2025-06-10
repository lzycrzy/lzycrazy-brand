import React, { useState, useEffect } from 'react';
import { FaCamera, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';

const PostCreateBox = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Stores full user data from backend

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:4000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setUser(res.data.profile); // Update user state
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() && !file) {
      alert('Please enter some text or select a media file');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('text', text);
      if (file) formData.append('media', file);

      const response = await axios.post(
        'http://localhost:4000/api/v1/users/post',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );

      setText('');
      setFile(null);

      if (onPostCreated) onPostCreated(response.data.post);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 w-full rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={
            user?.photoURL ||
            'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
          }
          alt="User"
          className="h-12 w-12 rounded-full object-cover"
        />
        <textarea
          placeholder="What's on your mind?"
          className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-100 px-5 py-2 text-sm whitespace-nowrap text-blue-700 select-none hover:bg-blue-200">
            <FaCamera />
            Photo/Video
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <span className="mt-1 max-w-xs truncate text-xs text-gray-500">
              {file.name}
            </span>
          )}
        </div>

        <button
          className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          <FaFileAlt />
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default PostCreateBox;
