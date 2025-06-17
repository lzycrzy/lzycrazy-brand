import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../lib/axios/axiosInstance';
import { Loader } from 'lucide-react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);


  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
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
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (updated) => {
    if (updated.name) setDisplayName(updated.name);
    if (updated.photoURL) setProfilePic(`${updated.photoURL}?t=${Date.now()}`);
  };
  const logout1 = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    setProfilePic('');
    setDisplayName('');
  };

  return (
    <UserContext.Provider
      value={{ user, profilePic, displayName, fetchUser, updateUser,logout1}}
    >
      {children}
    </UserContext.Provider>
  );
};
