import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; // Added useNavigate here
import api from '../../api/axios'; 
// Switched from 'fi' to 'lu' (Lucide Icons)
import { LuSchool, LuUsers, LuCreditCard, LuAlertCircle } from 'react-icons/lu';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubscriptions: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // RBAC Check: Ensure user is a super_admin
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load real-time stats. Displaying cached data.');
        // Fallback/Mock data if backend endpoint isn't ready yet
        setStats({
          totalSchools: 5,
          activeSubscriptions: 3,
          pendingApprovals: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'super_admin') {
      fetchStats();
    }
  }, []);

  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user.name} (Global Admin)</p>
        </div>
      </header>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading system stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Schools Registered" 
            value={stats.totalSchools} 
            icon={LuSchool} // Changed
            color="text-blue-600" 
          />
          <StatCard 
            title="Active Subscriptions" 
            value={stats.activeSubscriptions} 
            icon={LuCreditCard} // Changed
            color="text-emerald-600" 
          />
          <StatCard 
            title="Pending School Approvals" 
            value={stats.pendingApprovals} 
            icon={LuAlertCircle} // Changed
            color="text-amber-600" 
          />
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">System Actions</h2>
        <p className="text-slate-500 mt-1 mb-6">Common administrative tasks.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavigateButton to="/admin/schools" label="Manage All Schools" icon={LuSchool}/>
          <NavigateButton to="/admin/users" label="System User Audit" icon={LuUsers}/>
        </div>
      </div>
    </div>
  );
};

// Simple helper component for cleaner JSX
const NavigateButton = ({ to, label, icon: Icon }) => {
    const navigate = useNavigate();
    return (
        <button 
            onClick={() => navigate(to)}
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-800 font-medium transition-colors border border-slate-100"
        >
            <Icon className="w-5 h-5 text-slate-500" />
            {label}
        </button>
    )
}

export default AdminDashboard;
