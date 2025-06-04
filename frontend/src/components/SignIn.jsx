import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login } from '../lib/redux/authSlice';
import axios from '../lib/axios/axiosInstance';

const SignIn = ({ firebase, handleSocialLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    password: '',
    phone: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "India", "Japan", "China", "Brazil"
  ];

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSignupChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSignupData({ ...signupData, [e.target.name]: value });
    if (errorMessage) setErrorMessage('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      if (!firebase) {
        setErrorMessage('Authentication system is not available');
        return;
      }

      const { signInWithEmailAndPassword } = await import('firebase/auth');

      const userCredential = await signInWithEmailAndPassword(
        firebase.auth,
        loginData.email,
        loginData.password
      );
      
      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Use the token to authenticate with the backend
      const { data } = await axios.post('/v1/auth/firebase/social-login', {
        idToken,
        provider: 'google' // Use the same provider as signup to ensure consistency
      });
      
      dispatch(login({ success: true, data: data.user }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!signupData.agreeToTerms) {
      setErrorMessage('You must agree to the Terms of Service to sign up.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      if (!firebase) {
        setErrorMessage('Authentication system is not available. Please try again later.');
        return;
      }

      // Import additional Firebase auth methods needed for registration
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      
      // Define the full name before using it
      const fullName = `${signupData.firstName} ${signupData.lastName}`.trim();
      
      // Create the user in Firebase with email/password
      const userCredential = await createUserWithEmailAndPassword(
        firebase.auth,
        signupData.email,
        signupData.password
      );
      
      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Update the Firebase user profile with name
      await updateProfile(firebase.auth.currentUser, {
        displayName: fullName
      });
      
      // Force token refresh to include the updated display name
      await firebase.auth.currentUser.getIdToken(true);
      
      // Get a fresh token with the updated profile info
      const refreshedToken = await firebase.auth.currentUser.getIdToken();
      
      // Send to backend with all required user data
      const { data } = await axios.post('/v1/auth/firebase/social-login', {
        idToken: refreshedToken,
        provider: 'google', // Using 'google' to avoid phone validation requirement
        userData: {
          phone: signupData.phone || '0000000000',
          fullName: fullName, // Use the explicit fullName variable
          email: signupData.email,
          country: signupData.country || '',
          role: 'user', // Explicitly set role to user
          authProvider: 'google'
        }
      });
      
      dispatch(login({ success: true, data: data.user }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Login/Signup toggle with smooth transitions */}
      <div className="flex rounded-md overflow-hidden mb-2 relative">
        {/* Animated background slider */}
        <div 
          className="absolute top-0 bottom-0 w-1/2 bg-[#4747ED] rounded-md transition-all duration-300 ease-in-out" 
          style={{ left: isSignUp ? '50%' : '0%' }}
        />
        <button
          className={`flex-1 py-2 z-10 text-center transition-colors duration-300 ease-in-out ${!isSignUp ? 'text-white font-medium' : 'text-gray-700'}`}
          onClick={() => setIsSignUp(false)}
          type="button"
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 z-10 text-center transition-colors duration-300 ease-in-out ${isSignUp ? 'text-white font-medium' : 'text-gray-700'}`}
          onClick={() => setIsSignUp(true)}
          type="button"
        >
          Signup
        </button>
      </div>
      
      <h2 className="text-2xl font-semibold text-center mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
      
      {errorMessage && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      
      {!isSignUp ? (
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email field */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full pl-10 py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          {/* Password field */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.9965 16H16.0054" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.99451 16H8.00349" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full pl-10 py-2 px-3 pr-8 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.53 9.47L9.47001 14.53C8.82001 13.88 8.42001 12.99 8.42001 12C8.42001 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.42001 19.53C9.56001 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39999C20.78 8.87999 20.42 8.38999 20.05 7.92999" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.47 14.53L2 22" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L14.53 9.47" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42 12 8.42C13.98 8.42 15.58 10.02 15.58 12Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.72997 12 3.72997C8.47 3.72997 5.18 5.79997 2.89 9.39997C1.99 10.81 1.99 13.18 2.89 14.59C5.18 18.19 8.47 20.27 12 20.27Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-xs text-[#4747ED]">Forgot password?</a>
          </div>
          
          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-[#4747ED] text-white font-medium py-3 rounded-md hover:bg-blue-600 transition-colors mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit} className="space-y-5">
          {/* First Name and Last Name fields */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative ">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={signupData.firstName}
                  onChange={handleSignupChange}
                  className="w-full pl-10 py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={signupData.lastName}
                  onChange={handleSignupChange}
                  className="w-full pl-10 py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Country dropdown */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.51562 9H20.4844" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.51562 15H20.4844" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20.7C14.0711 20.7 15.75 16.9706 15.75 12C15.75 7.02944 14.0711 3.3 12 3.3C9.92893 3.3 8.25 7.02944 8.25 12C8.25 16.9706 9.92893 20.7 12 20.7Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <select
              name="country"
              value={signupData.country}
              onChange={handleSignupChange}
              className="w-full pl-10 py-2 px-3 pr-8 border border-gray-200 rounded-md appearance-none focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
            <span className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          
        
          
          {/* Email field */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-full pl-10 py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          {/* Password field */}
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.9965 16H16.0054" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9945 16H12.0035" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.99451 16H8.00349" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-full pl-10 py-2 px-3 pr-8 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.53 9.47L9.47001 14.53C8.82001 13.88 8.42001 12.99 8.42001 12C8.42001 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.42001 19.53C9.56001 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39999C20.78 8.87999 20.42 8.38999 20.05 7.92999" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.47 14.53L2 22" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L14.53 9.47" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42 12 8.42C13.98 8.42 15.58 10.02 15.58 12Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.72997 12 3.72997C8.47 3.72997 5.18 5.79997 2.89 9.39997C1.99 10.81 1.99 13.18 2.89 14.59C5.18 18.19 8.47 20.27 12 20.27Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          
          {/* Terms checkbox */}
          <div className="flex items-start mt-4 text-xs text-gray-500">
            <input
              id="terms"
              type="checkbox"
              name="agreeToTerms"
              checked={signupData.agreeToTerms}
              onChange={handleSignupChange}
              className="mr-2 mt-0.5"
            />
            <label htmlFor="terms">
              By creating an account, I agree to our <a href="#" className="text-[#4747ED]">Terms of Service</a> and <a href="#" className="text-[#4747ED]">Privacy Policy</a>
            </label>
          </div>
          
          {/* Signup button */}
          <button
            type="submit"
            className="w-full bg-[#4747ED] text-white font-medium py-3 rounded-md hover:bg-blue-600 transition-colors "
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Signup"}
          </button>
        </form>
      )}
      
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-xs text-gray-500">Or continue with</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      <div className="flex justify-center space-x-8">
        <button
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center"
          disabled={isLoading || !firebase}
        >
          <div className="flex items-center">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.96A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.96 4.042l3.004-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .96 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span className="ml-2 text-sm text-gray-700">Google</span>
          </div>
        </button>
        
        <button
          onClick={() => handleSocialLogin('facebook')}
          className="flex items-center justify-center"
          disabled={isLoading || !firebase}
        >
          <div className="flex items-center">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M18 9a9 9 0 10-10.406 8.89v-6.288H5.309V9h2.285V7.017c0-2.255 1.343-3.501 3.4-3.501.984 0 2.014.175 2.014.175v2.215h-1.135c-1.118 0-1.467.694-1.467 1.406V9h2.496l-.399 2.602h-2.097v6.288A9.002 9.002 0 0018 9z" fill="#1877F2"/>
            </svg>
            <span className="ml-2 text-sm text-gray-700">Facebook</span>
          </div>
        </button>
      </div>
    </>
  );
};

export default SignIn;
