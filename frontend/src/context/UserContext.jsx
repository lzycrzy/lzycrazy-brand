import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../lib/axios/axiosInstance';
import Loader from '../components/common/Spinner';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const DEFAULT_PROFILE_PIC = 'https://i.ibb.co/2kR5zq0/default-avatar.png';

  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
  const [displayName, setDisplayName] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  // Ensure axios always sends credentials
  axios.defaults.withCredentials = true;

  const fetchUser = async () => {
    console.log('[Auth] Fetching user...');
   
    try {
      const res = await axios.get('/v1/users/me');
      const data = res.data;

      if (!data || !data.profile) {
        throw new Error('No user data returned');
      }

      console.log('[Auth] User fetched:', data);

      setUser(data);
      setDisplayName(data?.profile?.name || '');
      setProfilePic(`${data?.profile?.photoURL || DEFAULT_PROFILE_PIC}?t=${Date.now()}`);
    } catch (error) {
      console.error('[Auth] Failed to fetch user:', error.response?.status, error.response?.data);
      setUser(null); // force logout state on failure
    } finally {
      setAuthChecked(true);
    }
  };

  // useEffect(() => {
  //   fetchUser();
  // }, []);
  useEffect(() => {
   
  
    fetchUser();
  }, []);
  

  const logout1 = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    setProfilePic(DEFAULT_PROFILE_PIC);
    setDisplayName('');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profilePic,
        displayName,
        fetchUser,
        logout1,
        authChecked,
      }}
    >
      {authChecked ? children : <Loader />}
    </UserContext.Provider>
  );
};
