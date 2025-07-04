'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({ 
  children, 
  redirectIfAuthenticated = false, 
  redirectTo = '/dashboard' 
}: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (redirectIfAuthenticated && user) {
        router.push(redirectTo);
      } else if (!redirectIfAuthenticated && !user) {
        router.push('/login');
      }
    }
  }, [user, loading, router, redirectIfAuthenticated, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (redirectIfAuthenticated && user) {
    return <div>Redirecting to dashboard...</div>;
  }

  if (!redirectIfAuthenticated && !user) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
};