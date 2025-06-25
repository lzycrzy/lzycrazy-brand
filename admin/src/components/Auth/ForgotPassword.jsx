import { useState, useRef, useEffect } from 'react';
import axios from '../../lib/axios/axiosInstance';
import { IoClose } from 'react-icons/io5';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async () => {
    setMsg('');
    setError('');
    try {
      const res = await axios.post('/v1/users/password/forgot', { email });
      setMsg(res.data.message);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-md bg-white p-8 shadow-md"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoClose size={22} />
        </button>

        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Find Your Account
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Input & Button */}
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="mb-4 w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </div>

        {/* Status Messages */}
        {msg && (
          <div className="mt-4 rounded bg-green-100 px-4 py-2 text-sm text-green-700">
            {msg}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {submitted && (
          <p className="mt-4 text-center text-sm text-gray-500">
            If the email is registered, you’ll receive a reset link shortly.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
