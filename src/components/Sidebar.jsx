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
