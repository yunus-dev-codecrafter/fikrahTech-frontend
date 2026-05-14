import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Edit2, Ban, Unlock, Trash2, Eye, Search } from 'lucide-react';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/schools');
      setSchools(response.data?.schools || response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleToggleBlock = async (schoolId, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this school?`)) {
      try {
        await axiosInstance.patch(`/admin/schools/${schoolId}/toggle-block`);
        fetchSchools(); // Refresh list
      } catch (error) {
        console.error('Error toggling block status:', error);
        alert('Failed to update school status');
      }
    }
  };

  const handleDeleteSchool = async (schoolId, schoolName) => {
    if (window.confirm(`CRITICAL: Are you sure you want to delete "${schoolName}"? This will remove all associated data and cannot be undone.`)) {
      try {
        await axiosInstance.delete(`/admin/schools/${schoolId}`);
        fetchSchools(); // Refresh list
      } catch (error) {
        console.error('Error deleting school:', error);
        alert('Failed to delete school');
      }
    }
  };

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.proprietor_email && school.proprietor_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">School Management</h1>
          <p className="text-slate-600 mt-2">Manage all registered schools and their accounts</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-900">Registered Schools</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 text-blue-600 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="text-left py-4 px-6 font-semibold">School Name</th>
                  <th className="text-left py-4 px-6 font-semibold">Proprietor Email</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchools.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-500">
                      {searchTerm ? 'No schools match your search' : 'No schools found'}
                    </td>
                  </tr>
                ) : (
                  filteredSchools.map((school) => (
                    <tr 
                      key={school.id} 
                      className={`hover:bg-slate-50 transition-colors ${school.is_blocked ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{school.name}</div>
                        <div className="text-xs text-slate-400">ID: {school.id}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {school.proprietor_email || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          school.is_blocked 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {school.is_blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => navigate(`/admin/schools/${school.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/schools/${school.id}`)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit School"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleToggleBlock(school.id, school.is_blocked)}
                            className={`p-2 rounded-lg transition-colors ${
                              school.is_blocked 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={school.is_blocked ? 'Unblock School' : 'Block School'}
                          >
                            {school.is_blocked ? <Unlock className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteSchool(school.id, school.name)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete School"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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
  );
};

export default Schools;
