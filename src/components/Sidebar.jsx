import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPage }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeSidebar = () => {
    onClose();
  };

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

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: currentPage === 'dashboard' },
    { icon: Building2, label: 'Schools', href: '/admin/schools', active: currentPage === 'schools' },
    { icon: Users, label: 'Users', href: '/admin/users', active: currentPage === 'users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', active: currentPage === 'settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Dark Navy Background */}
        <div className="h-full bg-slate-950 border-r border-slate-800">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-emerald-400">FikrahTech</h2>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={20} className="text-slate-400" />
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
                      ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-400' 
                      : 'text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-l-4 hover:border-emerald-400'
                    }
                  `}
                >
                  <item.icon size={20} className="mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-6 border-t border-slate-800">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center p-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-slate-200">Admin User</p>
                  <p className="text-xs text-slate-400">admin@fikrahtech.com</p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform flex-shrink-0 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-premium border border-slate-200">
                  <a
                    href="/admin/profile"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User size={16} className="mr-3 flex-shrink-0" />
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-3 flex-shrink-0" />
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
