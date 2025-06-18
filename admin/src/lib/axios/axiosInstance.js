// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:4000/api/v1',
  baseURL: 'https:api.lzycrazy.com/api/v1',
  withCredentials: true,
   headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
