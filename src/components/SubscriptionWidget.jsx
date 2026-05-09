import React from 'react';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const SubscriptionWidget = ({ 
  status = 'active', 
  expiryDate, 
  daysRemaining = 0,
  totalDays = 365 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'expiring':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="mr-2" />;
      case 'expiring':
      case 'expired':
        return <AlertCircle size={16} className="mr-2" />;
      default:
        return <Calendar size={16} className="mr-2" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const progressPercentage = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));
  const progressColor = status === 'expired' ? 'bg-red-500' : 
                       status === 'expiring' ? 'bg-amber-500' : 
                       'bg-emerald-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-semibold">
            {getStatusText()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Expires</p>
          <p className="text-sm font-semibold text-slate-900">
            {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Days Remaining */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Days Remaining</span>
          <span className={`text-2xl font-bold ${
            status === 'expired' ? 'text-red-600' : 
            status === 'expiring' ? 'text-amber-600' : 
            'text-emerald-600'
          }`}>
            {status === 'expired' ? 0 : daysRemaining}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subscription Progress</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Warning Message */}
      {status === 'expiring' && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <AlertCircle size={14} className="inline mr-2" />
            Your subscription expires soon. Please renew to avoid interruption.
          </p>
        </div>
      )}

      {status === 'expired' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <AlertCircle size={14} className="inline mr-2" />
            Your subscription has expired. Please contact support to renew.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionWidget;
