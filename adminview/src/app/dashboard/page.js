'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import workItems, { getDepartments, getRegions, getStatuses } from '@/data/workItemsData';
import assignments from '@/data/assignmentsData';
import WorkDetailsModal from '@/components/WorkDetailsModal';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  // State for work items and filtering
  const [allWorkItems, setAllWorkItems] = useState([]);
  const [filteredWorkItems, setFilteredWorkItems] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Lists for filter dropdowns
  const [departments, setDepartments] = useState([]);
  const [regions, setRegions] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'collector' && user.role !== 'deptHead'))) {
      router.push('/login');
    } else {
      // Load work items and filter options
      setAllWorkItems(workItems);
      setFilteredWorkItems(workItems);
      setDepartments(getDepartments());
      setRegions(getRegions());
      setStatuses(getStatuses());
    }
  }, [user, loading, router]);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = allWorkItems;
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.id.toLowerCase().includes(term) || 
        item.title.toLowerCase().includes(term) || 
        item.department.toLowerCase().includes(term) ||
        item.assignedOfficerName.toLowerCase().includes(term)
      );
    }
    
    // Apply department filter
    if (departmentFilter) {
      result = result.filter(item => item.department === departmentFilter);
    }
    
    // Apply region filter
    if (regionFilter) {
      result = result.filter(item => item.region === regionFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    setFilteredWorkItems(result);
  }, [searchTerm, departmentFilter, regionFilter, statusFilter, allWorkItems]);

  const openWorkDetails = (work) => {
    setSelectedWork(work);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setRegionFilter('');
    setStatusFilter('');
  };

  // Function to navigate to create work page
  const navigateToCreateWork = () => {
    router.push('/create-work');
  };
  
  // Function to navigate to reports page
  const navigateToReports = () => {
    router.push('/reports');
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Administrative Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.fullName} ({user.department})</span>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Works</h2>
            <p className="text-3xl font-bold">{allWorkItems.length}</p>
            <p className="text-sm text-gray-500">Total work items</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">In Progress</h2>
            <p className="text-3xl font-bold text-blue-600">
              {allWorkItems.filter(item => item.status === 'in-progress').length}
            </p>
            <p className="text-sm text-gray-500">Work items in progress</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Pending</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {allWorkItems.filter(item => item.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Work items pending</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Ongoing Works</h2>
          </div>
          
          <div className="p-6 bg-gray-50 border-b space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search by ID, title, department, or officer..."
                  className="w-full p-2 border rounded text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 flex-wrap md:flex-nowrap">
                <select
                  className="p-2 border rounded min-w-[150px] text-gray-900"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  className="p-2 border rounded min-w-[150px] text-gray-900"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                
                <select
                  className="p-2 border rounded min-w-[150px] text-gray-900"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'in-progress' ? 'In Progress' : 
                       status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={resetFilters}
                  className="p-2 border rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Work ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned Officer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkItems.length > 0 ? (
                  filteredWorkItems.map((work) => (
                    <tr key={work.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{work.id}</td>
                      <td className="px-6 py-4 text-gray-900">{work.title}</td>
                      <td className="px-6 py-4 text-gray-900">{work.department}</td>
                      <td className="px-6 py-4 text-gray-900">{work.region}</td>
                      <td className="px-6 py-4 text-gray-900">{work.assignedOfficerName}</td>
                      <td className="px-6 py-4 text-gray-900">{work.startDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          work.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          work.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {work.status === 'in-progress' ? 'In Progress' : 
                           work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              work.progress < 30 ? 'bg-red-600' :
                              work.progress < 70 ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}
                            style={{ width: `${work.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{work.progress}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => openWorkDetails(work)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                      No work items found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Create New Work</h2>
            <p className="mb-4 text-gray-700">Assign and create new work items for office workers.</p>
            <button 
              onClick={navigateToCreateWork}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Create Work
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">View Reports</h2>
            <p className="mb-4 text-gray-700">Access detailed reports and analytics on work progress.</p>
            <button 
              onClick={navigateToReports}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
            >
              View Reports
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Manage Users</h2>
            <p className="mb-4 text-gray-700">Manage users, permissions, and department settings.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
              Manage Users
            </button>
          </div>
        </div>
      </div>
      
      {/* Work Details Modal */}
      {showModal && (
        <WorkDetailsModal 
          work={selectedWork} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}
