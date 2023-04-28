import axios from 'axios';
import { API_URL } from './url';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('jwt');
  if (token) {
    config.headers.authorization = `${token}`;
  }
  return config;
});

export default apiClient;
