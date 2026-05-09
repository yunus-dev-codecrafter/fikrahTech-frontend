import React from 'react';
import { Building2, Users, TrendingUp, Activity } from 'lucide-react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const Dashboard = () => {
  const StatCard = ({ icon: Icon, title, value, change, color = 'primary', loading = false }) => (
    <div className="bg-white rounded-xl shadow-premium p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
            <Icon size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {loading ? <LoadingSkeleton type="text" className="w-16 h-8" /> : value}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{title}</p>
          </div>
        </div>
        <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
          change > 0 ? 'bg-emerald-100 text-emerald-700' : 
          change < 0 ? 'bg-red-100 text-red-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {change > 0 ? '+' : ''}
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back to FikrahTech Admin Panel</p>
      </div>

      {/* Bento Grid - 4 Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          title="Total Schools"
          value="24"
          change={12}
          color="primary"
          loading={true}
        />
        
        <StatCard
          icon={Users}
          title="Active Users"
          value="1,428"
          change={8}
          color="primary"
          loading={true}
        />
        
        <StatCard
          icon={TrendingUp}
          title="Revenue"
          value="$48,392"
          change={23}
          color="primary"
          loading={true}
        />
        
        <StatCard
          icon={Activity}
          title="System Status"
          value="Operational"
          change={0}
          color="primary"
          loading={true}
        />
      </div>

      {/* Placeholder for Future Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-premium p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <LoadingSkeleton type="avatar" className="w-10 h-10" />
                <div className="flex-1">
                  <LoadingSkeleton type="text" className="w-32 h-4 mb-2" />
                  <LoadingSkeleton type="text" className="w-48 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-premium p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <LoadingSkeleton className="w-full h-12" />
            <LoadingSkeleton className="w-full h-12" />
            <LoadingSkeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;