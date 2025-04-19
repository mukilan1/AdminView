'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// Fix: Import directly from default export
import assignments from '@/data/assignmentsData';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [dashboardAssignments, setDashboardAssignments] = useState([]);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'collector' && user.role !== 'deptHead'))) {
      router.push('/login');
    } else {
      // For admin dashboards, we show all assignments
      setDashboardAssignments(assignments);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user.fullName} ({user.department})</span>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">View All Work</h2>
          <p>Access and manage all pending work items.</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            View Work
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Work</h2>
          <p>Create and assign new work items to office workers.</p>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Create Work
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">View Reports</h2>
          <p>Access detailed reports and analytics.</p>
          <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded">
            View Reports
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">All Assignments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {dashboardAssignments.map(assignment => (
              <tr key={assignment.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{assignment.title}</td>
                <td className="px-6 py-4">{assignment.assignedTo}</td>
                <td className="px-6 py-4">{assignment.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                    assignment.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.priority}
                  </span>
                </td>
                <td className="px-6 py-4">{assignment.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
