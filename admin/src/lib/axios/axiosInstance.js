// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  // baseURL: 'http://213.210.37.185:4000/api',
  withCredentials: true,
   headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
