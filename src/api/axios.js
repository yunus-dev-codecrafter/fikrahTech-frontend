import axios from 'axios';

// Get API URL from environment variable and sanitize it
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const apiUrl = rawApiUrl.replace(/\/+$/, ''); // Remove trailing slashes
console.log('Using API URL:', apiUrl);

const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`, // Ensure single slash between base URL and /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Only add Authorization header if token exists and has valid JWT format (3 parts separated by dots)
    if (token && token.split('.').length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      console.warn('Invalid JWT token format detected, not sending Authorization header');
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
