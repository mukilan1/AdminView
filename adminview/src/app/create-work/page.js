'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDepartments, getRegions } from '@/data/workItemsData';

export default function CreateWork() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    region: '',
    assignedOfficerName: '',
    assignedOfficerId: '',
    priority: 'medium',
    startDate: '',
    dueDate: '',
    description: '',
    status: 'pending',
  });
  
  // State for available options
  const [departments, setDepartments] = useState([]);
  const [regions, setRegions] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load department and region options
  useEffect(() => {
    if (!loading && (!user || (user.role !== 'collector' && user.role !== 'deptHead'))) {
      router.push('/login');
    } else {
      setDepartments(getDepartments());
      setRegions(getRegions());
      
      // Mock data for officers - in a real app this would come from an API
      setOfficers([
        { id: 'OFF001', name: 'John Doe', department: 'Public Works' },
        { id: 'OFF002', name: 'Jane Smith', department: 'Revenue' },
        { id: 'OFF003', name: 'Robert Johnson', department: 'Health' },
        { id: 'OFF004', name: 'Maria Garcia', department: 'Education' },
        { id: 'OFF005', name: 'David Brown', department: 'Agriculture' },
      ]);
    }
  }, [user, loading, router]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing department, also reset the officer
    if (name === 'department') {
      setFormData({
        ...formData,
        [name]: value,
        assignedOfficerName: '',
        assignedOfficerId: '',
      });
    } else if (name === 'assignedOfficerId') {
      // When selecting an officer, also set their name
      const selectedOfficer = officers.find(officer => officer.id === value);
      setFormData({
        ...formData,
        assignedOfficerId: value,
        assignedOfficerName: selectedOfficer ? selectedOfficer.name : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear any error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.region) {
      newErrors.region = 'Region is required';
    }
    
    if (!formData.assignedOfficerId) {
      newErrors.assignedOfficerId = 'Assigned officer is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (formData.startDate && new Date(formData.dueDate) < new Date(formData.startDate)) {
      newErrors.dueDate = 'Due date must be after start date';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Generate a work ID (in a real app this would be done server-side)
      const workId = 'W' + Date.now().toString().slice(-8);
      const workData = {
        ...formData,
        id: workId,
        progress: 0,
        createdBy: user.username,
        createdAt: new Date().toISOString(),
      };
      
      // Simulate API call
      setTimeout(() => {
        console.log('Work created:', workData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            title: '',
            department: '',
            region: '',
            assignedOfficerName: '',
            assignedOfficerId: '',
            priority: 'medium',
            startDate: '',
            dueDate: '',
            description: '',
            status: 'pending',
          });
          setSubmitSuccess(false);
        }, 2000);
      }, 1000);
    }
  };
  
  // Filter officers by selected department
  const filteredOfficers = formData.department
    ? officers.filter(officer => officer.department === formData.department)
    : officers;

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Create New Work</h1>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Work item created successfully!
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter work title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.region ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
            </div>
            
            <div>
              <label htmlFor="assignedOfficerId" className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Officer <span className="text-red-500">*</span>
              </label>
              <select
                id="assignedOfficerId"
                name="assignedOfficerId"
                value={formData.assignedOfficerId}
                onChange={handleChange}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assignedOfficerId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!formData.department}
              >
                <option value="">
                  {formData.department ? 'Select Officer' : 'Select a department first'}
                </option>
                {filteredOfficers.map((officer) => (
                  <option key={officer.id} value={officer.id}>
                    {officer.name} ({officer.id})
                  </option>
                ))}
              </select>
              {errors.assignedOfficerId && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedOfficerId}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter detailed description of the work"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
