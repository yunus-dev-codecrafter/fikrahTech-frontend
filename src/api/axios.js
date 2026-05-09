import axios from 'axios';

// Get API URL from environment variable with fallback
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('Axios baseURL:', `${apiUrl}/api`); // Debug log

const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access. Redirecting to login.');
      // Clear local storage and redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Using window.location.href to force a full page reload and clear React Router state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
