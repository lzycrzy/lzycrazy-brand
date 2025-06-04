import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';
import SignIn from '../components/SignIn';

// Import Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAE7Dzhc-u7jIJgsg-mDo5rSPI1iKzIcMw",
  authDomain: "dropshipping-a6051.firebaseapp.com",
  projectId: "dropshipping-a6051",
  storageBucket: "dropshipping-a6051.firebasestorage.app",
  messagingSenderId: "45462462660",
  appId: "1:45462462660:web:a29ec836225b07dcd8a991",
  measurementId: "G-K4EKNRZ7KV"
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [firebase, setFirebase] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initialize Firebase when component mounts
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Dynamic imports to avoid issues with SSR
        const { initializeApp } = await import('firebase/app');
        const { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } = await import('firebase/auth');
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        
        setFirebase({
          auth,
          GoogleAuthProvider,
          FacebookAuthProvider,
          signInWithPopup
        });
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };
    
    initializeFirebase();
  }, []);

  const handleSocialLogin = async (provider) => {
    if (!firebase) return;
    
    try {
      let authProvider;
      let providerName;
      
      if (provider === 'google') {
        authProvider = new firebase.GoogleAuthProvider();
        providerName = 'google';
      } else if (provider === 'facebook') {
        authProvider = new firebase.FacebookAuthProvider();
        providerName = 'facebook';
      }
      
      const result = await firebase.signInWithPopup(firebase.auth, authProvider);
      const idToken = await result.user.getIdToken();
      
      // Send the token to your backend
      const { data } = await axios.post('/v1/auth/firebase/social-login', {
        idToken,
        provider: providerName
      });
      
      dispatch(login({ success: true, data: data.user }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Social login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Search UI */}
      <div className="hidden md:flex md:w-2/3 md:flex-col bg-white">
        <div className="flex flex-col items-start ml-[10vw] pt-20 h-full relative">
          {/* Logo with tagline */}
          <div className="flex flex-col ml-[35vh] justify-center items-center mb-10">
            <div className="relative">
              <img src="/logo.jpg" alt="LzyCrazy Logo" className="h-30" />
              <p className="text-xs text-gray-500 mt-1 text-center">Better Quality, Better Experience</p>
            </div>
          </div>
          <div className="relative w-140 mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search Anything..."
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-md focus:outline-none focus:ring-1 focus:ring-purple-400 shadow-sm"
            />
          </div>
          
          {/* Navigation tabs as rounded buttons */}
          <div className="flex flex-nowrap justify-start items-center space-x-4 mt-5">
            <button className="px-4 py-1 bg-purple-100 border-1 border-gray-300 text-black rounded-full text-sm font-medium">All</button>
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">Images</button>
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">Videos</button>
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">News</button>
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">Shopping</button>
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">Images</button>


          </div>
          <div className="flex flex-nowrap justify-start items-center space-x-4 mt-5">
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">Images</button>
            <button className="px-4 py-1 border-1 border-gray-200 text-black rounded-full text-sm">Videos</button>
           
           
          </div>
          
        
          
          {/* Footer text */}
          <div className="absolute bottom-22 text-xs text-gray-500">
            LzyCrazy offered in: Hindi, English, Bengali, And
          </div>
          
          {/* Copyright */}
         
        </div>
      </div>
      
      {/* Right side - Authentication */}
      <div className="flex md:w-1/3 flex-col items-center justify-center bg-white px-6 py-4 md:px-8 lg:px-12">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <SignIn firebase={firebase} handleSocialLogin={handleSocialLogin} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
