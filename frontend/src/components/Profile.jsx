import React, { useState, useEffect } from 'react';
import Header from './Header';
import { FaCamera } from 'react-icons/fa';
import PostCreateBox from './PostCreateBox';
import PostCard from './PostCard';
import Intro from './Intro';
import Friends from './Friends';
import SettingMenu from './Setting';

const Profile = ({ user }) => {
  // If user prop not passed, fallback to defaults
  const [profilePic, setProfilePic] = useState(user?.photoURL || '');
  const [displayName, setDisplayName] = useState(user?.name || 'User Name');
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    // Update if user prop changes
    if (user) {
      setProfilePic(user.photoURL || '');
      setDisplayName(user.name || 'User Name');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const myPosts = [
    {
      user: displayName,
      time: '1 hour ago',
      content: 'Loving this new community!',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      likes: 15,
      comments: 4,
      share: 1,
    },
    {
      user: displayName,
      time: '3 hours ago',
      content: 'Check out my latest project!',
      image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
      likes: 28,
      comments: 7,
      share: 3,
    },
  ];

  const friendsData = [
    {
      name: "Alice Johnson",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Bob Smith",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      name: "Carol Lee",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      name: "David Miller",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  return (
    <div className="w-full">
      <Header />
      <div className="h-80 w-full bg-blue-900 text-white shadow-md">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-24 w-24">
                <img
                  src={profilePic || '/default-profile.png'} // fallback default image path
                  alt="Profile"
                  className="h-full w-full rounded-full border-4 border-white object-cover"
                />
                <label htmlFor="profileUpload">
                  <div className="absolute right-0 bottom-16 cursor-pointer rounded-full bg-white p-1 shadow">
                    <FaCamera className="text-xs text-blue-700" />
                  </div>
                </label>
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{displayName}</h2>
                <p className="text-sm text-gray-200">Full Stack Developer</p>
                <p className="mt-1 text-sm">Total Friends: 120</p>
              </div>
            </div>

            <div className="space-x-3">
              <button className="rounded-md bg-white px-4 py-2 text-sm text-blue-900 hover:bg-gray-100">
                Edit Story
              </button>
              <button className="rounded-md bg-white px-4 py-2 text-sm text-blue-900 hover:bg-gray-100">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-4">
              {[
                'posts',
                'about',
                'friends',
                'photos',
                'videos',
                'my Ads',
                'more',
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2 capitalize transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <SettingMenu activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl rounded-xl bg-white p-6 text-center shadow-inner">
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-6 text-left lg:flex-row">
            <div className="w-full space-y-4 lg:w-2/3">
              <PostCreateBox />
              {myPosts.map((post, idx) => (
                <PostCard key={idx} post={post} />
              ))}
            </div>

            <div className="w-full lg:w-1/3">
              <Intro />
              <Friends friends={friendsData} />
            </div>
          </div>
        )}
        {activeTab === 'about' && <div>👤 About the user goes here.</div>}
        {activeTab === 'friends' && <div>👥 List of friends goes here.</div>}
      </div>
    </div>
  );
};

export default Profile;
