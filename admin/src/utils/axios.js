import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // to handle cookie/token if required
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
