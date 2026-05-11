import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { School, CreditCard, Users, TrendingUp, AlertCircle } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalRevenue: 0,
    totalStudents: 0,
    pendingRequests: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolFormLoading, setSchoolFormLoading] = useState(false);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    email: '',
    password: 'ChangeMe@2026',
    current_session: '2026/2027',
    current_term: 'First Term'
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for stats:', token);
      const response = await axiosInstance.get('/admin/stats');
      console.log('Stats response:', response.data);
      console.log('Stats received:', response.data?.stats);
      setStats({
        totalSchools: response.data?.data?.stats?.totalSchools || response.data?.stats?.totalSchools || 0,
        totalRevenue: response.data?.data?.stats?.totalRevenue || response.data?.stats?.totalRevenue || 0,
        totalStudents: response.data?.data?.stats?.totalStudents || response.data?.stats?.totalStudents || 0,
        pendingRequests: response.data?.data?.stats?.pendingRequests || response.data?.stats?.pendingRequests || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error response:', error.response?.data);
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
      fetchStats();
    } catch (error) {
      console.error('Error registering school:', error);
      console.error('Error response:', error.response?.data);
      showToast(error.response?.data?.message || 'Failed to register school', 'error');
    } finally {
      setSchoolFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
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
      )}

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
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {statsLoading ? '...' : stats.totalSchools}
              </p>
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
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {statsLoading ? '...' : `NGN ${stats.totalRevenue.toLocaleString()}`}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {statsLoading ? '...' : stats.totalStudents.toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {statsLoading ? '...' : stats.pendingRequests}
              </p>
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

      {/* School Registration Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Register New School</h3>
                <button
                  onClick={() => setShowSchoolModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSchoolRegistration} className="p-6 space-y-4">
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {schoolFormLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : 'Register School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
