/**
 * useAuth Hook
 * 
 * Custom hook để sử dụng trong Client Components
 * Cung cấp thông tin về authentication state và các helper functions
 */

"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Trạng thái
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";
  
  // User info
  const user = session?.user ?? null;
  const accessToken = session?.access_token ?? null;
  
  /**
   * Đăng xuất
   * @param callbackUrl - URL để redirect sau khi đăng xuất
   */
  const signOut = useCallback(async (callbackUrl: string = "/login") => {
    await nextAuthSignOut({ callbackUrl, redirect: true });
  }, []);
  
  /**
   * Kiểm tra auth và redirect nếu chưa đăng nhập
   * Sử dụng trong Client Components khi cần đảm bảo user đã đăng nhập
   * 
   * @param redirectTo - URL hiện tại để redirect về sau khi đăng nhập
   */
  const requireAuth = useCallback((redirectTo?: string) => {
    if (!isLoading && !isAuthenticated) {
      const params = redirectTo ? `?callbackUrl=${encodeURIComponent(redirectTo)}` : "";
      router.push(`/login${params}`);
      return false;
    }
    return isAuthenticated;
  }, [isLoading, isAuthenticated, router]);
  
  /**
   * Redirect nếu đã đăng nhập (cho trang login/register)
   * 
   * @param redirectTo - URL để redirect đến
   */
  const redirectIfAuthenticated = useCallback((redirectTo: string = "/") => {
    if (isAuthenticated) {
      router.push(redirectTo);
      return true;
    }
    return false;
  }, [isAuthenticated, router]);
  
  return {
    // Trạng thái
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    
    // Dữ liệu
    user,
    session,
    accessToken,
    
    // Actions
    signOut,
    requireAuth,
    redirectIfAuthenticated,
  };
}

