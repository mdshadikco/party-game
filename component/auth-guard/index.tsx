"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  redirectIfAuthenticated = false,
  redirectTo = "/dashboard",
}: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (redirectIfAuthenticated && user) {
        router.push(redirectTo);
      } else if (!redirectIfAuthenticated && !user) {
        router.push("/login");
      }
    }
  }, [user, loading, router, redirectIfAuthenticated, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-800 to-gray-400">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (redirectIfAuthenticated && user) {
    return (
      <div className="min-h-screen flex gap-2 flex-col items-center justify-center bg-gradient-to-bl from-indigo-800 to-gray-400">
        Redirecting to dashboard...
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  if (!redirectIfAuthenticated && !user) {
    return (
      <div className="min-h-screen flex gap-2 flex-col items-center justify-center bg-gradient-to-bl from-indigo-800 to-gray-400">
        Redirecting to login...
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  return <>{children}</>;
};
