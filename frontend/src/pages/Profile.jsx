import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Header from '../components/Header';
import { FaCamera } from 'react-icons/fa';
import PostCreateBox from '../components/PostCreateBox';
import PostCard from '../components/PostCard';
import Intro from '../components/Intro';
import About from '../components/About';
import Friends from '../components/Friends';
import SettingMenu from '../components/Setting';
import EditProfile from '../components/EditProfile';
import FriendsTab from '../components/FriendsTab';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [displayName, setDisplayName] = useState('User Name');
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const token = localStorage.getItem('token'); // get token from localStorage
      if (!token) {
        console.error('No auth token found');
        return;
      }

      console.log(token);
      const res = await axios.get('http://localhost:4000/api/v1/users/me', {
        withCredentials: true, // optional, only if you use cookies
      });
      const data = res.data;
      console.log(data);
      setUser(data);
      setDisplayName(data.name);
      setProfilePic(`${data.photoURL}?t=${Date.now()}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch profile data from backend on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setProfilePic(URL.createObjectURL(file)); // For preview
    }
  };

  // Sample posts and friends, you can replace with real data if you have
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
      name: 'Alice Johnson',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'Bob Smith',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Carol Lee',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      name: 'David Miller',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
  ];


  

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="w-full">
      <Header />
      <div className="h-80 w-full bg-blue-900 text-white shadow-md">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-24 w-24">
                <img
                  src={profilePic || '/default-profile.png'}
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
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-white px-4 py-2 text-sm text-blue-900 hover:bg-gray-100"
              >
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

            <SettingMenu activeTab={activeTab} />
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
        {activeTab === 'about' && (
          <div className="text-left">
            <About user={user} />
          </div>
        )}
        {activeTab === 'friends' && <FriendsTab />}
      </div>
      {isEditing && (
        <EditProfile
          profilePic={profilePic}
          currentName={displayName}
          onClose={() => setIsEditing(false)}
          onSave={async (newName) => {
            try {
              const token = localStorage.getItem('token');
              const formData = new FormData();
              formData.append('name', newName);
              if (newImage) formData.append('photo', newImage);

              await axios.put(
                'http://localhost:4000/api/v1/users/updateMe',
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  },
                  withCredentials: true,
                },
              );

              await fetchProfile(); // load updated user info from server
              setIsEditing(false);
            } catch (err) {
              console.error(' Error updating profile:', err);
            }
          }}
          onImageChange={handleImageChange}
        />
      )}
    </div>
  );
};

export default Profile;
