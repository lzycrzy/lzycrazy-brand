// src/pages/ResetPassword.jsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from '../lib/axios/axiosInstance';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/v1/users/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      setMsg(res.data.message);
    } catch (error) {
      setMsg(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type="submit">Reset Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ResetPassword;
