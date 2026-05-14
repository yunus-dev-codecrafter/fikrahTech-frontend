import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { ArrowLeft, School, Mail, Shield, Calendar, CreditCard } from 'lucide-react';

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolDetail = async () => {
      try {
        const response = await axiosInstance.get(`/admin/schools/${id}`);
        setSchool(response.data?.school || response.data);
      } catch (error) {
        console.error('Error fetching school details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 text-blue-600 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">School not found</p>
        <button 
          onClick={() => navigate('/dashboard/schools')}
          className="mt-4 text-blue-600 hover:underline flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schools
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard/schools')}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Schools</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <School className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{school.name}</h1>
              <p className="text-slate-500">School ID: {school.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">General Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">Proprietor Email</p>
                  <p className="text-slate-900">{school.proprietor_email || school.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-600">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    school.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {school.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-600">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase">Registered On</p>
                  <p className="text-slate-900">{new Date(school.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Subscription Status</h3>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-900">Current Plan</span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                  {school.subscription_plan || 'No Active Plan'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="text-slate-900 font-medium">
                    {school.subscription_expiry ? new Date(school.subscription_expiry).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status:</span>
                  <span className={`font-medium ${
                    school.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(school.status || 'Inactive').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetail;
