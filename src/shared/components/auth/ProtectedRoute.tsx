"use client";

import { useAuth } from "shared/hooks/useAuth";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo 
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, requireAuth } = useAuth();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      requireAuth(redirectTo || pathname);
    }
  }, [isLoading, isAuthenticated, requireAuth, pathname, redirectTo]);
  
  // Hiển thị loading state mượt mà
  if (isLoading) {
    return fallback || <LoadingScreen />;
  }
  
  // Không render gì nếu chưa authenticated (đang redirect)
  if (!isAuthenticated) {
    return fallback || <LoadingScreen />;
  }
  
  // Render children khi đã authenticated
  return <>{children}</>;
}

// Loading screen mặc định
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Đang kiểm tra xác thực...
        </p>
      </div>
    </div>
  );
}

