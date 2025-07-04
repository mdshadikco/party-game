"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-800 to-gray-400">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  // Show fallback or redirect to login
  if (!user) {
    return (
      fallback || (
        <div className="flex flex-col gap-2 justify-center h-screen items-center bg-gradient-to-bl from-indigo-800 to-gray-400">
          Redirecting to login...
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-100"></div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
