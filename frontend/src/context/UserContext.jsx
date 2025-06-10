// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:4000/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUser(res.data.profile);
    } catch (err) {
      console.error('Failed to fetch user in context:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <UserContext.Provider value={{ user, fetchUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
