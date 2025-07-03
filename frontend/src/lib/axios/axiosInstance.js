// src/axiosInstance.js
import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error.response?.data;

    if (err?.errors && Array.isArray(err.errors)) {
      err.errors.forEach((e) => toast.error(e));
    } else if (err?.message) {
      toast.error(err.message);
    } else {
      toast.error("Something went wrong!");
    }

    return Promise.reject(error);
  }
);
export default instance;
