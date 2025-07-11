import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // to handle cookie/token if required
  headers: {
    'Content-Type': 'application/json',
  },
});

export const multiInstance= axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
   'withCredentials':true,
 headers:{
        "Content-Type":"multipart/form-data"
    }
})

instance.interceptors.request.use(
  (config) => {
    //  Skip auth for public routes
    if (
      config.url?.includes('/auth') ||
      config.url?.includes('/password/forgot') ||
      config.url?.includes('/password/reset')
    ) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      console.error('Unauthorized access - Please check your credentials');
    }
    return Promise.reject(error);
  }
);

export default instance;
