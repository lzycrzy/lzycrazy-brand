import React, { useState } from 'react';
import { useNavigate } from 'react-router'; // To programmatically navigate on successful login/register
import { useDispatch } from 'react-redux'; // To dispatch login action to redux store
import { login } from '../lib/redux/authSlice'; // redux slice action for login
import axios from '../lib/axios/axiosInstance'; // axios instance for HTTP calls
import {
  auth,
  googleProvider,
  facebookProvider,
} from '../lib/firebase/firebase'; // firebase auth & providers
import { signInWithPopup } from 'firebase/auth'; // firebase auth popup signin
import { FcGoogle } from 'react-icons/fc'; // Google icon (colorful)
import { FaFacebookF } from 'react-icons/fa'; // Facebook icon (fontawesome)
import googleLogo from '../assets/image3.png';
import fb from '../assets/image5.png';
import email from '../assets/mail.png';
import lock from '../assets/lock.png';
import identity from '../assets/identity.png';
import country from '../assets/cntry.png';
import Searchbar from '../components/Searchbar';

const Auth = () => {
  // State to toggle between login and register tabs
  const [activeTab, setActiveTab] = useState('login');

  // State to hold login form data
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // State to hold register form data, added country now
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate(); // For navigation
  const dispatch = useDispatch(); // For redux dispatch

  // Updates login form data on input change
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  // Updates register form data on input change
  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // Handles login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // prevent form default reload
    try {
      // Call backend API with login data
      const { data } = await axios.post('/v1/users/login', loginData);

      // Dispatch redux login action with user data on success
      dispatch(login({ success: true, data: data.user }));

      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      // Show alert only when user tries to login and fails
      alert(error.response?.data?.message || 'Login failed');

      // Also log error to console for debugging
      console.error(
        'Login failed:',
        error.response?.data?.message || error.message,
      );
    }
  };

  // Handles register form submission
  // Currently this just logs data and sets localStorage to true (mock)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Register data:', registerData);

    // Mock login state on register success
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  // Handles Google login via Firebase popup
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Log user info for debugging or further processing
      console.log('User Info:', {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      });

      // You may want to dispatch login here or send user info to your backend
    } catch (error) {
      console.error('Google login error:', error);
      // No alert here to avoid auto popup, but you could add one if you want:
      // alert('Google login failed');
    }
  };

  // Handles Facebook login via Firebase popup
  const handleFacebookLogin = async () => {
    try {
      facebookProvider.addScope('email');
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // Dispatch redux login with firebase user data on success
      dispatch(login({ success: true, data: user }));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert('Facebook login failed'); // alert only on user action failure
      console.error(error);
    }
  };

  // Shared input class with grey border and outline
  const inputClass =
    'w-full rounded border border-gray-300 py-2 pr-3 pl-10 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-7xl flex-col md:flex-row md:items-center md:justify-center">
        {/* Left side - Searchbar component */}
        <div className="ml-8 flex w-full -translate-y-10 items-center justify-start bg-white p-8 md:w-3/4">
          <div className="w-full max-w-xl">
            <Searchbar />
          </div>
        </div>

        {/* Right side - Authentication form */}
        <div
          className="mr-8 flex flex-col items-center justify-center bg-white p-8 shadow-lg"
          style={{ width: 452, height: 540 }}
        >
          {/* Tabs to toggle between Login and Register */}
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
              {activeTab === 'login'
                ? 'Login to your account'
                : 'Create a new account'}
            </h2>

            {/* Login form */}
            {activeTab === 'login' && (
              <form
                onSubmit={handleLoginSubmit}
                className="flex h-full flex-col justify-start"
              >
                <div className="relative mb-3">
                  <img
                    src={email}
                    className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                    alt="email"
                  />
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
                <div className="relative mb-3">
                  <img
                    src={lock}
                    className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                    alt="lock"
                  />
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
                <div className="mb-3 text-right">
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="mb-3 w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Sign In
                </button>

                <div className="my-4 flex items-center gap-4 py-2.5 text-sm text-gray-500">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="whitespace-nowrap">or continue with</span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                {/* Social Login buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 bg-white py-2 font-medium text-black shadow-sm shadow-gray-300 outline-none focus:outline-none"
                  >
                    <img
                      src={googleLogo}
                      alt="Google"
                      className="h-5 w-5 rounded-full bg-white p-0.5"
                    />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 py-2 font-medium text-black shadow-sm shadow-gray-300 outline-none hover:bg-[#155DC0] focus:outline-none"
                  >
                    <img
                      src={fb}
                      alt="Facebook"
                      className="h-5 w-5"
                    />
                    Facebook
                  </button>
                </div>
              </form>
            )}

            {/* Register form */}
            {activeTab === 'register' && (
              <form
                onSubmit={handleRegisterSubmit}
                className="flex h-full flex-col justify-start"
              >
                {/* Name inputs - first and last name */}
                <div className="mb-3 flex gap-4">
                  <div className="relative w-1/2">
                    <img
                      src={identity}
                      className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                      alt="user"
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      placeholder="First Name"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="relative w-1/2">
                    <img
                      src={identity}
                      className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                      alt="user"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      placeholder="Last Name"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Country select with grey bg and left padding for icon */}
                <div className="relative mb-3">
                  {/* Your icon goes here, e.g. <YourIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" /> */}
                  <select
                    name="country"
                    value={registerData.country}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded border border-gray-300 bg-gray-100 py-2 pr-3 pl-10 text-sm text-gray-700 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Email input */}
                <div className="relative mb-3">
                  <img
                    src={email}
                    className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                    alt="email"
                  />
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

                {/* Password input */}
                <div className="relative mb-3">
                  <img
                    src={lock}
                    className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                    alt="lock"
                  />
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

                {/* Confirm password input */}

                {/* Two spans stacked vertically with some gap */}
                <div className="mb-4 flex flex-col gap-2 text-xs text-gray-700">
                  <span>
                    We may use your contact information to improve your
                    experience.{' '}
                    <span className="cursor-pointer text-blue-600">
                      Learn more
                    </span>
                  </span>
                  <span>
                    By clicking Sign Up, you agree to our{' '}
                    <span className="cursor-pointer text-blue-600">
                      Terms of Service
                    </span>
                    ,{' '}
                    <span className="cursor-pointer text-blue-600">
                      Privacy Policy
                    </span>{' '}
                    and{' '}
                    <span className="cursor-pointer text-blue-600">
                      Cookies Policy
                    </span>
                    . You may receive updates or promotional messages from us
                    and can unsubscribe at any time.
                  </span>
                </div>

                {/* Terms and conditions checkbox */}

                {/* Register button */}
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
