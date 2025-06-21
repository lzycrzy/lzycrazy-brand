import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../lib/axios/axiosInstance';
import Header from '../components/static/Header';
import Sidebar from '../components/Home/Sidebar1';
import MainFeed from '../components/Home/MainFeed';
import RightSidebar from '../components/Home/RightSidebar';
import ChatSidebar from '../components/Home/ChatSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/common/Spinner';
import { useUser } from '../context/UserContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();
  const { user, loading } = useUser();

  useEffect(() => {
    if (location.state?.welcome && user?.fullName) {
      toast.success(`🎉 Welcome back, ${user.fullName}!`, {
        position: 'top-center',
        autoClose: 4000,
      });
    }
  }, [location.state, user]);

  const people = [
    { name: "Aarav Mehta", image: "https://randomuser.me/api/portraits/men/32.jpg", follow: false },
    { name: "Ishita Roy", image: "https://randomuser.me/api/portraits/women/45.jpg", follow: true },
    { name: "Karan Patel", image: "https://randomuser.me/api/portraits/men/52.jpg", follow: false },
    { name: "Riya Singh", image: "https://randomuser.me/api/portraits/women/12.jpg", follow: true },
    { name: "Neeraj Gupta", image: "https://randomuser.me/api/portraits/men/64.jpg", follow: false },
  ];

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get('/v1/users/posts', { withCredentials: true });
        setPosts(response.data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchAllPosts();
  }, [location]);

  if (loading) return <Loader />;

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden">
      {showWelcome && (
        <div className="fixed w-full h-full inset-0 z-[2000] flex items-center justify-center bg-black/50">
          <div className="rounded bg-white px-6 py-4 text-lg font-semibold shadow-lg">
            👋 Welcome back!
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 gap-2 pt-5 overflow-hidden">
        {/* Left Sidebar (hide on small screens) */}
        <div className="hidden lg:block w-64 border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Main Feed (always visible) */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 sm:px-4 lg:px-6">
          <MainFeed posts={posts} />
        </div>

        {/* Right Sidebar (hide on md and below) */}
        <div className="hidden xl:block w-[300px] border-l border-gray-200">
          <RightSidebar people={people} />
        </div>
      </div>

      {/* Floating Chat Button or Sidebar */}
      <div className="fixed bottom-4 right-4 xl:relative xl:bottom-0 xl:right-0 xl:block">
        <ChatSidebar />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
