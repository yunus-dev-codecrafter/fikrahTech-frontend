import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">FikrahTech</h2>
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        <Link
          to="/admin/dashboard"
          className={`block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
            isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
          }`}
        >
          Dashboard
        </Link>
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
