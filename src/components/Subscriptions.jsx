import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { CreditCard, CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    interval: 'monthly',
    features: ['']
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token being sent for plans:', token);
        const response = await axiosInstance.get('/admin/plans');
        console.log('Plans response:', response.data);
        setPlans(response.data?.plans || response.data?.data || response.data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        console.error('Error response:', error.response?.data);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
          console.error('Plans endpoint not found - backend route may be missing');
        } else if (error.response?.status === 500) {
          console.error('Server error - subscription_plans table may be missing');
        }
        
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Creating plan with data:', formData);
      
      // Filter out empty features and ensure proper data format
      const planData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        interval: formData.interval,
        features: formData.features.filter(feature => feature.trim() !== ''),
        is_active: true // Default to active
      };
      
      console.log('Sending plan data:', JSON.stringify(planData, null, 2));
      
      const response = await axiosInstance.post('/admin/plans', planData);
      console.log('Plan creation response:', response.data);
      
      // Reset form and hide
      setFormData({
        name: '',
        price: '',
        interval: 'monthly',
        features: ['']
      });
      setShowCreateForm(false);
      
      // Refresh plans list
      const plansResponse = await axiosInstance.get('/admin/plans');
      setPlans(plansResponse.data?.plans || plansResponse.data?.data || response.data || []);
    } catch (error) {
      console.error('Error creating plan:', error);
      console.error('Error response:', error.response?.data);
      
      // Show user-friendly error message
      if (error.response?.status === 404) {
        console.error('Plans endpoint not found - backend route may be missing');
      } else if (error.response?.status === 500) {
        console.error('Server error - subscription_plans table may be missing');
        console.error('Backend needs: CREATE TABLE IF NOT EXISTS subscription_plans');
        console.error('Table columns: id (INT AUTO_INCREMENT), name (VARCHAR), price (DECIMAL), interval (VARCHAR), features (TEXT), is_active (BOOLEAN)');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
        <p className="text-slate-600 mt-2">Define and manage subscription plans for schools</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Plans List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Current Plans</h3>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Plan</span>
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="space-y-4">
                {!Array.isArray(plans) || plans.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No subscription plans found</p>
                  </div>
                ) : (
                  plans.map((plan) => (
                    <div key={plan.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                          <div className="mt-2">
                            <span className="text-2xl font-bold text-slate-900">NGN {plan.price}</span>
                            <span className="text-slate-600">/{plan.interval}</span>
                          </div>
                          <ul className="mt-4 space-y-2">
                            {Array.isArray(plan.features) ? plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            )) : (
                              <li className="flex items-center text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {plan.features}
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Create New Plan</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Basic Plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price (NGN)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Billing Interval
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Up to 100 students"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Feature</span>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {formLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
