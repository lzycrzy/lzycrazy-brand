// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/v1/users/password/forgot', { email });
      setMsg(res.data.message);
    } catch (error) {
      setMsg(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <button type="submit">Send Reset Link</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ForgotPassword;
