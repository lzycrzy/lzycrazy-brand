import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';
import {
  auth,
  googleProvider,
  facebookProvider,
} from '../lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

// Images for form icons and branding
import googleLogo from '../assets/image3.png';
import fb from '../assets/image5.png';
import email from '../assets/mail.png';
import lock from '../assets/lock.png';
import identity from '../assets/identity.png';
import country from '../assets/cntry.png';

import Searchbar from '../components/Searchbar';
import countryList from '../data/countries.json'; // List of countries for dropdown

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login'); // Toggle between login/signup

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    phone: '',
    country: '',
    email: '',
    password: '',
    profileImage: null,
    role: 'user',
  });

  // Initialize Google provider with account selector
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle login input changes
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  // Handle register input changes
  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // Handle user login with email/password
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/v1/users/login', loginData);

      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));

      dispatch(login({ success: true, data: data.user, token: data.token }));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    }
  };

  // Handle user signup with email/password and profile image
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', registerData.fullName);
      formData.append('email', registerData.email);
      formData.append('password', registerData.password);
      formData.append('country', registerData.country);
      formData.append('role', registerData.role);
      formData.append('phone', registerData.phone);
      if (registerData.profileImage) {
        formData.append('profileImage', registerData.profileImage);
      }

      const response = await axios.post('/v1/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(login({ success: true, data: user, token }));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    }
  };

  // Handle Google login through Firebase
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post('/v1/users/google-login', { idToken });
      const { token, user: backendUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(backendUser));
      dispatch(login({ success: true, data: backendUser, token }));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Google login failed');
      console.error('Google login error:', error);
    }
  };

  // Handle Facebook login through Firebase
  const handleFacebookLogin = async () => {
    try {
      facebookProvider.addScope('email');
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post('/v1/users/facebook-login', { idToken });
      const { token, user: backendUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(backendUser));
      dispatch(login({ success: true, data: backendUser, token }));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Facebook login failed');
      console.error('Facebook login error:', error);
    }
  };

  // Shared input style
  const inputClass =
    'w-full rounded border border-gray-300 py-2 pr-3 pl-10 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-7xl flex-col md:flex-row md:items-center md:justify-center">
        {/* Left side - Branding/search */}
        <div className="ml-8 flex w-full -translate-y-10 items-center justify-start bg-white p-8 md:w-3/4">
          <div className="w-full max-w-xl">
            <Searchbar />
          </div>
        </div>

        {/* Right side - Auth Card */}
        <div
          className="mr-8 flex flex-col items-center justify-center bg-white p-8 shadow-lg"
          style={{ width: 452 }}
        >
          {/* Tabs for Login and Register */}
          <div className="mb-6 flex w-full overflow-hidden rounded-2xl border border-gray-200">
            <button
              className={`flex flex-1 items-center justify-center py-3 text-sm font-medium transition ${
                activeTab === 'login'
                  ? 'rounded-l-md bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex flex-1 items-center justify-center py-3 text-sm font-medium transition ${
                activeTab === 'register'
                  ? 'rounded-r-md bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Signup
            </button>
          </div>

          <div className="flex h-full w-full max-w-md flex-col justify-between">
            <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
              {activeTab === 'login' ? 'Login' : 'Signup'}
            </h2>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="flex flex-col">
                {/* Email */}
                <div className="relative mb-3">
                  <img src={email} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="email" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Email Address"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Password */}
                <div className="relative mb-3">
                  <img src={lock} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="lock" />
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Forgot password link */}
                <div className="mb-3 text-right">
                  <a href="/password/forgot" className="text-xs text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="mt-3.5 w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Login
                </button>

                {/* Divider and social login */}
                <div className="my-4 flex items-center gap-4 py-5.5 text-sm text-gray-500">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="whitespace-nowrap">or continue with</span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                {/* Google & Facebook login */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 bg-white py-2 font-medium text-black shadow-sm shadow-gray-300"
                  >
                    <img src={googleLogo} alt="Google" className="h-5 w-5 rounded-full bg-white p-0.5" />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 py-2 font-medium text-black shadow-sm shadow-gray-300 hover:bg-[#155DC0]"
                  >
                    <img src={fb} alt="Facebook" className="h-5 w-5" />
                    Facebook
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col">
                {/* Full Name */}
                <div className="relative mb-3">
                  <img src={identity} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="user" />
                  <input
                    type="text"
                    name="fullName"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    placeholder="Full Name"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Country dropdown */}
                <div className="relative mb-3">
                  <img src={country} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="country" />
                  <select
                    name="country"
                    value={registerData.country}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded border border-gray-300 bg-gray-100 py-2 pr-3 pl-10 text-sm text-gray-700"
                  >
                    <option value="" disabled>Select Country</option>
                    {countryList.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone number */}
                <div className="relative mb-3">
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="Phone Number"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div className="relative mb-3">
                  <img src={email} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="email" />
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Email Address"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Password */}
                <div className="relative mb-3">
                  <img src={lock} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="lock" />
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Password"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Profile image upload */}
                <div className="relative mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        profileImage: e.target.files[0],
                      })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
                  />
                </div>

                {/* Policy info */}
                <div className="mb-4 flex flex-col gap-2 text-xs text-gray-700">
                  <span>
                    We may use your contact information to improve your experience.{' '}
                    <span className="cursor-pointer text-blue-600">Learn more</span>
                  </span>
                  <span>
                    By clicking Sign Up, you agree to our{' '}
                    <span className="cursor-pointer text-blue-600">Terms of Service</span>,{' '}
                    <span className="cursor-pointer text-blue-600">Privacy Policy</span>, and{' '}
                    <span className="cursor-pointer text-blue-600">Cookies Policy</span>.
                  </span>
                </div>

                {/* Signup button */}
                <button
                  type="submit"
                  className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Signup
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
