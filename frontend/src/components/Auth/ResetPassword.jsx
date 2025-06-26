import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../lib/axios/axiosInstance';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
  
    // Step-by-step validations
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setMsg('');
      return;
    }
  
    if (!/[a-z]/.test(password)) {
      setError('Password must include at least one lowercase letter.');
      setMsg('');
      return;
    }
  
    if (!/[A-Z]/.test(password)) {
      setError('Password must include at least one uppercase letter.');
      setMsg('');
      return;
    }
  
    if (!/[0-9]/.test(password)) {
      setError('Password must include at least one number.');
      setMsg('');
      return;
    }
  
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      setError('Password must include at least one special character.');
      setMsg('');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setMsg('');
      return;
    }
  
    try {
      const res = await axios.post(`/users/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      setMsg(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      setMsg('');
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🔐 Reset Your Password
        </h2>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        {msg && <p className="mt-4 text-green-600 text-center">{msg}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
