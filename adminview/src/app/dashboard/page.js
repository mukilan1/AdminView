'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'collector' && user.role !== 'deptHead'))) {
      router.push('/login');
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
          <span className="mr-4">Welcome, {user.username} ({user.role})</span>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
