import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token being sent for sessions:', token);
        const response = await axiosInstance.get('/admin/sessions');
        console.log('Sessions response:', response.data);
        setSessions(response.data?.sessions || response.data?.data || response.data || []);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        console.error('Error response:', error.response?.data);
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
                  {!Array.isArray(sessions) || sessions.length === 0 ? (
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

export default Sessions;
