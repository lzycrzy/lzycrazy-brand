import React, { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../lib/axios/axiosInstance';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar1';
import MainFeed from '../components/MainFeed';
import RightSidebar from '../components/RightSidebar';
import ChatSidebar from '../components/ChatSidebar'; 



const Home = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
 
  const [showWelcome, setShowWelcome] = useState(false);

  
  useEffect(() => {
    
    if (location.state?.welcome) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
        // Clear the welcome from location state so it doesn't repeat
        window.history.replaceState({}, document.title);
      }, 3000); // Show for 3 seconds
  
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  const people = [
    {
      name: "Aarav Mehta",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      follow: false,
    },
    {
      name: "Ishita Roy",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      follow: true,
    },
    {
      name: "Karan Patel",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      follow: false,
    },
    {
      name: "Riya Singh",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      follow: true,
    },
    {
      name: "Neeraj Gupta",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      follow: false,
    },
  ];
  
  useEffect(() => {
    console.log("hello")
    if (location.state?.welcome) {
      console.log("welcome")
      alert('Welcome back!'); // You can use toast or modal instead
      // You can also clear the welcome state if needed
    }
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get('/v1/users/posts',{withCredentials:"true"});
        console.log(response)
        setPosts(response.data.posts); // Ensure your backend returns { posts: [...] }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchAllPosts();
  }, [location]);
  

  return (
    
    <div className="h-screen w-screen mt-0 top-0 gap-x-4  gap-6 flex flex-col bg-gray-100 font-sans overflow-hidden m-0 p-0">
       {showWelcome && (
        <div className="fixed w-full h-full inset-0 z-2000 flex items-center justify-center bg-black/50">
          <div className="rounded bg-white px-6 py-4 text-lg font-semibold shadow-lg">
            👋 Welcome back!
          </div>
        </div>
      )}
      <Header />
      <div className="flex flex-1 overflow-hidden gap-4 px-4">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto scroll-hidden">
          <MainFeed posts={posts} />
        </div>

        <RightSidebar people={people} />
        <ChatSidebar />

      </div>
     
    </div>
  );
};

export default Home;


