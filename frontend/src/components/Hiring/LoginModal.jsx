import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../../lib/axios/axiosInstance';
import { setHiringInProgress } from '../../lib/redux/authSlice';
import Loader from '../common/Spinner';

// Reusable Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  min,
  max,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
    />
  </div>
);

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLogging, setIsLogging] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = loginData;

    // Basic validations
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsLogging(true);

      const { data } = await axios.post('/v1/users/login', loginData);

      // Set hiring in progress flag to prevent auto-authentication on page reload
      dispatch(setHiringInProgress(true));

      // Success toast
      toast.success(`Welcome back, ${data.user.fullName || 'User'}! Proceeding to application form...`);

      // Add a small delay to show the toast, then proceed to next step
      setTimeout(() => {
        onLoginSuccess({
          email: data.user.email,
          userId: data.user._id || data.user.id,
          token: data.token,
          fullName: data.user.fullName,
          tempUserData: data.user // Store the full user data temporarily
        });
      }, 1000); // 1 second delay to show success message

    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      console.error('Login error:', msg);
    } finally {
      setIsLogging(false);
    }
  };

  const handleClose = () => {
    setLoginData({ email: '', password: '' });
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      {isLogging && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      )}
      
      <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-blue-700">
          LOGIN TO APPLY
        </h2>
        <p className="mb-4 text-center text-sm text-gray-600">
          Please login with your email and password to continue with your job application
        </p>
        
        <p className="mb-6 text-center text-sm text-blue-600">
          Don't have an account? 
          <a 
            href="/auth" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline font-medium ml-1"
          >
            Sign Up Here
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            required
            label="Email Address"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email address"
          />
          
          <Input
            required
            label="Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            disabled={isLogging}
            className={`w-full rounded-md px-6 py-3 text-white font-medium ${
              isLogging ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLogging ? 'Logging in...' : 'LOGIN & CONTINUE'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;