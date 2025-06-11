import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../lib/axios/axiosInstance';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [displayName, setDisplayName] = useState('');

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const data = res.data;
      setUser(data);
      setDisplayName(data.profile.name);
      setProfilePic(`${data.profile.photoURL}?t=${Date.now()}`);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (updated) => {
    if (updated.name) setDisplayName(updated.name);
    if (updated.photoURL) setProfilePic(`${updated.photoURL}?t=${Date.now()}`);
  };

  return (
    <UserContext.Provider
      value={{ user, profilePic, displayName, fetchUser, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
