'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on role
        if (user.role === 'collector' || user.role === 'deptHead') {
          router.push('/dashboard');
        } else if (user.role === 'endOfficeWorker') {
          router.push('/assignments');
        }
      } else {
        router.push('/login');
      }
    }
  }, [loading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
