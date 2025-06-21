import React, { useState, useEffect } from 'react';
import axios from '../lib/axios/axiosInstance';
import Header from '../components/static/Header';
import { FaCamera } from 'react-icons/fa';
import PostCreateBox from '../components/Posts/PostCreateBox';
import PostCard from '../components/Posts/PostCard';
import Intro from '../components/profile/Intro';
import About from '../components/profile/About';
import Friends from '../components/common/Friends';
import SettingMenu from '../components/profile/Setting';
import EditProfile from '../components/profile/EditProfile';
import FriendsTab from '../components/profile/FriendsTab';
import { useUser } from '../context/UserContext';
import ManageFriends from '../components/profile/ManageFriends';
import Footer from '../components/static/Footer1';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Spinner';

const Profile = () => {
  const { user, profilePic, displayName, fetchUser, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [activeTab1, setActiveTab1] = useState('');
  const [posts, setPosts] = useState([]);
  const [imagePreview, setImagePreview] = useState(profilePic);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchProfile = async () => {
    try {
      await fetchUser();
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?.profile?.posts) {
      setPosts(Array.isArray(user.profile.posts) ? user.profile.posts : []);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
      updateUser({ photoURL: URL.createObjectURL(file) });
      e.target.value = '';
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />

      <div className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                <img
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : profilePic || 'https://i.ibb.co/2kR5zq0/default-avatar.png'
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://i.ibb.co/2kR5zq0/default-avatar.png';
                  }}
                  className="w-full h-full object-cover border-4 border-white rounded-full"
                  alt="Profile"
                />
                <label htmlFor="profileUpload">
                  <div className="absolute right-0 bottom-2 cursor-pointer rounded-full bg-white p-1 shadow">
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
                <h2 className="text-xl sm:text-2xl font-semibold">{displayName}</h2>
                <p className="text-sm text-gray-200">Full Stack Developer</p>
                <p className="text-sm mt-1">Total Friends: {user.friendsCount || 120}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="text-sm px-4 py-2 rounded bg-white text-blue-900 hover:bg-gray-100">Edit Story</button>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm px-4 py-2 rounded bg-white text-blue-900 hover:bg-gray-100"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-6">
            <div className="scrollbar-hide flex overflow-x-auto space-x-2 sm:space-x-4 whitespace-nowrap">
              {['posts', 'about', 'friends', 'photos', 'videos', 'my Ads', 'more'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-4 py-2 rounded-md text-sm transition whitespace-nowrap ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <SettingMenu activeTab={activeTab1} setActiveTab={setActiveTab1} />
              {activeTab1 === 'manageFriends' && (
  <Modal onClose={() => setActiveTab1('')}>
    <h2 className="text-lg font-semibold mb-4">Manage Friends</h2>
    <ManageFriends />
  </Modal>
)}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'posts' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 space-y-4">
              <PostCreateBox onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])} />
              {loadingPosts ? (
                <p className="text-center text-gray-500">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts yet.</p>
              ) : (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
            <div className="w-full lg:w-1/3 space-y-4">
              <Intro />
              <Friends friends={user.friends || []} />
            </div>
          </div>
        )}

        {activeTab === 'about' && <About user={user} />}
        {activeTab === 'friends' && <FriendsTab />}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {posts
              .filter((post) => post.mediaUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i))
              .map((post) => (
                <img key={post._id} src={post.mediaUrl} alt="User upload" className="w-full h-64 object-cover rounded-lg" />
              ))}
          </div>
        )}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {posts
              .filter((post) => post.mediaUrl?.match(/\.(mp4|webm|ogg)$/i))
              .map((post) => (
                <video key={post._id} src={post.mediaUrl} controls className="w-full max-h-80 object-cover rounded-lg" />
              ))}
          </div>
        )}
      </main>

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

              const res = await axios.put('/v1/users/updateMe', formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
              });

              const updated = res.data?.updatedUser;
              if (updated) {
                updateUser({
                  name: updated.profile?.name,
                  photoURL: updated.profile?.photoURL,
                });
              }

              await fetchProfile();
              setIsEditing(false);
              setNewImage(null);
            } catch (err) {
              console.error('Error updating profile:', err);
            }
          }}
          onImageChange={handleImageChange}
        />
      )}

      <Footer />
    </div>
  );
};

export default Profile;