'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDepartments } from '@/data/workItemsData';

export default function ManageUsers() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State for user management
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // State for user form
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    id: '',
    username: '',
    fullName: '',
    email: '',
    department: '',
    role: '',
    isActive: true,
    permissions: []
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Mock permissions data
  const availablePermissions = [
    { id: 'create_work', name: 'Create Work Items' },
    { id: 'edit_work', name: 'Edit Work Items' },
    { id: 'delete_work', name: 'Delete Work Items' },
    { id: 'assign_work', name: 'Assign Work Items' },
    { id: 'view_reports', name: 'View Reports' },
    { id: 'manage_users', name: 'Manage Users' },
    { id: 'approve_work', name: 'Approve Work Items' },
    { id: 'view_all_departments', name: 'View All Departments' }
  ];

  // Load data
  useEffect(() => {
    if (!loading && (!user || (user.role !== 'deptHead'))) {
      router.push('/login');
    } else {
      // Load departments
      setDepartments(getDepartments());
      
      // Load mock users data
      const mockUsers = [
        {
          id: 'USR001',
          username: 'john.doe',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          department: 'Public Works',
          role: 'deptHead',
          isActive: true,
          lastLogin: '2023-05-10 14:30',
          permissions: ['create_work', 'edit_work', 'assign_work', 'view_reports', 'manage_users']
        },
        {
          id: 'USR002',
          username: 'jane.smith',
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          department: 'Revenue',
          role: 'collector',
          isActive: true,
          lastLogin: '2023-05-12 09:15',
          permissions: ['create_work', 'edit_work', 'assign_work', 'view_reports']
        },
        {
          id: 'USR003',
          username: 'robert.johnson',
          fullName: 'Robert Johnson',
          email: 'robert.johnson@example.com',
          department: 'Health',
          role: 'endOfficeWorker',
          isActive: true,
          lastLogin: '2023-05-11 11:45',
          permissions: ['edit_work']
        },
        {
          id: 'USR004',
          username: 'maria.garcia',
          fullName: 'Maria Garcia',
          email: 'maria.garcia@example.com',
          department: 'Education',
          role: 'endOfficeWorker',
          isActive: true,
          lastLogin: '2023-05-09 16:20',
          permissions: ['edit_work']
        },
        {
          id: 'USR005',
          username: 'david.brown',
          fullName: 'David Brown',
          email: 'david.brown@example.com',
          department: 'Agriculture',
          role: 'collector',
          isActive: false,
          lastLogin: '2023-04-30 10:10',
          permissions: ['create_work', 'edit_work', 'view_reports']
        }
      ];
      
      setUsers(mockUsers);
    }
  }, [user, loading, router]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || user.department === departmentFilter;
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Handle user form input change
  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setUserForm({
        ...userForm,
        [name]: checked
      });
    } else {
      setUserForm({
        ...userForm,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Handle permission toggle
  const togglePermission = (permissionId) => {
    const currentPermissions = [...userForm.permissions];
    
    if (currentPermissions.includes(permissionId)) {
      // Remove permission
      setUserForm({
        ...userForm,
        permissions: currentPermissions.filter(id => id !== permissionId)
      });
    } else {
      // Add permission
      setUserForm({
        ...userForm,
        permissions: [...currentPermissions, permissionId]
      });
    }
  };

  // Validate user form
  const validateUserForm = () => {
    const errors = {};
    
    if (!userForm.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!userForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!userForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!userForm.department) {
      errors.department = 'Department is required';
    }
    
    if (!userForm.role) {
      errors.role = 'Role is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit user form
  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    
    if (validateUserForm()) {
      if (editingUser) {
        // Update existing user
        setUsers(users.map(u => 
          u.id === editingUser.id ? { ...userForm, id: editingUser.id } : u
        ));
      } else {
        // Create new user
        const newUser = {
          ...userForm,
          id: `USR${(users.length + 1).toString().padStart(3, '0')}`,
          lastLogin: 'Never'
        };
        setUsers([...users, newUser]);
      }
      
      // Reset form and close it
      resetUserForm();
    }
  };

  // Edit user
  const handleEditUser = (userId) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setUserForm({ ...userToEdit });
      setShowUserForm(true);
    }
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Reset user form
  const resetUserForm = () => {
    setEditingUser(null);
    setUserForm({
      id: '',
      username: '',
      fullName: '',
      email: '',
      department: '',
      role: '',
      isActive: true,
      permissions: []
    });
    setFormErrors({});
    setShowUserForm(false);
  };

  // Toggle user active status
  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User and Permission Management</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b">
            <nav className="flex">
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'departments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('roles')}
              >
                Roles & Permissions
              </button>
            </nav>
          </div>
          
          {activeTab === 'users' && (
            <div>
              <div className="p-6 bg-gray-50 border-b space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Search users by name, username, or email..."
                      className="w-full p-2 border rounded"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <select
                      className="p-2 border rounded min-w-[150px]"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    
                    <select
                      className="p-2 border rounded min-w-[150px]"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="deptHead">Department Head</option>
                      <option value="collector">Collector</option>
                      <option value="endOfficeWorker">Office Worker</option>
                    </select>
                    
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setDepartmentFilter('');
                        setRoleFilter('');
                      }}
                      className="p-2 border rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowUserForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add New User
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{user.id}</td>
                          <td className="px-6 py-4">{user.fullName}</td>
                          <td className="px-6 py-4">{user.username}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.department}</td>
                          <td className="px-6 py-4">
                            {user.role === 'deptHead' ? 'Department Head' : 
                             user.role === 'collector' ? 'Collector' : 
                             'Office Worker'}
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className={`px-2 py-1 rounded text-xs ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">{user.lastLogin}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditUser(user.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => toggleUserStatus(user.id)}
                                className={user.isActive ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                          No users found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'departments' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Department Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map(dept => (
                  <div key={dept} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{dept}</h3>
                      <div>
                        <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Users: {users.filter(u => u.department === dept).length}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {users
                        .filter(u => u.department === dept && u.isActive)
                        .slice(0, 3)
                        .map(u => (
                          <span key={u.id} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {u.fullName}
                          </span>
                        ))}
                      {users.filter(u => u.department === dept && u.isActive).length > 3 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          +{users.filter(u => u.department === dept && u.isActive).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="border rounded-lg p-4 border-dashed flex items-center justify-center">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Department
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'roles' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Department Head</h3>
                <p className="text-sm text-gray-500 mb-2">Highest level of access with full administrative capabilities.</p>
                <div className="bg-gray-100 p-3 rounded">
                  <h4 className="font-medium mb-2">Default Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {availablePermissions.map(perm => (
                      <span key={perm.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {perm.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Collector</h3>
                <p className="text-sm text-gray-500 mb-2">Mid-level access for managing work items and viewing reports.</p>
                <div className="bg-gray-100 p-3 rounded">
                  <h4 className="font-medium mb-2">Default Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {availablePermissions
                      .filter(p => ['create_work', 'edit_work', 'assign_work', 'view_reports', 'approve_work'].includes(p.id))
                      .map(perm => (
                        <span key={perm.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {perm.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Office Worker</h3>
                <p className="text-sm text-gray-500 mb-2">Basic access for updating assigned work items.</p>
                <div className="bg-gray-100 p-3 rounded">
                  <h4 className="font-medium mb-2">Default Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {availablePermissions
                      .filter(p => ['edit_work'].includes(p.id))
                      .map(perm => (
                        <span key={perm.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {perm.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Customize Roles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            </div>
            
            <form onSubmit={handleUserFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={userForm.username}
                    onChange={handleUserFormChange}
                    className={`w-full p-2 border rounded ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={userForm.fullName}
                    onChange={handleUserFormChange}
                    className={`w-full p-2 border rounded ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={userForm.department}
                    onChange={handleUserFormChange}
                    className={`w-full p-2 border rounded ${formErrors.department ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formErrors.department && <p className="text-red-500 text-sm mt-1">{formErrors.department}</p>}
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={userForm.role}
                    onChange={handleUserFormChange}
                    className={`w-full p-2 border rounded ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Role</option>
                    <option value="deptHead">Department Head</option>
                    <option value="collector">Collector</option>
                    <option value="endOfficeWorker">Office Worker</option>
                  </select>
                  {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
                </div>
                
                <div>
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={userForm.isActive}
                      onChange={handleUserFormChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availablePermissions.map(permission => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        id={`permission-${permission.id}`}
                        type="checkbox"
                        checked={userForm.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`permission-${permission.id}`} className="ml-2 block text-sm text-gray-700">
                        {permission.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetUserForm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
