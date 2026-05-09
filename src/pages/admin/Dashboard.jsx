import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  Activity, 
  Clock, 
  Users, 
  TrendingUp,
  Plus,
  Settings,
  FileText
} from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import SubscriptionWidget from '../../components/SubscriptionWidget';
import LockedOverlay from '../../components/LockedOverlay';
import axiosInstance from '../../api/axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [metrics, setMetrics] = useState({
    totalSchools: 0,
    activeSubscriptions: 0,
    systemHealth: 'operational',
    pendingRequests: 0
  });
  const [subscription, setSubscription] = useState({
    status: 'active',
    expiryDate: null,
    daysRemaining: 0,
    totalDays: 365,
    currentSession: '2023/24',
    currentTerm: '1st Term'
  });

  useEffect(() => {
    // Fetch subscription data from API
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/api/schools/profile');
        const data = response.data;
        
        // Update metrics
        setMetrics({
          totalSchools: data.totalSchools || 156,
          activeSubscriptions: data.activeSubscriptions || 89,
          systemHealth: data.systemHealth || 'operational',
          pendingRequests: data.pendingRequests || 12
        });

        // Update subscription info
        if (data.subscription) {
          const expiryDate = new Date(data.subscription.expiryDate);
          const today = new Date();
          const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          
          let status = 'active';
          if (daysRemaining <= 0) {
            status = 'expired';
          } else if (daysRemaining <= 30) {
            status = 'expiring';
          }

          setSubscription({
            status,
            expiryDate: data.subscription.expiryDate,
            daysRemaining: Math.max(0, daysRemaining),
            totalDays: data.subscription.totalDays || 365,
            currentSession: data.currentSession || '2023/24',
            currentTerm: data.currentTerm || '1st Term'
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        
        // Handle 403 - Subscription Expired
        if (error.response?.status === 403) {
          setLocked(true);
        }
        
        // Fallback data
        setMetrics({
          totalSchools: 156,
          activeSubscriptions: 89,
          systemHealth: 'operational',
          pendingRequests: 12
        });
        
        setSubscription({
          status: 'active',
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemaining: 90,
          totalDays: 365,
          currentSession: '2023/24',
          currentTerm: '1st Term'
        });
        
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    color, 
    loading = false 
  }) => {
    const colorClasses = {
      emerald: 'from-emerald-50 to-emerald-100 text-emerald-600',
      blue: 'from-blue-50 to-blue-100 text-blue-600',
      purple: 'from-purple-50 to-purple-100 text-purple-600',
      amber: 'from-amber-50 to-amber-100 text-amber-600'
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? (
                  <div className="animate-pulse bg-slate-200 rounded w-16 h-8" />
                ) : (
                  value
                )}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{title}</p>
            </div>
          </div>
          {change && (
            <div className={`text-sm font-semibold px-3 py-1 rounded-full ${change > 0 ? 'bg-emerald-100 text-emerald-700' : change < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
              {change > 0 ? '+' : ''}
              {Math.abs(change)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Locked Overlay for Expired Subscription */}
      {locked && (
        <LockedOverlay 
          message="Access Denied: Please contact support to renew your subscription." 
        />
      )}

      {!locked && (
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
            <p className="text-slate-600">Welcome back to FikrahTech Admin Panel</p>
          </div>

          {/* Subscription Status Widget */}
          <div className="mb-8">
            <SubscriptionWidget
              status={subscription.status}
              expiryDate={subscription.expiryDate}
              daysRemaining={subscription.daysRemaining}
              totalDays={subscription.totalDays}
            />
          </div>

          {/* Bento Grid - 4 Premium Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Building2}
          title="Total Schools"
          value={metrics.totalSchools.toLocaleString()}
          change={12}
          color="emerald"
          loading={loading}
        />
        
        <MetricCard
          icon={CreditCard}
          title="Active Subscriptions"
          value={metrics.activeSubscriptions}
          change={8}
          color="blue"
          loading={loading}
        />
        
        <MetricCard
          icon={Activity}
          title="System Health"
          value={metrics.systemHealth}
          change={0}
          color="purple"
          loading={loading}
        />
        
        <MetricCard
          icon={Clock}
          title="Pending Requests"
          value={metrics.pendingRequests}
          change={-3}
          color="amber"
          loading={loading}
        />
      </div>

      {/* Asymmetrical Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Wider Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              // Loading Skeletons
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="animate-pulse bg-slate-200 rounded-full w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <div className="animate-pulse bg-slate-200 rounded w-32 h-4" />
                    <div className="animate-pulse bg-slate-200 rounded w-48 h-3" />
                  </div>
                </div>
              ))
            ) : (
              // Real Content (placeholder)
              [
                { icon: Building2, title: 'New School Registered', desc: 'Greenwood Academy added', time: '2 min ago' },
                { icon: Users, title: 'User Activity Spike', desc: '42 new registrations', time: '1 hour ago' },
                { icon: CreditCard, title: 'Subscription Renewed', desc: 'Premium plan renewed', time: '3 hours ago' },
                { icon: Activity, title: 'System Update', desc: 'Performance improved 23%', time: '5 hours ago' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <item.icon size={16} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions - Narrower Panel */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {loading ? (
              // Loading Skeletons
              [1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse bg-slate-200 rounded-lg h-12" />
              ))
            ) : (
              // Real Actions
              [
                { icon: Plus, label: 'Add New School', color: 'emerald' },
                { icon: Users, label: 'Manage Users', color: 'blue' },
                { icon: Settings, label: 'System Settings', color: 'purple' },
                { icon: FileText, label: 'Generate Reports', color: 'amber' }
              ].map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors text-left hover:text-emerald-600"
                >
                  <action.icon size={18} className="mr-3 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;