import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, Users, Settings, LogOut } from 'lucide-react'; // Import Lucide icons

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-navy-800 text-white shadow-lg flex flex-col"> {/* Deep Navy background */}
      <div className="p-6 border-b border-navy-700">
        <h2 className="text-2xl font-bold text-emerald-400">FikrahTech</h2> {/* Emerald Green for branding */}
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>
      
      <nav className="mt-6">
        <Link
          to="/admin/dashboard"
          className={`flex items-center px-6 py-3 text-white hover:bg-navy-700 hover:text-emerald-300 transition-colors ${
            isActive('/admin/dashboard') ? 'bg-navy-700 text-emerald-300 border-r-4 border-emerald-500' : ''
          }`}
        >
          <Home className="mr-3" size={20} />
          Dashboard
        </Link>
        <Link
          to="/admin/schools" // Placeholder for Schools page
          className={`flex items-center px-6 py-3 text-white hover:bg-navy-700 hover:text-emerald-300 transition-colors ${
            isActive('/admin/schools') ? 'bg-navy-700 text-emerald-300 border-r-4 border-emerald-500' : ''
          }`}
        >
          <Building2 className="mr-3" size={20} />
          Schools
        </Link>
        <Link
          to="/admin/users" // Placeholder for Users page
          className={`flex items-center px-6 py-3 text-white hover:bg-navy-700 hover:text-emerald-300 transition-colors ${
            isActive('/admin/users') ? 'bg-navy-700 text-emerald-300 border-r-4 border-emerald-500' : ''
          }`}
        >
          <Users className="mr-3" size={20} />
          Users
        </Link>
        <Link
          to="/admin/settings" // Placeholder for Settings page
          className={`flex items-center px-6 py-3 text-white hover:bg-navy-700 hover:text-emerald-300 transition-colors ${
            isActive('/admin/settings') ? 'bg-navy-700 text-emerald-300 border-r-4 border-emerald-500' : ''
          }`}
        >
          <Settings className="mr-3" size={20} />
          Settings
        </Link>
      </nav>

      <div className="p-6 border-t border-navy-700">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 bg-navy-700 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
