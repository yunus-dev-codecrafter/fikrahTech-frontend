import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import RegisterSchoolModal from '../../components/RegisterSchoolModal';
import Toast from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PlusCircle, Search, Edit, Trash2, Building2, Shield, CreditCard } from 'lucide-react';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSchool, setEditingSchool] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools from API...');
      const response = await axiosInstance.get('/admin/schools');
      console.log('Schools fetched successfully:', response.data);
      setSchools(response.data);
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setToastMessage('Failed to fetch schools');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = (newSchool) => {
    setSchools([...schools, newSchool]);
    setToastMessage(`School "${newSchool.schoolName}" registered successfully!`);
    setToastType('success');
    setShowToast(true);
    setIsModalOpen(false);
  };

  const handleEditSchool = (school) => {
    setEditingSchool(school);
    setIsModalOpen(true);
  };

  const handleSaveSchool = async () => {
    if (!editingSchool) return;
    
    try {
      console.log('Updating school:', editingSchool);
      await axiosInstance.put(`/admin/schools/${editingSchool._id}`, editingSchool);
      console.log('School updated successfully');
      
      setSchools(schools.map(school => 
        school._id === editingSchool._id ? editingSchool : school
      ));
      
      setToastMessage('School updated successfully!');
      setToastType('success');
      setShowToast(true);
      setIsModalOpen(false);
      setEditingSchool(null);
    } catch (error) {
      console.error('Failed to update school:', error);
      setToastMessage('Failed to update school');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    if (!window.confirm('Are you sure you want to delete this school?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/schools/${schoolId}`);
      setSchools(schools.filter(school => school._id !== schoolId));
      setToastMessage('School deleted successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to delete school:', error);
      setToastMessage('Failed to delete school');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleSubscriptionAction = async (schoolId, action) => {
    try {
      console.log(`${action} subscription for school:`, schoolId);
      await axiosInstance.put(`/admin/schools/${schoolId}/subscription`, { action });
      setToastMessage(`Subscription ${action}d successfully!`);
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error(`Failed to ${action} subscription:`, error);
      setToastMessage(`Failed to ${action} subscription`);
      setToastType('error');
      setShowToast(true);
    }
  };

  // Data safety check to prevent blank page crash
  if (!Array.isArray(schools)) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No data found.</p>
        </div>
      </div>
    );
  }

  const filteredSchools = schools.filter(school =>
    school.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.proprietorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.proprietorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="text-navy-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy-800">School Management</h1>
        <p className="text-gray-600 mt-2">Manage registered schools and their proprietors</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-xl font-semibold text-navy-800 mb-2">
              Registered Schools ({schools.length})
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              <PlusCircle className="mr-2" size={20} />
              Add School
            </button>
          </div>
        </div>

        {filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <PlusCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No schools found' : 'No schools registered yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by registering your first school.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                <PlusCircle className="mr-2" size={20} />
                Register First School
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proprietor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchools.map((school) => (
                  <tr key={school._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{school.schoolName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.proprietorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{school.proprietorEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        school.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {school.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                        onClick={() => handleEditSchool(school)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleSubscriptionAction(school._id, 'manage')}
                      >
                        <CreditCard size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteSchool(school._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RegisterSchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSchool}
      />

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

export default Schools;
