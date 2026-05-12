import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { CreditCard } from 'lucide-react';

const Revenue = () => {
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
        setRevenue(response.data?.payments || response.data?.data?.payments || []);
        setTotalRevenue(response.data?.total || response.data?.data?.total || 0);
      } catch (error) {
        console.error('Error fetching revenue:', error);
        console.error('Error response:', error.response?.data);
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
                  {!Array.isArray(revenue) || revenue.length === 0 ? (
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

export default Revenue;
