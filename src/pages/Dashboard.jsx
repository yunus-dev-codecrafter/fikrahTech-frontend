import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
  Menu, X, LayoutDashboard, School, Calendar, CreditCard, LogOut, 
  Bell, User, Home, Settings, Users, TrendingUp, Clock, AlertCircle,
  Edit, Ban, Trash2, Lock
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
  
  // Modal states
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolFormLoading, setSchoolFormLoading] = useState(false);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    email: '',
    password: 'ChangeMe@2026',
    current_session: '2026/2027',
    current_term: 'First Term'
  });
  
  // Toast notification state
  const [toast, setToast] = useState(null);

  const handleLogout = () => {
    console.log('Logging out - clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for stats:', token);
      const response = await axiosInstance.get('/admin/stats');
      console.log('Stats response:', response.data);
      console.log('Stats received:', response.data.stats);
      // Set stats with fallbacks for undefined values - accessing nested stats object
      setStats({
        totalSchools: response.data?.stats?.totalSchools || 0,
        totalRevenue: response.data?.stats?.totalRevenue || 0,
        totalStudents: response.data?.stats?.totalStudents || 0,
        pendingRequests: response.data?.stats?.pendingRequests || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error response:', error.response?.data);
      // Keep default values if API fails
      setStats({
        totalSchools: 0,
        totalRevenue: 0,
        totalStudents: 0,
        pendingRequests: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle school registration
  const handleSchoolRegistration = async (e) => {
    e.preventDefault();
    setSchoolFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for school registration:', token);
      console.log('Sending data:', { 
        name: schoolForm.name, 
        email: schoolForm.email, 
        password: schoolForm.password 
      });
      const response = await axiosInstance.post('/admin/schools', schoolForm);
      console.log('School registration response:', response.data);
      showToast('School registered successfully!', 'success');
      setShowSchoolModal(false);
      setSchoolForm({
        name: '',
        email: '',
        password: 'ChangeMe@2026',
        current_session: '2026/2027',
        current_term: 'First Term'
      });
      // Refresh stats to show new school count
      fetchStats();
    } catch (error) {
      console.error('Error registering school:', error);
      console.error('Error response:', error.response?.data);
      showToast(error.response?.data?.message || 'Failed to register school', 'error');
    } finally {
      setSchoolFormLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
    { id: 'schools', label: 'School Management', icon: School, path: '/dashboard/schools' },
    { id: 'sessions', label: 'Session Monitor', icon: Calendar, path: '/dashboard/sessions' },
    { id: 'revenue', label: 'Revenue Reports', icon: CreditCard, path: '/dashboard/revenue' },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard, path: '/dashboard/subscriptions' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent stats={stats} statsLoading={statsLoading} setShowSchoolModal={setShowSchoolModal} />;
      case 'schools':
        return <SchoolsContent />;
      case 'sessions':
        return <SessionsContent />;
      case 'revenue':
        return <RevenueContent />;
      case 'subscriptions':
        return <SubscriptionsContent />;
      default:
        return <OverviewContent stats={stats} statsLoading={statsLoading} setShowSchoolModal={setShowSchoolModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
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
                    </Link>
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

      {/* School Registration Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Register New School</h3>
                <button
                  onClick={() => setShowSchoolModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSchoolRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolForm.name}
                    onChange={(e) => setSchoolForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proprietor Email
                  </label>
                  <input
                    type="email"
                    required
                    value={schoolForm.email}
                    onChange={(e) => setSchoolForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter proprietor email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Password
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolForm.password}
                    onChange={(e) => setSchoolForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter default password for proprietor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Initial Session
                  </label>
                  <select
                    value={schoolForm.current_session}
                    onChange={(e) => setSchoolForm(prev => ({ ...prev, current_session: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                    <option value="2027/2028">2027/2028</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Initial Term
                  </label>
                  <select
                    value={schoolForm.current_term}
                    onChange={(e) => setSchoolForm(prev => ({ ...prev, current_term: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="First Term">First Term</option>
                    <option value="Second Term">Second Term</option>
                    <option value="Third Term">Third Term</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSchoolModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={schoolFormLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {schoolFormLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      'Register School'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Overview Content Component
const OverviewContent = ({ stats, statsLoading, setShowSchoolModal }) => (
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
        <button 
          onClick={() => setShowSchoolModal(true)}
          className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-slate-900">Add New School</h4>
          <p className="text-sm text-slate-600">Register a new school on the platform</p>
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
const SchoolsContent = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for schools:', token);
      const response = await axiosInstance.get('/admin/schools');
      console.log('Schools response:', response.data);
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      console.error('Error response:', error.response?.data);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleBlockToggle = async (schoolId, currentStatus) => {
    try {
      const response = await axiosInstance.patch(`/admin/schools/${schoolId}/block`, {
        is_blocked: !currentStatus
      });
      console.log('Block toggle response:', response.data);
      // Refresh the list
      fetchSchools();
    } catch (error) {
      console.error('Error toggling block status:', error);
      alert(error.response?.data?.message || 'Failed to update school status');
    }
  };

  const handleDelete = async (schoolId) => {
    if (!window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await axiosInstance.delete(`/admin/schools/${schoolId}`);
      console.log('Delete response:', response.data);
      // Refresh the list
      fetchSchools();
    } catch (error) {
      console.error('Error deleting school:', error);
      alert(error.response?.data?.message || 'Failed to delete school');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">School Management</h1>
        <p className="text-slate-600 mt-2">Manage all registered schools and their staff accounts</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Registered Schools</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-900">School Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Proprietor Email</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500">
                        No schools found
                      </td>
                    </tr>
                  ) : (
                    schools.map((school) => (
                      <tr key={school.id} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-900 font-medium">{school.name}</td>
                        <td className="py-3 px-4 text-slate-900">{school.proprietor_email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            school.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {school.is_blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/admin/schools/${school.id}`)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit School"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleBlockToggle(school.id, school.is_blocked)}
                              className={`p-2 rounded-lg transition-colors ${
                                school.is_blocked 
                                  ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                              }`}
                              title={school.is_blocked ? 'Unblock School' : 'Block School'}
                            >
                              {school.is_blocked ? <Lock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(school.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete School"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

// Sessions Content Component
const SessionsContent = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token being sent for sessions:', token);
        const response = await axiosInstance.get('/admin/sessions');
        console.log('Sessions response:', response.data);
        setSessions(response.data || []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        console.error('Error response:', error.response?.data);
        // Set empty array on error to prevent crashes
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Session Monitor</h1>
        <p className="text-slate-600 mt-2">Monitor academic sessions and terms across all schools</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">School Academic Sessions</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-900">School Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Current Session</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Current Term</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500">
                        No schools found or no session data available
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr key={session.school_id} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-900">{session.school_name}</td>
                        <td className="py-3 px-4 text-slate-900">
                          {session.current_session || 'Not Set'}
                        </td>
                        <td className="py-3 px-4 text-slate-900">
                          {session.current_term || 'Not Set'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Revenue Content Component
const RevenueContent = () => {
  const [revenue, setRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token being sent for revenue:', token);
        const response = await axiosInstance.get('/admin/revenue');
        console.log('Revenue response:', response.data);
        setRevenue(response.data?.payments || []);
        setTotalRevenue(response.data?.total || 0);
      } catch (error) {
        console.error('Error fetching revenue:', error);
        console.error('Error response:', error.response?.data);
        // Set default values on error to prevent crashes
        setRevenue([]);
        setTotalRevenue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Revenue Reports</h1>
        <p className="text-slate-600 mt-2">View financial analytics and payment history</p>
      </div>
      
      {/* Total Revenue Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? '...' : `NGN ${totalRevenue.toLocaleString()}`}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Revenue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment History</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-900">School</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    revenue.map((payment) => (
                      <tr key={payment.id} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-900">{payment.schoolName}</td>
                        <td className="py-3 px-4 text-slate-900">NGN {payment.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-900">{new Date(payment.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Subscriptions Content Component
const SubscriptionsContent = () => {
  const [plans, setPlans] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolSubscriptions, setSchoolSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    duration_months: '',
    max_students: '',
    features: ''
  });
  const [subscriptionForm, setSubscriptionForm] = useState({
    school_id: '',
    plan_id: '',
    start_date: new Date().toISOString().split('T')[0]
  });

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for plans:', token);
      const response = await axiosInstance.get('/admin/plans');
      console.log('Plans response:', response.data);
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      console.error('Error response:', error.response?.data);
      setPlans([]);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axiosInstance.get('/admin/schools');
      console.log('Schools response:', response.data);
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchools([]);
    }
  };

  const fetchSchoolSubscriptions = async () => {
    try {
      const response = await axiosInstance.get('/admin/school-subscriptions');
      console.log('School subscriptions response:', response.data);
      setSchoolSubscriptions(response.data || []);
    } catch (error) {
      console.error('Error fetching school subscriptions:', error);
      setSchoolSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchPlans(), fetchSchools(), fetchSchoolSubscriptions()]);
    };
    fetchData();
  }, []);

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for plan creation:', token);
      
      const featuresArray = planForm.features.split('\n').filter(f => f.trim());
      
      const response = await axiosInstance.post('/admin/plans', {
        name: planForm.name,
        price: parseFloat(planForm.price),
        duration_months: parseInt(planForm.duration_months),
        max_students: parseInt(planForm.max_students),
        features: featuresArray
      });
      
      console.log('Plan creation response:', response.data);
      
      await fetchPlans();
      
      setPlanForm({
        name: '',
        price: '',
        duration_months: '',
        max_students: '',
        features: ''
      });
      
      setShowPlanModal(false);
    } catch (error) {
      console.error('Error creating plan:', error);
      alert(error.response?.data?.message || 'Failed to create plan');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const selectedPlan = plans.find(p => p.id === parseInt(subscriptionForm.plan_id));
      const startDate = new Date(subscriptionForm.start_date);
      const expiryDate = new Date(startDate);
      expiryDate.setMonth(expiryDate.getMonth() + selectedPlan.duration_months);

      const response = await axiosInstance.post('/admin/school-subscriptions', {
        school_id: parseInt(subscriptionForm.school_id),
        plan_id: parseInt(subscriptionForm.plan_id),
        start_date: subscriptionForm.start_date,
        expiry_date: expiryDate.toISOString().split('T')[0]
      });
      
      console.log('Subscription creation response:', response.data);
      
      await fetchSchoolSubscriptions();
      
      setSubscriptionForm({
        school_id: '',
        plan_id: '',
        start_date: new Date().toISOString().split('T')[0]
      });
      
      setShowSubscriptionModal(false);
      alert('Subscription assigned successfully!');
    } catch (error) {
      console.error('Error assigning subscription:', error);
      alert(error.response?.data?.message || 'Failed to assign subscription');
    } finally {
      setFormLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  const renderFeatures = (features) => {
    let featuresArray;
    try {
      if (typeof features === 'string') {
        featuresArray = JSON.parse(features);
      } else {
        featuresArray = features;
      }
    } catch (e) {
      featuresArray = [features];
    }

    if (!Array.isArray(featuresArray)) {
      return <span className="text-slate-500">{features}</span>;
    }

    return (
      <ul className="list-disc list-inside text-sm text-slate-600">
        {featuresArray.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    );
  };

  const getSubscriptionStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry <= 30) {
      return { text: `Expiring in ${daysUntilExpiry} days`, color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Active', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Management Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-slate-600 mt-2">Define and manage subscription plans for schools</p>
        </div>
        <button
          onClick={() => setShowPlanModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Plan
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Plans</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Plan Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Price (NGN)</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Max Students</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Features</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-500">
                        No subscription plans found
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan) => (
                      <tr key={plan.id} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-900 font-medium">{plan.name}</td>
                        <td className="py-3 px-4 text-slate-900">NGN {formatPrice(plan.price)}</td>
                        <td className="py-3 px-4 text-slate-900">{plan.duration_months} months</td>
                        <td className="py-3 px-4 text-slate-900">{plan.max_students}</td>
                        <td className="py-3 px-4">{renderFeatures(plan.features)}</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* School Subscriptions Section */}
      <div className="mt-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">School Subscriptions</h2>
            <p className="text-slate-600 mt-2">Assign and manage school subscriptions</p>
          </div>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Assign Subscription
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Subscriptions</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-900">School</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Expiry Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolSubscriptions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-500">
                          No school subscriptions found
                        </td>
                      </tr>
                    ) : (
                      schoolSubscriptions.map((sub) => {
                        const school = schools.find(s => s.id === sub.school_id);
                        const plan = plans.find(p => p.id === sub.plan_id);
                        const status = getSubscriptionStatus(sub.expiry_date);
                        
                        return (
                          <tr key={sub.id} className="border-b border-slate-100">
                            <td className="py-3 px-4 text-slate-900 font-medium">{school?.name || 'Unknown'}</td>
                            <td className="py-3 px-4 text-slate-900">{plan?.name || 'Unknown'}</td>
                            <td className="py-3 px-4 text-slate-900">{new Date(sub.start_date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-slate-900">{new Date(sub.expiry_date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                {status.text}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
                                Renew
                              </button>
                              <button className="text-red-600 hover:text-red-800 text-sm">
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Create New Plan</h3>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePlanSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Basic Plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price (NGN)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={planForm.price}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={planForm.duration_months}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, duration_months: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={planForm.max_students}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, max_students: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    required
                    value={planForm.features}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, features: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Student management&#10;Fee collection&#10;Report generation"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Plan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Assign Subscription</h3>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select School
                  </label>
                  <select
                    required
                    value={subscriptionForm.school_id}
                    onChange={(e) => setSubscriptionForm(prev => ({ ...prev, school_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a school</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Plan
                  </label>
                  <select
                    required
                    value={subscriptionForm.plan_id}
                    onChange={(e) => setSubscriptionForm(prev => ({ ...prev, plan_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - NGN {formatPrice(plan.price)} ({plan.duration_months} months)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={subscriptionForm.start_date}
                    onChange={(e) => setSubscriptionForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubscriptionModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Assigning...
                      </span>
                    ) : (
                      'Assign Subscription'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
