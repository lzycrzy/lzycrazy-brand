// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.lzycrazy.com/api',
  // baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

export default instance;
