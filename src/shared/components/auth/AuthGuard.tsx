"use client";

import { useAuth } from "shared/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  fallback = null,
  loadingFallback = <DefaultLoading />
}: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return <>{loadingFallback}</>;
  }
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

function DefaultLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  );
}

