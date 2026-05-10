import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { Settings, Save, Bell, Shield, Database, Globe } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings from API...');
      const response = await axiosInstance.get('/admin/settings');
      console.log('Settings fetched successfully:', response.data);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setToastMessage('Failed to fetch settings');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Data safety check to prevent blank page crash
  if (!settings || typeof settings !== 'object') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No data found.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      console.log('Saving settings...');
      await axiosInstance.put('/admin/settings', settings);
      console.log('Settings saved successfully');
      setToastMessage('Settings saved successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setToastMessage('Failed to save settings');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-navy-800">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system preferences and options</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Globe size={20} className="text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold text-navy-800">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={settings.general?.schoolName || ''}
                onChange={(e) => handleInputChange('general', 'schoolName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter school name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Session
              </label>
              <input
                type="text"
                value={settings.general?.academicSession || ''}
                onChange={(e) => handleInputChange('general', 'academicSession', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., 2023/2024"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell size={20} className="text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold text-navy-800">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">Receive email notifications for important events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications?.emailEnabled || false}
                onChange={(e) => handleInputChange('notifications', 'emailEnabled', e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  System Alerts
                </label>
                <p className="text-sm text-gray-500">Show system alerts and notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications?.systemAlertsEnabled || false}
                onChange={(e) => handleInputChange('notifications', 'systemAlertsEnabled', e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield size={20} className="text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold text-navy-800">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.security?.sessionTimeout || 30}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="5"
                max="120"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
                <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security?.twoFactorEnabled || false}
                onChange={(e) => handleInputChange('security', 'twoFactorEnabled', e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Database size={20} className="text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold text-navy-800">Database Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backup Frequency
              </label>
              <select
                value={settings.database?.backupFrequency || 'daily'}
                onChange={(e) => handleInputChange('database', 'backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Retention Period (days)
              </label>
              <input
                type="number"
                value={settings.database?.dataRetentionDays || 365}
                onChange={(e) => handleInputChange('database', 'dataRetentionDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="30"
                max="3650"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

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

export default SettingsPage;
