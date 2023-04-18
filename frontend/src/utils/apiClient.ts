import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('jwt');
  if (token) {
    config.headers.authorization = `${token}`;
  }
  return config;
});

export default apiClient;
