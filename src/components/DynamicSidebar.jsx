import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  Settings, 
  BookOpen,
  Users2,
  CreditCard,
  Calendar,
  BarChart3,
  FileText,
  Shield,
  Database
} from 'lucide-react';

const DynamicSidebar = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'dashboard';
    if (path.includes('/admin/schools')) return 'schools';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/proprietor/dashboard')) return 'dashboard';
    if (path.includes('/proprietor/schools')) return 'schools';
    if (path.includes('/proprietor/students')) return 'students';
    if (path.includes('/proprietor/staff')) return 'staff';
    if (path.includes('/proprietor/subscription')) return 'subscription';
    if (path.includes('/proprietor/terms')) return 'terms';
    return 'dashboard';
  };

  const getSuperAdminMenuItems = () => [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard', active: getCurrentPage() === 'dashboard' },
    { icon: Building2, label: 'Schools', href: '/admin/schools', active: getCurrentPage() === 'schools' },
    { icon: Users, label: 'Users', href: '/admin/users', active: getCurrentPage() === 'users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', active: getCurrentPage() === 'settings' },
    { icon: Shield, label: 'System Logs', href: '/admin/logs', active: getCurrentPage() === 'logs' },
    { icon: Database, label: 'Database', href: '/admin/database', active: getCurrentPage() === 'database' },
  ];

  const getProprietorMenuItems = () => [
    { icon: Home, label: 'Dashboard', href: '/proprietor/dashboard', active: getCurrentPage() === 'dashboard' },
    { icon: Building2, label: 'My School', href: '/proprietor/schools', active: getCurrentPage() === 'schools' },
    { icon: Users2, label: 'Staff', href: '/proprietor/staff', active: getCurrentPage() === 'staff' },
    { icon: BookOpen, label: 'Students', href: '/proprietor/students', active: getCurrentPage() === 'students' },
    { icon: CreditCard, label: 'Subscription', href: '/proprietor/subscription', active: getCurrentPage() === 'subscription' },
    { icon: Calendar, label: 'Term Settings', href: '/proprietor/terms', active: getCurrentPage() === 'terms' },
    { icon: Settings, label: 'Settings', href: '/proprietor/settings', active: getCurrentPage() === 'settings' },
  ];

  const getStaffMenuItems = () => [
    { icon: Home, label: 'Dashboard', href: '/staff/dashboard', active: getCurrentPage() === 'dashboard' },
    { icon: Users, label: 'My Profile', href: '/staff/profile', active: getCurrentPage() === 'profile' },
    { icon: Settings, label: 'Settings', href: '/staff/settings', active: getCurrentPage() === 'settings' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'super_admin':
        return getSuperAdminMenuItems();
      case 'proprietor':
        return getProprietorMenuItems();
      case 'staff':
      case 'parent':
        return getStaffMenuItems();
      default:
        return getSuperAdminMenuItems();
    }
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
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {getMenuItems().map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
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
                </Link>
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
                  <Users size={20} />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-slate-200">
                    {userRole === 'super_admin' ? 'Super Admin' : 
                     userRole === 'proprietor' ? 'Proprietor' : 
                     userRole === 'staff' ? 'Staff' : 
                     userRole === 'parent' ? 'Parent' : 'User'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {userRole === 'super_admin' ? 'admin@fikrahtech.com' : 
                     userRole === 'proprietor' ? 'proprietor@fikrahtech.com' : 
                     userRole === 'staff' ? 'staff@fikrahtech.com' : 
                     userRole === 'parent' ? 'parent@fikrahtech.com' : 
                     'user@fikrahtech.com'}
                  </p>
                </div>
                <BarChart3 
                  size={16} 
                  className={`text-slate-400 transition-transform ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-premium border border-slate-200">
                  <Link
                    to="/admin/profile"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Users size={16} className="mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h14a2 2 2 0 1-2h-4a2 2 0 1 2H5a2 2 0 1 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l4 4L2 12m0 0l-4 4m0 6H4a2 2 0 1 2z" />
                    </svg>
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

export default DynamicSidebar;
