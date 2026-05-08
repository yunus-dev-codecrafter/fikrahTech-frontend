// src/pages/admin/Dashboard.jsx
import React, { useState } from 'react';
import RegisterSchoolModal from '../../components/RegisterSchoolModal';
import Toast from '../../components/Toast';
import { PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSchoolRegistered = (newSchool) => {
    setToastMessage(`School "${newSchool.schoolName}" registered successfully!`);
    setToastType('success');
    setShowToast(true);
    // Optionally, refresh a list of schools or update state here
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-navy-800 mb-6">Super Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-navy-800 mb-4">School Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="mr-2" size={20} />
          Register New School
        </button>
      </div>

      <RegisterSchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSchoolRegistered}
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

export default Dashboard;