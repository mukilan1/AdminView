'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Assignments() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'endOfficeWorker')) {
      router.push('/login');
    } else if (user) {
      // Mock data - would come from API in real app
      setAssignments([
        { id: 1, title: 'Document Review', status: 'pending', deadline: '2023-12-15' },
        { id: 2, title: 'Field Inspection', status: 'in-progress', deadline: '2023-12-20' },
        { id: 3, title: 'Report Filing', status: 'pending', deadline: '2023-12-25' }
      ]);
    }
  }, [user, loading, router]);

  const updateStatus = (id, newStatus) => {
    setAssignments(assignments.map(a => 
      a.id === id ? {...a, status: newStatus} : a
    ));
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Assignments</h1>
        <div>
          <span className="mr-4">Welcome, {user.username}</span>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{assignment.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4">{assignment.deadline}</td>
                <td className="px-6 py-4">
                  <select 
                    onChange={(e) => updateStatus(assignment.id, e.target.value)}
                    value={assignment.status}
                    className="border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
