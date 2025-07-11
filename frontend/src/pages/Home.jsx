import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../lib/axios/axiosInstance';
import Header from '../components/static/Header';
import Sidebar from '../components/Home/Sidebar1';
import MainFeed from '../components/Home/MainFeed';
import RightSidebar from '../components/Home/RightSidebar';
import MobileNav from '../components/Home/MobileNav';
import ChatSidebar from '../components/Home/ChatSidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/common/Spinner';
import { useUser } from '../context/UserContext';
import { useProduct } from '../store/useProduct';
import WorkInProgress from '../components/workInProgress/WorkInProgress';

const LazyAddProduct = React.lazy(() => import('./AddProduct'));

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
    {
      name: 'Aarav Mehta',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      follow: false,
    },
    {
      name: 'Ishita Roy',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      follow: true,
    },
    {
      name: 'Karan Patel',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      follow: false,
    },
    {
      name: 'Riya Singh',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      follow: true,
    },
    {
      name: 'Neeraj Gupta',
      image: 'https://randomuser.me/api/portraits/men/64.jpg',
      follow: false,
    },
  ];
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get('/v1/users/posts', {
          withCredentials: true,
        });
        setPosts(response.data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
    fetchAllPosts();
  }, [location]);

  if (loading) return <Loader />;
  const {isAddProductModal} = useProduct();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-100">
      {showWelcome && (
        <div className="fixed inset-0 z-[2000] flex h-full w-full items-center justify-center bg-black/50">
          <div className="rounded bg-white px-6 py-4 text-lg font-semibold shadow-lg">
            👋 Welcome back!
          </div>
        </div>
      )}

      {isAddProductModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyAddProduct />
        </Suspense>
      )}
      {/* Top Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 gap-2 overflow-hidden pt-5">
        {/* Left Sidebar (hide on small screens) */}
        <div className="hidden w-64 border-r border-gray-200 lg:block">
          <Sidebar />
        </div>

        {/* Bottom Navbar for small screens */}
        <div className="fixed right-0 bottom-0 left-0 z-50 flex h-14 items-center justify-around border-t border-gray-300 bg-white shadow-md lg:hidden">
          <MobileNav />
        </div>

        {/* Main Feed (always visible) */}
        <div className="scrollbar-hide h-fit flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6">
        {/* <MainFeed posts={posts} onPostCreated={handlePostCreated} user={user} /> */}
        <WorkInProgress />

        </div>

        {/* Right Sidebar (hide on md and below) */}
        {/* <div className="hidden w-[300px] border-l border-gray-200 xl:block">
          <RightSidebar people={people} />
        </div> */}
      </div>

      {/* Floating Chat Button or Sidebar */}
      {/* <div className="fixed right-4 bottom-4 xl:relative xl:right-0 xl:bottom-0 xl:block">
        <ChatSidebar />
      </div> */}

    </div>
  );
};

export default Home;
