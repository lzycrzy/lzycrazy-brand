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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import googleLogo from '../assets/image3.png';
import fb from '../assets/image5.png';
import email from '../assets/mail.png';
import lock from '../assets/lock.png';
import identity from '../assets/identity.png';
import country from '../assets/cntry.png';
import ForgotPassword from '../components/ForgotPassword';

import Searchbar from '../components/Searchbar';
import countryList from '../data/countries.json';
import CountryCodes from '../data/CountryCodes.json';
import Loader from '../components/Spinner';
import { useTranslation } from 'react-i18next'; // Add this at the top


const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  // Inside your component (near the top)
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    phone: '',

    email: '',
    password: '',
    role: 'user',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/v1/users/login', loginData);
      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(login({ success: true, data: data.user, token: data.token }));
      navigate('/dashboard',{ replace: true, state: { welcome: true } });
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !registerData.email ||
      !registerData.password ||
      !registerData.phone ||
      !registerData.fullName
    ) {
      alert('Please fill in all the required fields');
      return;
    }
    try {
      const response = await axios.post('/v1/users/register', registerData);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(login({ success: true, data: user, token }));
      navigate('/dashboard',{ replace: true, state: { welcome: true } });
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      navigate('/dashboard',{ replace: true, state: { welcome: true } });
    } catch (error) {
      alert(error.response?.data?.message || 'Google login failed');
      console.error('Google login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      facebookProvider.addScope('email');
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await axios.post('/v1/users/facebook-login', {
        idToken,
      });
      const { token, user: backendUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(backendUser));
      dispatch(login({ success: true, data: backendUser, token }));
      navigate('/dashboard',{ replace: true, state: { welcome: true } });
    } catch (error) {
      alert(error.response?.data?.message || 'Facebook login failed');
      console.error('Facebook login error:', error);
    }
  };

  const inputClass =
    'w-full rounded border border-gray-300 py-3 pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400';

  if (loading) return <Loader />;

  return (
    <>
      <div className="flex max-h-screen w-full flex-col items-center overflow-y-hidden bg-[#ebf3fe] px-4 pb-8 md:pb-12">
        <div className="flex w-full max-w-7xl flex-col md:flex-row md:items-center md:justify-center">
          {/* Left - Branding */}
          <div className="ml-8 flex w-full -translate-y-10 items-center justify-start bg-[#ebf3fe] p-8 md:w-3/4">
            <div className="w-full max-w-xl">
              <Searchbar />
            </div>
          </div>

          {/* Right - Auth Card */}
          <div
            className="mr-8 flex flex-col items-center justify-center bg-white p-8 shadow-lg"
            style={{ width: 452 }}
          >
            {/* <div className="mb-6 flex w-full overflow-hidden rounded-2xl border border-gray-200">
              <button
                className={`flex flex-1 items-center justify-center py-3 text-sm font-medium transition ${
                  activeTab === 'login'
                    ? 'rounded-r-md bg-[linear-gradient(to_right,_#9758fe,_#ff6ec4)] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`flex flex-1 items-center justify-center py-3 text-sm font-medium transition ${
                  activeTab === 'register'
                    ? 'rounded-r-md bg-[linear-gradient(to_right,_#9758fe,_#ff6ec4)] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Signup
              </button>
            </div> */}

            <div className="flex h-full w-full max-w-md flex-col justify-between">
              <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
                {/* {activeTab === 'login'
                  ? 'Login to Your Account'
                  : 'Create a New Account'} */}
              </h2>

              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="flex flex-col">
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
                  <button
        onClick={() => setShowForgotModal(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        Forgot Password?
      </button>

      {showForgotModal && (
        <ForgotPassword onClose={() => setShowForgotModal(false)} />
      )}
                  </div>

                  <button
                    type="submit"
                    className="mt-3.5 w-full rounded bg-[linear-gradient(to_right,_#9758fe,_#ff6ec4)] py-2 font-semibold text-white"
                  >
                    Login
                  </button>

                  <div className="my-4 flex items-center gap-4 py-3 text-sm text-gray-500">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="whitespace-nowrap">or continue with</span>
                    <div className="h-px flex-1 bg-gray-300" />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 bg-white py-2 font-medium text-black shadow-sm shadow-gray-300"
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
                      className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 py-2 font-medium text-black shadow-sm shadow-gray-300 hover:bg-[#155DC0]"
                    >
                      <img src={fb} alt="Facebook" className="h-5 w-5" />
                      Facebook
                    </button>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-600">
                    <button
                      type="button"
                      className={`mt-3.5 w-1/2 rounded bg-[linear-gradient(to_right,_#9758fe,_#ff6ec4)] py-2 font-semibold text-white ${
                        activeTab === 'register'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-400 text-white'
                          : 'bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('register')}
                    >
                      Create New Account
                    </button>
                  </p>
                </form>
              )}

              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col">
                  <div className="relative mb-3">
                    <img
                      src={identity}
                      className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                      alt="user"
                    />
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

                  {/* <div className="relative mb-3">
                    <img
                      src={country}
                      className="absolute top-2.5 left-3 h-5 w-5 opacity-70"
                      alt="country"
                    />
                    <select
                      name="country"
                      value={registerData.country}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded border border-gray-300 bg-[#ebf3fe] py-2 pr-3 pl-10 text-sm text-gray-700"
                    >
                      <option value="" disabled>
                        Select Country
                      </option>
                      {countryList.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  {/* <div className="relative mb-3">
                    <input
                      type="tel"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      placeholder="Phone Number"
                      required
                      className={inputClass}
                    />
                  </div> */}
                  <div className="relative mb-3">
                    <PhoneInput
                      country={'in'}
                      value={registerData.phone}
                      onChange={(phone) =>
                        setRegisterData((prev) => ({ ...prev, phone }))
                      }
                      placeholder="Phone Number"
                      enableSearch={true}
                      inputStyle={{
                        width: '100%',
                        paddingLeft: '48px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        paddingRight: '12px',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db', // Tailwind border-gray-300
                        fontSize: '0.875rem',
                      }}
                      buttonStyle={{
                        borderRight: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                      }}
                      containerStyle={{
                        width: '100%',
                      }}
                    />
                  </div>

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
                      </span>
                      , and{' '}
                      <span className="cursor-pointer text-blue-600">
                        Cookies Policy
                      </span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded bg-[linear-gradient(to_right,_#9758fe,_#ff6ec4)] py-2 font-semibold text-white"
                  >
                    Signup
                  </button>
                  <p className="mt-4 text-center text-sm text-gray-600">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => setActiveTab('login')}
                    >
                      Already have an account?{' '}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🌍 Google-style Footer */}
      <footer className="absolute bottom-0 w-full border-t border-gray-200 bg-[#ebf3fe] py-4 text-sm text-gray-600">
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-20">
          {/* Left Side - Location + LzyCrazy + Languages */}
          <div className="flex flex-wrap items-center gap-2">
            <div>India</div>
            <div className="ml-2">|</div> {/* Separator */}
            <div>LzyCrazy offered in:</div>
            {/* Language buttons with spacing */}
            <button
              onClick={() => i18n.changeLanguage('hi')}
              className="ml-2 text-blue-600 hover:underline"
            >
              हिन्दी
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className="ml-2 text-blue-600 hover:underline"
            >
              English
            </button>
            <button
              onClick={() => i18n.changeLanguage('bn')}
              className="ml-2 text-blue-600 hover:underline"
            >
              বাংলা
            </button>
            <button
              onClick={() => i18n.changeLanguage('ar')}
              className="ml-2 text-blue-600 hover:underline"
            >
              العربية
            </button>
          </div>

          {/* Right Side - Links */}
          <div className="flex gap-6">
            <span className="cursor-pointer hover:underline">Privacy</span>
            <span className="cursor-pointer hover:underline">Terms</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Auth;
