import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building2, Users, Settings, LogOut } from 'lucide-react';
import Sidebar from '../components/DynamicSidebar';
import TopNav from '../components/TopNav';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

  const getCurrentPage = () => {
    const path = window.location.pathname;
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
    if (path.includes('/proprietor/settings')) return 'settings';
    return 'dashboard';
  };
  }, []);

  // Fetch dashboard stats from API
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalUsers: 0,
    totalStudents: 0,
    totalRevenue: 0,
    systemHealth: 'operational'
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log('Fetching dashboard stats from API...');
        const response = await axiosInstance.get('/admin/stats');
        console.log('Dashboard stats fetched successfully:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        currentPage={getCurrentPage()}
        userRole={user.role} 
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation - Desktop Only */}
        <div className="hidden lg:block">
          <TopNav 
            onMenuClick={toggleSidebar}
            currentPage={getCurrentPage()}
            currentSession={stats.currentSession || '2023/24'}
            currentTerm={stats.currentTerm || '1st Term'}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-lg bg-white bg-opacity-95 backdrop-blur-md shadow-premium"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
