import React from 'react';
import { Lock, AlertTriangle, Mail } from 'lucide-react';

const LockedOverlay = ({ message = "Access Denied: Please contact support to renew your subscription." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <Lock size={48} className="text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        {/* Warning Details */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle size={20} className="text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-1">Subscription Required</h3>
              <p className="text-xs text-amber-700">
                Your subscription has expired or is inactive. Please renew your subscription to regain access to the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
            Renew Subscription
          </button>
          
          <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <Mail size={16} className="mr-2" />
            Contact Support
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            If you believe this is an error, please contact our support team with your account details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockedOverlay;
