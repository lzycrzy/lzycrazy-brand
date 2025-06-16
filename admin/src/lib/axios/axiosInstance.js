// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://213.210.37.185:4000/api',
  withCredentials: true,
});

export default instance;
