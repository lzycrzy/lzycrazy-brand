// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import axios from '../lib/axios/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await axios.post('/api/v1/users/password/forgot', { email });
      setMsg(res.data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Find Your Account
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="mb-4 w-full rounded border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>

        {/* Message/Status */}
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

        {/* After submission feedback */}
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
