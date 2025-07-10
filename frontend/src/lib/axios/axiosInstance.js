// // src/axiosInstance.js
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
// });
// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const err = error.response?.data;

//     if (err?.errors && Array.isArray(err.errors)) {
//       err.errors.forEach((e) => toast.error(e));
//     } else if (err?.message) {
//       toast.error(err.message);
//     } else {
//       toast.error("Something went wrong!");
//     }

//     return Promise.reject(error);
//   }
// );
// export default instance;

// src/axiosInstance.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
export const multiInstance = axios.create({
  baseURL:"http://localhost:4000/api",
  //  import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // to handle cookie/token if required
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
// Track current pathname globally (set from App/Layout)
let currentPathname = '/';

// Function to update pathname from your app
export const setCurrentPathname = (path) => {
  currentPathname = path;
};

// Add interceptor for handling errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error.response?.data;
    const status = error.response?.status;

    // Suppress 401 toast on login/register pages
    const suppressToast =
      status === 401 &&
      (currentPathname === '/' || currentPathname === '/register');

    if (!suppressToast) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => toast.error(e));
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong!");
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
