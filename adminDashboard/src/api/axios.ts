import axios from 'axios';
import { AuthService } from '../services/AuthService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use((config) => {
  const token = AuthService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
       
        // POST /api/refresh
        // Request body: { refreshToken: string }
        // Response: { accessToken: string }
        const response = await axios.post('/api/refresh', {
          refreshToken: localStorage.getItem('refreshToken')
        });
        const { accessToken } = response.data;
        AuthService.setAccessToken(accessToken);
        return api(error.config);
      } catch (err) {
        AuthService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 