import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
  Menu, X, LayoutDashboard, School, Calendar, CreditCard, LogOut, 
  Bell, User, Home, Settings, Users, TrendingUp, Clock, AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalRevenue: 0,
    totalStudents: 0,
    pendingRequests: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values if API fails
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'schools', label: 'School Management', icon: School },
    { id: 'academic', label: 'Academic Control', icon: Calendar },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent stats={stats} statsLoading={statsLoading} />;
      case 'schools':
        return <SchoolsContent />;
      case 'academic':
        return <AcademicContent />;
      case 'subscriptions':
        return <SubscriptionsContent />;
      default:
        return <OverviewContent stats={stats} statsLoading={statsLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <School className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">FikrahTech</h1>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                        ${activeSection === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  FikrahTech Super Admin
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">Super Admin</p>
                    <p className="text-xs text-slate-500">admin@fikrahtech.com</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent = ({ stats, statsLoading }) => (
  <div className="space-y-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
      <p className="text-slate-600 mt-2">Monitor your multi-tenant school management platform</p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Schools</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {statsLoading ? '...' : stats.totalSchools.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <School className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {statsLoading ? '...' : `NGN ${stats.totalRevenue.toLocaleString()}`}
            </p>
            <p className="text-sm text-green-600 mt-2">+8% from last month</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Students</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {statsLoading ? '...' : stats.totalStudents.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-2">+5% from last month</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Pending Requests</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {statsLoading ? '...' : stats.pendingRequests.toLocaleString()}
            </p>
            <p className="text-sm text-orange-600 mt-2">Requires attention</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-slate-900">Approve Schools</h4>
          <p className="text-sm text-slate-600">Review pending school registrations</p>
        </button>
        <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <Settings className="w-6 h-6 text-purple-600 mb-2" />
          <h4 className="font-medium text-slate-900">System Settings</h4>
          <p className="text-sm text-slate-600">Configure platform settings</p>
        </button>
        <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
          <CreditCard className="w-6 h-6 text-green-600 mb-2" />
          <h4 className="font-medium text-slate-900">Revenue Reports</h4>
          <p className="text-sm text-slate-600">View financial analytics</p>
        </button>
      </div>
    </div>
  </div>
);

// Schools Content Component
const SchoolsContent = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">School Management</h1>
      <p className="text-slate-600 mt-2">Manage all registered schools and their staff accounts</p>
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <p className="text-slate-600">School management interface will be implemented here.</p>
      <p className="text-sm text-slate-500 mt-2">Features: View schools, search, filter, password reset for staff</p>
    </div>
  </div>
);

// Academic Content Component
const AcademicContent = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">Academic Control</h1>
      <p className="text-slate-600 mt-2">Set global academic session and term for the platform</p>
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <p className="text-slate-600">Academic control interface will be implemented here.</p>
      <p className="text-sm text-slate-500 mt-2">Features: Set session, set term, academic calendar management</p>
    </div>
  </div>
);

// Subscriptions Content Component
const SubscriptionsContent = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
      <p className="text-slate-600 mt-2">Define and manage subscription plans for schools</p>
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <p className="text-slate-600">Subscription management interface will be implemented here.</p>
      <p className="text-sm text-slate-500 mt-2">Features: Create plans, set pricing, manage subscriptions</p>
    </div>
  </div>
);

export default Dashboard;
