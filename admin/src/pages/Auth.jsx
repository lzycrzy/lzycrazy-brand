import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/users/login', loginData);
      dispatch(login({ success: true, data: data.user }));
      navigate('/dashboard'); // or wherever you want to redirect after login
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data?.message || error.message,
      );
      alert(error.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className="flex-1 py-3 text-center text-sm font-medium border-b-2 border-blue-600 text-blue-600 hover:text-gray-700"
          >
            Sign In
          </button>
        
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                placeholder="ajeet@example.com"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                placeholder="••••••••"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
        )}
        
      </div>
    </div>
  );
};

export default Auth;
