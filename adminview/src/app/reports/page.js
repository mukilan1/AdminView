'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import workItems, { getDepartments, getRegions, getStatuses } from '@/data/workItemsData';

export default function Reports() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Report data states
  const [departments, setDepartments] = useState([]);
  const [regions, setRegions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [workData, setWorkData] = useState([]);
  
  // Chart data
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [statusCounts, setStatusCounts] = useState({});
  const [priorityCounts, setPriorityCounts] = useState({});
  const [regionCounts, setRegionCounts] = useState({});
  const [monthlyProgress, setMonthlyProgress] = useState([]);
  const [averageCompletionTime, setAverageCompletionTime] = useState(0);
  
  // Filter state
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'collector' && user.role !== 'deptHead'))) {
      router.push('/login');
    } else {
      // Load work data and filter options
      setWorkData(workItems);
      setDepartments(getDepartments());
      setRegions(getRegions());
      setStatuses(getStatuses());
      
      // Process the data for reports
      processReportData(workItems);
    }
  }, [user, loading, router]);
  
  // Recalculate when time range changes
  useEffect(() => {
    let filteredWork = [...workItems];
    
    // Apply time filter
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (timeRange === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeRange === 'quarter') {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (timeRange === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filteredWork = filteredWork.filter(item => new Date(item.startDate) >= cutoffDate);
    }
    
    processReportData(filteredWork);
  }, [timeRange]);
  
  const processReportData = (data) => {
    // Count by department
    const deptCounts = {};
    departments.forEach(dept => { deptCounts[dept] = 0; });
    
    data.forEach(item => {
      deptCounts[item.department] = (deptCounts[item.department] || 0) + 1;
    });
    setDepartmentCounts(deptCounts);
    
    // Count by status
    const statCounts = {};
    statuses.forEach(status => { statCounts[status] = 0; });
    
    data.forEach(item => {
      statCounts[item.status] = (statCounts[item.status] || 0) + 1;
    });
    setStatusCounts(statCounts);
    
    // Count by priority
    const prioCounts = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    data.forEach(item => {
      prioCounts[item.priority] = (prioCounts[item.priority] || 0) + 1;
    });
    setPriorityCounts(prioCounts);
    
    // Count by region
    const regCounts = {};
    regions.forEach(region => { regCounts[region] = 0; });
    
    data.forEach(item => {
      regCounts[item.region] = (regCounts[item.region] || 0) + 1;
    });
    setRegionCounts(regCounts);
    
    // Calculate monthly progress (dummy data for demonstration)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthly = months.map(month => ({
      month,
      completed: Math.floor(Math.random() * 10) + 1,
      started: Math.floor(Math.random() * 15) + 5
    }));
    setMonthlyProgress(monthly);
    
    // Calculate average completion time (dummy data)
    setAverageCompletionTime(Math.floor(Math.random() * 5) + 7); // 7-12 days
  };
  
  const getCompletionRate = () => {
    const completed = statusCounts['completed'] || 0;
    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    return total ? Math.round((completed / total) * 100) : 0;
  };
  
  const getHighPriorityCount = () => {
    return priorityCounts['high'] || 0;
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Work Progress Reports</h1>
          <div className="flex items-center">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="mr-4 p-2 border rounded-md"
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Works</h2>
            <p className="text-3xl font-bold">{workData.length}</p>
            <div className="mt-2 text-sm text-gray-500">
              Across all departments and regions
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Completion Rate</h2>
            <p className="text-3xl font-bold text-green-600">{getCompletionRate()}%</p>
            <div className="mt-2 text-sm text-gray-500">
              Of all assigned works
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">High Priority</h2>
            <p className="text-3xl font-bold text-red-600">{getHighPriorityCount()}</p>
            <div className="mt-2 text-sm text-gray-500">
              Works requiring immediate attention
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Avg. Completion Time</h2>
            <p className="text-3xl font-bold text-blue-600">{averageCompletionTime} days</p>
            <div className="mt-2 text-sm text-gray-500">
              From assignment to completion
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Work by Department</h2>
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for actual chart */}
              <div className="w-full">
                {Object.entries(departmentCounts).map(([dept, count]) => (
                  <div key={dept} className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span>{dept}</span>
                      <span>{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(departmentCounts))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Work by Status</h2>
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for actual chart */}
              <div className="flex w-full justify-around items-end h-48 pt-10">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const maxCount = Math.max(...Object.values(statusCounts));
                  const height = maxCount ? (count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div 
                        className={`w-16 rounded-t-lg ${
                          status === 'completed' ? 'bg-green-500' :
                          status === 'in-progress' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="mt-2 text-sm font-medium text-center">
                        {status === 'in-progress' ? 'In Progress' : 
                         status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                      <div className="text-gray-500 text-sm">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Work by Region</h2>
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for actual chart - would use a pie chart here */}
              <div className="w-full grid grid-cols-2 gap-4">
                {Object.entries(regionCounts).map(([region, count]) => (
                  <div key={region} className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm mr-2">{region}:</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for actual line chart */}
              <div className="w-full overflow-x-auto">
                <div className="flex w-full justify-between items-end h-48 min-w-[600px]">
                  {monthlyProgress.map((data, index) => {
                    const maxStarted = Math.max(...monthlyProgress.map(m => m.started));
                    const startedHeight = maxStarted ? (data.started / maxStarted) * 80 : 0;
                    const completedHeight = maxStarted ? (data.completed / maxStarted) * 80 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center mx-1">
                        <div className="flex items-end">
                          <div 
                            className="w-8 bg-blue-200 rounded-t-sm mr-1"
                            style={{ height: `${startedHeight}%` }}
                          ></div>
                          <div 
                            className="w-8 bg-green-400 rounded-t-sm"
                            style={{ height: `${completedHeight}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs">{data.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 bg-blue-200 mr-1"></div>
                    <span className="text-sm">Started</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 mr-1"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Tables */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Work Status Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Works</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">In Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pending</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => {
                  const deptWorks = workData.filter(w => w.department === dept);
                  const total = deptWorks.length;
                  const completed = deptWorks.filter(w => w.status === 'completed').length;
                  const inProgress = deptWorks.filter(w => w.status === 'in-progress').length;
                  const pending = deptWorks.filter(w => w.status === 'pending').length;
                  const rate = total ? Math.round((completed / total) * 100) : 0;
                  
                  return (
                    <tr key={dept} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{dept}</td>
                      <td className="px-6 py-4 text-gray-900">{total}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{completed}</td>
                      <td className="px-6 py-4 text-blue-600 font-medium">{inProgress}</td>
                      <td className="px-6 py-4 text-yellow-600 font-medium">{pending}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                            <div 
                              className={`h-2.5 rounded-full ${
                                rate > 70 ? 'bg-green-600' :
                                rate > 40 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                          <span>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Performance by Region</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Works</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">High Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {regions.map(region => {
                  const regionWorks = workData.filter(w => w.region === region);
                  const total = regionWorks.length;
                  const highPriority = regionWorks.filter(w => w.priority === 'high').length;
                  const avgProgress = total ? 
                    Math.round(regionWorks.reduce((sum, w) => sum + w.progress, 0) / total) : 0;
                  const completed = regionWorks.filter(w => w.status === 'completed').length;
                  const rate = total ? Math.round((completed / total) * 100) : 0;
                  
                  return (
                    <tr key={region} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{region}</td>
                      <td className="px-6 py-4 text-gray-900">{total}</td>
                      <td className="px-6 py-4 text-gray-900">
                        <span className={`px-2 py-1 rounded text-xs ${
                          highPriority > 3 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {highPriority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[150px]">
                          <div 
                            className={`h-2.5 rounded-full ${
                              avgProgress > 70 ? 'bg-green-600' :
                              avgProgress > 30 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${avgProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{avgProgress}%</span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
