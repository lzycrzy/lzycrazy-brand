import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../utils/axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchAdminProfile = async () => {
    try {
      const res = await instance.get('/admin/me'); // uses HttpOnly cookie
      setAdmin(res.data.admin);
    } catch (err) {
      console.error('Failed to fetch admin profile', err);
      setAdmin(null);

     
      navigate('/');
    }
  };

  const updateAdmin = (updated) => {
    setAdmin(updated);
  };

  const logoutAdmin = async () => {
    try {
      await instance.post('/admin/logout'); // clears cookie on backend
      localStorage.removeItem('adminToken');
    } catch (err) {
      console.error('Logout error', err);
    } finally {

   
    setAdmin(null);   
      navigate('/'); // redirect after logout
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, updateAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);