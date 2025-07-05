import { createContext, useContext, useState, useEffect } from 'react';
import instance from '../utils/axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const fetchAdminProfile = async () => {
    try {
      const res = await instance.get('/admin/me');
      setAdmin(res.data.admin);
    } catch (err) {
      console.error('Failed to fetch admin profile', err);
    }
  };

  const updateAdmin = (updated) => {
    setAdmin(updated);
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, updateAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
