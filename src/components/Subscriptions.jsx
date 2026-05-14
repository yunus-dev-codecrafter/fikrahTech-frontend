import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { CreditCard, CheckCircle, Plus, Edit2, Trash2, Users, Calendar, X, LayoutGrid, List } from 'lucide-react';

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'school-subs'
  const [plans, setPlans] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [subFormData, setSubFormData] = useState({
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    interval: 'monthly',
    features: ['']
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'plans') {
        const response = await axiosInstance.get('/admin/plans');
        setPlans(response.data?.plans || response.data?.data || response.data || []);
      } else {
        const response = await axiosInstance.get('/admin/schools');
        setSchools(response.data?.schools || response.data?.data || response.data || []);
        // Also fetch plans if they aren't loaded for the assignment modal
        if (plans.length === 0) {
          const plansRes = await axiosInstance.get('/admin/plans');
          setPlans(plansRes.data?.plans || plansRes.data?.data || plansRes.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const planData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        interval: formData.interval,
        features: formData.features.filter(feature => feature.trim() !== ''),
        is_active: true
      };
      
      await axiosInstance.post('/admin/plans', planData);
      setFormData({ name: '', price: '', interval: 'monthly', features: [''] });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Calculate days if needed, or send dates directly if backend supports it
      // For now, let's assume we use the updateSchoolSubscription endpoint which takes days
      const start = new Date(subFormData.startDate);
      const end = new Date(subFormData.expiryDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      await axiosInstance.post(`/admin/schools/${selectedSchool.id}/subscription`, {
        days: diffDays,
        action: 'set',
        planId: subFormData.planId // If backend supports plan tracking
      });

      setSelectedSchool(null);
      fetchData();
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
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
        <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
        <p className="text-slate-600 mt-2">Manage subscription plans and school enrollments</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'plans' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="font-medium">Manage Plans</span>
        </button>
        <button
          onClick={() => setActiveTab('school-subs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'school-subs' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium">School Subscriptions</span>
        </button>
      </div>
      
      {activeTab === 'plans' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* Plans List */}
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
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 text-blue-600 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {plans.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                      <p>No subscription plans found</p>
                    </div>
                  ) : (
                    plans.map((plan) => (
                      <div key={plan.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all hover:shadow-md group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-lg">{plan.name}</h4>
                            <div className="mt-1">
                              <span className="text-2xl font-extrabold text-slate-900">NGN {parseFloat(plan.price).toLocaleString()}</span>
                              <span className="text-slate-500 text-sm ml-1">/{plan.interval}</span>
                            </div>
                            <ul className="mt-4 space-y-2">
                              {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-slate-600">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 animate-in slide-in-from-right duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Create New Plan</h3>
                  <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePlan} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Plan Name</label>
                    <input
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Premium Monthly"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Price (NGN)</label>
                      <input
                        type="number" required value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Interval</label>
                      <select
                        value={formData.interval}
                        onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="termly">Termly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Features</label>
                    <div className="space-y-3">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text" value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Unlimited Students"
                          />
                          {formData.features.length > 1 && (
                            <button
                              type="button" onClick={() => removeFeature(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button" onClick={addFeature}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Feature</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button
                      type="button" onClick={() => setShowCreateForm(false)}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={formLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                      {formLoading ? 'Creating...' : 'Create Plan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* School Subscriptions Tab */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">Manage School Subscriptions</h3>
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
                    <th className="text-left py-4 px-6 font-semibold">Current Plan</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 font-semibold">Expiry Date</th>
                    <th className="text-center py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.map((school) => (
                    <tr 
                      key={school.id} 
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedSchool(school)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{school.name}</div>
                        <div className="text-xs text-slate-400">{school.proprietor_email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-700">
                          {school.subscription_plan || 'No Plan'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${
                          school.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {school.status || 'Expired'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {school.subscription_expiry ? new Date(school.subscription_expiry).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="text-blue-600 hover:underline text-sm font-medium">
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subscription Assignment Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Update Subscription</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedSchool.name}</p>
              </div>
              <button onClick={() => setSelectedSchool(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubscription} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Plan</label>
                  <select
                    required
                    value={subFormData.planId}
                    onChange={(e) => setSubFormData(prev => ({ ...prev, planId: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">-- Choose a Plan --</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - NGN {parseFloat(plan.price).toLocaleString()} ({plan.interval})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date" required
                        value={subFormData.startDate}
                        onChange={(e) => setSubFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date" required
                        value={subFormData.expiryDate}
                        onChange={(e) => setSubFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3 border border-blue-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Current Status</p>
                  <p className="text-sm font-medium text-blue-700 mt-0.5">
                    {selectedSchool.status === 'active' ? 'Active Subscription' : 'Expired / No Subscription'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button" onClick={() => setSelectedSchool(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold shadow-lg shadow-blue-200 transition-all"
                >
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
