import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Register data:', registerData);
    // Simulate successful registration and login
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === 'login'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === 'register'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
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

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
                placeholder="Ajeet yadav"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
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
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                placeholder="••••••••"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
                placeholder="••••••••"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
