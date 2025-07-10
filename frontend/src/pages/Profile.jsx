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
import { HiOutlineDotsVertical } from 'react-icons/hi'; // at the top
import Modal from '../components/common/Modal'; // adjust the path if needed

import Loader from '../components/common/Spinner';
import Listings from '../components/AdPage/Listings';
import ShowImage from '../components/profile/ShowImage';

const Profile = () => {
  const { user, profilePic, displayName, fetchUser, updateUser } = useUser();

  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [activeTab1, setActiveTab1] = useState('');
  const [posts, setPosts] = useState([]);
  const [imagePreview, setImagePreview] = useState(profilePic);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showManageFriendsModal, setShowManageFriendsModal] = useState(false);
  const [showImage, setShowImage] = useState(null);

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
    console.log('user.profile.posts:', user?.profile?.posts);
    if (user?.profile?.posts) {
      setPosts(Array.isArray(user.profile.posts) ? user.profile.posts : []);
      setLoadingPosts(false);
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
    <div className="relative min-h-screen w-full bg-gray-50">
      <Header />

      {showImage && <ShowImage img={showImage} setShowImage={setShowImage} />}

      {/* Profile Header */}
      <div className="h-80 w-full bg-blue-900 text-white shadow-md">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-24 w-24">
                <img
                  onClick={() => setShowImage(profilePic || (newImage && URL.createObjectURL(newImage)) || 'https://i.ibb.co/2kR5zq0/default-avatar.png')}
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : profilePic ||
                        'https://i.ibb.co/2kR5zq0/default-avatar.png'
                  }
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://i.ibb.co/2kR5zq0/default-avatar.png';
                  }}
                  className="h-full w-full rounded-full border-4 border-white object-cover"
                />
                {/* <label htmlFor="profileUpload">
                  <div className="absolute right-0 bottom-16 cursor-pointer rounded-full bg-white p-1 shadow">
                    <FaCamera className="text-xs text-blue-700" />
                  </div>
                </label> */}
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
                {/* <p className="text-sm text-gray-200">Full Stack Developer</p>
                <p className="mt-1 text-sm">
                  Total Friends: {user.friendsCount || ''}
                </p> */}
              </div>
            </div>

            {/* For large screens: show buttons normally */}
            <div className="hidden space-x-3 sm:flex">
              {/* <button className="rounded-md bg-white px-4 py-2 text-sm text-blue-900 hover:bg-gray-100">
                Edit Story
              </button> */}
              <button
                onClick={() => {
                  setIsEditing(true)
                }}
                className="rounded-md bg-white px-4 py-2 text-sm text-blue-900 hover:bg-gray-100"
              >
                Edit Profile
              </button>
              {/* <SettingMenu
                activeTab={activeTab1}
                setActiveTab={setActiveTab1}
                onManageFriendsClick={() => setShowManageFriendsModal(true)} // ✅ Add this!
              /> */}
            </div>

            {/* For small screens: dropdown menu */}
            <div className="relative sm:hidden">
              <button
                className="rounded-md bg-white p-2 text-blue-900 hover:bg-gray-100"
                onClick={() =>
                  setActiveTab1((prev) =>
                    prev === 'dropdown' ? '' : 'dropdown',
                  )
                }
              >
                <HiOutlineDotsVertical size={20} />
              </button>

              {activeTab1 === 'dropdown' && (
                <div className="absolute right-0 z-50 mt-2 w-40 rounded-md bg-white shadow-md">
                  <button
                    onClick={() => {
                      setActiveTab1('');
                      // Add your logic here
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Story
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setActiveTab1('');
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <SettingMenu
                    activeTab={activeTab1}
                    setActiveTab={setActiveTab1}
                    onManageFriendsClick={() => setShowManageFriendsModal(true)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between border-t pt-4">
            {/* Tabs for large screens */}
            <div className="hidden space-x-2 overflow-x-auto whitespace-nowrap sm:flex">
              {[
                // 'posts',
                'about',
                // 'friends',
                // 'photos',
                // 'videos',
                'my Ads',
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2 text-sm capitalize transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Hamburger dropdown for mobile */}
            <div className="relative sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full rounded bg-white p-2 text-blue-900"
              >
                {[
                  // 'posts',
                  'about',
                  // 'friends',
                  // 'photos',
                  // 'videos',
                  'my Ads',
                ].map((tab) => (
                  <option key={tab} value={tab}>
                    {tab}
                  </option>
                ))}
              </select>
            </div>

            <button className='rounded-md px-4 py-2 text-sm capitalize transition bg-amber-400 text-black cursor-pointer'>Request For Business Profile</button>

            {/* <div className="flex gap-6">
              <SettingMenu
                activeTab={activeTab1}
                setActiveTab={setActiveTab1}
              />

              <div className="flex-1">
                {activeTab1 === 'manageFriends' && <ManageFriends />}
                {/* You can conditionally render other tabs here */}
            {/* </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-6 min-h-[600px] max-w-5xl rounded-xl bg-white p-6 shadow-inner">
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-6 text-left lg:flex-row">
            <div className="w-full space-y-4 lg:w-2/3">
              <PostCreateBox
                onPostCreated={(newPost) =>
                  setPosts((prev) => [newPost, ...prev])
                }
              />
              {loadingPosts ? (
                <div className="py-10 text-center text-gray-500">
                  Loading posts...
                </div>
              ) : posts.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No posts yet.
                </div>
              ) : (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
            {/* <div className="w-full lg:w-1/3">
              <Intro />
              <Friends friends={user.friends || []} />
            </div> */}
          </div>
        )}

        {activeTab === 'my Ads' && <Listings />}

        {activeTab === 'about' && <About user={user} />}
        {/* {activeTab === 'friends' && <FriendsTab />} */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {posts
              .filter((post) =>
                post.mediaUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i),
              )
              .map((post) => (
                <img
                  key={post._id}
                  src={post.mediaUrl}
                  alt="User upload"
                  className="h-64 w-full rounded-lg object-cover"
                />
              ))}
          </div>
        )}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {posts
              .filter((post) => post.mediaUrl?.match(/\.(mp4|webm|ogg)$/i))
              .map((post) => (
                <video
                  key={post._id}
                  src={post.mediaUrl}
                  controls
                  className="max-h-80 w-full rounded-lg object-cover"
                />
              ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
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
      {showManageFriendsModal && (
        <Modal onClose={() => setShowManageFriendsModal(false)}>
          <ManageFriends />
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
