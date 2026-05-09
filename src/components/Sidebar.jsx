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

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Frosted Glass Background */}
        <div className="h-full bg-white bg-opacity-10 backdrop-blur-md border-r border-white border-opacity-20">
          {/* Logo Section */}
          <div className="p-6 border-b border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">FikrahTech</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.active 
                      ? 'bg-emerald-500 text-white border-l-4 border-emerald-300' 
                      : 'text-white hover:bg-white hover:bg-opacity-10 hover:border-l-4 hover:border-emerald-500'
                    }
                  `}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-6 border-t border-white border-opacity-20">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  <User size={20} />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-white text-opacity-70">admin@fikrahtech.com</p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-white transition-transform ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-premium">
                  <a
                    href="/admin/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User size={16} className="mr-3" />
                    Profile
                  </a>
                  <button
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
    </>
  );
};

export default Sidebar;
