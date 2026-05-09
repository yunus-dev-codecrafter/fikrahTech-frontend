import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Login Attempt Data:', formData);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      const { token, user } = response.data;
      
      await login(token, user);
      setToastMessage('Login successful!');
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      console.error('SERVER_ERROR:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-glass animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4 animate-pulse-glow">
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FikrahTech</h1>
          <p className="text-surface-200">Welcome back to your admin panel</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="email-address" className="floating-label">
              Email address
            </label>
            <div className="relative">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-surface-50 bg-opacity-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900 placeholder-surface-600 transition-all duration-300"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="floating-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-surface-50 bg-opacity-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900 placeholder-surface-600 transition-all duration-300 pr-12"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-600 hover:text-primary-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 animate-slide-up">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  <span className="ml-2">Authenticating...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-surface-600 text-sm">
              <input
                type="checkbox"
                className="mr-2 rounded border-surface-300 bg-surface-50 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-surface-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-500 transition-colors">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Login;
