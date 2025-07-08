import React, { useState, Suspense } from 'react';
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
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Searchbar from '../components/common/Searchbar';
import countryList from '../data/countries.json';
import CountryCodes from '../data/CountryCodes.json';
import Loader from '../components/common/Spinner';
import { useTranslation } from 'react-i18next'; // Add this at the top
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { useAsset } from '../store/useAsset';

const LazyForgotPassword = React.lazy(() => import('../components/Auth/ForgotPassword'));

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

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchUser } = useUser();
  const handleLoginChange = (e) =>
  setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Trim inputs first
    const email = loginData.email?.trim();
    const password = loginData.password?.trim();

    // Check all fields
    if (!email || !password) {
      toast.error('Email and password are required');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true); // ✅ Only show loading during API call

      const { data } = await axios.post('/v1/users/login', loginData);

      // ✅ Save to local storage
      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Update Redux store
      dispatch(login({ success: true, data: data.user, token: data.token }));

      // ✅ Update context
      fetchUser();

      // ✅ Success toast
      toast.success(`🎉 Welcome back, ${data.user.fullName || 'User'}!`);

      // ✅ Delay navigation so toast appears
      setTimeout(() => {
        navigate('/dashboard', { replace: true, state: { welcome: true } });
      }, 300);

    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed. Try again.';
      toast.error(msg);
      console.error('Login error:', msg);

    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Trim inputs first
    const fullName = registerData.fullName?.trim();
    const email = registerData.email?.trim();
    const phone = registerData.phone?.trim();
    const password = registerData.password?.trim();

    // Check all fields
    if (!fullName || !email || !phone || !password) {
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    // Name validation: only letters and spaces, min 3 characters
    const nameRegex = /^[A-Za-z\s.]{2,}$/;
    if (!nameRegex.test(fullName)) {
      toast.error('Name must be at least 2 characters and only contain letters/spaces');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      setLoading(false);
      return;
    }

    // Optional: block temporary email domains
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'mailinator.com'];
    if (blockedDomains.some(domain => email.endsWith(`@${domain}`))) {
      toast.error('Temporary email addresses are not allowed');
      setLoading(false);
      return;
    }

    // Phone validation (India)
    const rawPhone = registerData.phone?.trim();
    const phone1 = rawPhone.replace(/[^0-9]/g, '').slice(-10);  // keep last 10 digits

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone1)) {
      toast.error('Enter a valid 10-digit Indian mobile number');
      setLoading(false);
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be 8+ characters and include uppercase, lowercase, number, and special character');
      setLoading(false);
      return;
    }

    // Prevent password that contains name or email
    if (
      password.toLowerCase().includes(fullName.toLowerCase()) ||
      password.includes(email)
    ) {
      toast.error('Password should not contain your name or email');
      setLoading(false);
      return;
    }

    // Optional: prevent common weak passwords
    const weakPasswords = ['12345678', 'password', 'welcome123', 'admin123', 'qwerty'];
    if (weakPasswords.includes(password.toLowerCase())) {
      toast.error('Choose a stronger, less common password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/v1/users/register', {
        fullName,
        email,
        phone,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(login({ success: true, data: user, token }));
      fetchUser();

      toast.success('Registration successful!');
      navigate('/dashboard', { replace: true, state: { welcome: true } });
    } catch (error) {
      const msg = error?.response?.data?.message || 'Registration failed';
      toast.error(msg);
      console.error('Registration error:', msg);
    } finally {
      setLoading(false);
    }
  };

  //google login
  const handleGoogleLogin = async () => {
    navigate('/progress');
  }

  // const handleFacebookLogin = async () => {
  //   try {
  //     facebookProvider.addScope('email');
  //     const result = await signInWithPopup(auth, facebookProvider);
  //     const user = result.user;
  //     const idToken = await user.getIdToken();
  //     const response = await axios.post('/v1/users/facebook-login', {
  //       idToken,
  //     });
  //     const { token, user: backendUser } = response.data;
  //     localStorage.setItem('token', token);
  //     localStorage.setItem('user', JSON.stringify(backendUser));
  //     dispatch(login({ success: true, data: backendUser, token }));
  //     navigate('/dashboard',{ replace: true, state: { welcome: true } });
  //   } catch (error) {
  //     alert(error.response?.data?.message || 'Facebook login failed');
  //     console.error('Facebook login error:', error);
  //   }
  // };
  const handleFacebookLogin = async () => {
    navigate('/progress');
  }

  const inputClass =
    'w-full rounded border border-gray-300 py-3 pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400';

  const { getAssetUrl, loaded } = useAsset();

  if (loading) return <Loader />;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#ebf3fe] overflow-hidden">
        {/* Main content container */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 md:pb-12">
          <div className="flex w-full max-w-7xl flex-col md:flex-row md:items-center md:justify-center gap-6">
            {/* Left - Branding */}
            <div className="flex w-full justify-start bg-[#ebf3fe] p-4 md:p-8 md:w-3/4">
              <div className="w-full max-w-xl">
                <Searchbar />
              </div>
            </div>
  
            {/* Right - Auth Card */}
            <div className="flex w-full max-w-[452px] flex-col items-center justify-center bg-white p-6 md:p-8 shadow-lg rounded-lg">
              <div className="w-full max-w-md flex flex-col justify-between">
                <h2 className="mb-4 text-center text-xl font-semibold text-gray-800"></h2>
  
                {activeTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col">
                    <div className="relative mb-3">
                      {loaded && (<img src={getAssetUrl('mail.png')} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="email" loading="lazy" />)}
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


                      {loaded && (<img src={getAssetUrl('lock.png')} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="lock" loading="lazy" />)}

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
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                      {showForgotModal && (
                        <Suspense fallback={<div>Loading...</div>}>
                          <LazyForgotPassword onClose={() => setShowForgotModal(false)} />
                        </Suspense>
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
                        <img src={loaded ? getAssetUrl('image3.png') : "/missing.png"} alt="Google" className="h-5 w-5 rounded-full bg-white p-0.5" loading="lazy" />
                        Google
                      </button>
                      <button
                        type="button"
                        onClick={handleFacebookLogin}
                        className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-200 py-2 font-medium text-black shadow-sm shadow-gray-300 hover:bg-[#155DC0]"
                      >
                        <img src={loaded ? getAssetUrl('image5.png') : "/missing.png"} alt="Facebook" className="h-5 w-5" loading="lazy" />
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
                        onClick={() => {
                          // navigate('/progress');
                          setActiveTab('register')


                        }}
                      >
                        Create New Account
                      </button>
                    </p>
                  </form>
                )}
  
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col">
                    <div className="relative mb-3">
                      {loaded && (<img src={getAssetUrl('identity.png')} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="user" loading="lazy" />)}
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
  
                    <div className="relative mb-3">
                      <PhoneInput
                        country={'in'}
                        value={registerData.phone}
                        onChange={(phone) => setRegisterData((prev) => ({ ...prev, phone }))}
                        placeholder="Phone Number"
                        enableSearch
                        inputStyle={{
                          width: '100%',
                          paddingLeft: '48px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          paddingRight: '12px',
                          borderRadius: '0.375rem',
                          border: '1px solid #d1d5db',
                          fontSize: '0.875rem',
                        }}
                        buttonStyle={{
                          borderRight: '1px solid #d1d5db',
                          backgroundColor: '#f9fafb',
                        }}
                        containerStyle={{ width: '100%' }}
                      />
                    </div>
  
                    <div className="relative mb-3">
                      {loaded && (<img src={getAssetUrl('mail.png')} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="email" loading="lazy" />)}
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
                      {loaded && (<img src={getAssetUrl('lock.png')} className="absolute top-2.5 left-3 h-5 w-5 opacity-70" alt="lock" loading="lazy" />)}
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
                        We may use your contact information to improve your experience.{' '}
                        <span className="cursor-pointer text-blue-600">Learn more</span>
                      </span>
                      <span>
                        By clicking Sign Up, you agree to our{' '}
                        <span className="cursor-pointer text-blue-600">Terms of Service</span>,{' '}
                        <span className="cursor-pointer text-blue-600">Privacy Policy</span>, and{' '}
                        <span className="cursor-pointer text-blue-600">Cookies Policy</span>
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
                        Already have an account?
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer - Always at the bottom */}
        <footer className="w-full border-t border-gray-200 bg-[#ebf3fe] py-4 text-sm text-gray-600">
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between px-4 sm:px-20 gap-4">
        <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
          <span>India</span>
          <span className="mx-2">|</span>
          <span>LzyCrazy offered in:</span>
          <button onClick={() => i18n.changeLanguage('hi')} className="ml-2 text-blue-600 hover:underline">हिन्दी</button>
          <button onClick={() => i18n.changeLanguage('en')} className="ml-2 text-blue-600 hover:underline">English</button>
          <button onClick={() => i18n.changeLanguage('bn')} className="ml-2 text-blue-600 hover:underline">বাংলা</button>
          <button onClick={() => i18n.changeLanguage('ar')} className="ml-2 text-blue-600 hover:underline">العربية</button>
        </div>
        <div className="flex gap-6 justify-center sm:justify-end">
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </footer>
      </div>
    </>
  )};

export default Auth;

