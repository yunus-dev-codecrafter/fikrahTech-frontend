// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, PlusCircle, Activity } from 'lucide-react';
import axiosInstance from '../../api/axios';
import RegisterSchoolModal from '../../components/RegisterSchoolModal';
import Toast from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeUsers: 0,
    recentActivity: 0,
    systemHealth: 'operational'
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    // Simulate fetching dashboard stats
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // Mock data for now - replace with actual API calls
        setTimeout(() => {
          setStats({
            totalSchools: 24,
            activeUsers: 142,
            recentActivity: 89,
            systemHealth: 'operational'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleSchoolRegistered = (newSchool) => {
    setStats(prev => ({
      ...prev,
      totalSchools: prev.totalSchools + 1
    }));
    
    setToastMessage(`School "${newSchool.schoolName}" registered successfully!`);
    setToastType('success');
    setShowToast(true);
  };

  const StatCard = ({ icon: Icon, title, value, change, color = 'primary' }) => (
    <div className="card p-6 animate-slide-up gpu-accelerated">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-surface-100">
            <Icon size={24} className={`text-${color}-600`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-900">{value}</h3>
            <p className="text-sm text-surface-600">{title}</p>
          </div>
        </div>
        <div className={`text-sm font-medium ${
          change > 0 ? 'text-accent-500' : 'text-surface-600'
        }`}>
          {change > 0 ? '+' : ''}
          {Math.abs(change)}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ icon: Icon, title, description, time }) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-surface-100 rounded-lg transition-colors">
      <div className="p-2 rounded-full bg-surface-200">
        <Icon size={16} className="text-surface-700" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-surface-900">{title}</h4>
        <p className="text-xs text-surface-600">{description}</p>
        <p className="text-xs text-surface-500">{time}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Dashboard Overview</h1>
        <p className="text-surface-600">Welcome back to FikrahTech Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="bento-grid">
        <StatCard
          icon={Building2}
          title="Total Schools"
          value={stats.totalSchools}
          change={2}
          color="primary"
        />
        
        <StatCard
          icon={Users}
          title="Active Users"
          value={stats.activeUsers}
          change={8}
          color="secondary"
        />
        
        <StatCard
          icon={Activity}
          title="Recent Activity"
          value={stats.recentActivity}
          change={-5}
          color="accent"
        />
        
        <StatCard
          icon={TrendingUp}
          title="System Health"
          value={stats.systemHealth}
          change={0}
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6 animate-slide-up gpu-accelerated">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="btn bg-primary-600 hover:bg-primary-700 text-white w-full micro-interact"
          >
            <PlusCircle size={20} className="mr-2" />
            Register New School
          </button>
          
          <button className="btn bg-surface-200 hover:bg-surface-300 text-surface-900 w-full micro-interact">
            <Activity size={20} className="mr-2" />
            View Activity Log
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6 animate-slide-up gpu-accelerated">
        <h2 className="text-xl font-semibold text-surface-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            icon={Building2}
            title="New School Registered"
            description="Greenwood Academy has been added to the system"
            time="2 minutes ago"
          />
          
          <ActivityItem
            icon={Users}
            title="User Login Spike"
            description="42 new user registrations in the last hour"
            time="1 hour ago"
          />
          
          <ActivityItem
            icon={Activity}
            title="System Update Completed"
            description="Database optimization improved performance by 23%"
            time="3 hours ago"
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <LoadingSpinner size="lg" color="text-primary-600" />
            <p className="mt-4 text-center text-surface-600">Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* Register School Modal */}
      <RegisterSchoolModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSchoolRegistered}
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;