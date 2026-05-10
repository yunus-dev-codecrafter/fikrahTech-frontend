import React, { useState } from 'react';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';

const TopNav = ({ onMenuClick, currentPage, currentSession, currentTerm }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear localStorage and cookies
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'schools':
        return 'Schools Management';
      case 'users':
        return 'Users Management';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

          {/* Page Title and Session Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            {/* Session/Term Display */}
            {(currentSession || currentTerm) && (
              <p className="text-sm text-slate-600 mt-1">
                Session: {currentSession || '2023/24'} | {currentTerm || '1st Term'}
              </p>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                <User size={16} />
              </div>
              <ChevronDown 
                size={16} 
                className={`ml-2 text-gray-600 transition-transform ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-premium border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@fikrahtech.com</p>
                </div>
                <a
                  href="/admin/profile"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
