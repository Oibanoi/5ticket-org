/**
 * Auth Utilities
 * 
 * Các helper functions để kiểm tra authentication trong:
 * - Server Components
 * - Server Actions
 * - API Routes
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

/**
 * Lấy session hiện tại (Server-side)
 * Sử dụng trong Server Components và Server Actions
 * 
 * @returns Session hoặc null nếu chưa đăng nhập
 */
export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Kiểm tra user đã đăng nhập chưa
 * 
 * @returns true nếu đã đăng nhập, false nếu chưa
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Yêu cầu user phải đăng nhập
 * Nếu chưa đăng nhập sẽ redirect về trang login
 * 
 * @param redirectTo - URL để redirect về sau khi đăng nhập thành công
 * @returns Session nếu đã đăng nhập
 */
export async function requireAuth(redirectTo?: string): Promise<Session> {
  const session = await getSession();
  
  if (!session?.user) {
    const params = redirectTo ? `?callbackUrl=${encodeURIComponent(redirectTo)}` : "";
    redirect(`/login${params}`);
  }
  
  return session;
}

/**
 * Lấy thông tin user hiện tại
 * Throw error nếu chưa đăng nhập
 * 
 * @returns User object
 */
export async function getCurrentUser() {
  const session = await requireAuth();
  return session.user;
}

/**
 * Kiểm tra xem user có quyền truy cập không
 * Có thể mở rộng để check roles/permissions
 * 
 * @param requiredRole - Role cần thiết (optional)
 * @returns true nếu có quyền, false nếu không
 */
export async function hasAccess(requiredRole?: string): Promise<boolean> {
  const session = await getSession();
  
  if (!session?.user) {
    return false;
  }
  
  // Có thể thêm logic check role ở đây
  // if (requiredRole && session.user.role !== requiredRole) {
  //   return false;
  // }
  
  return true;
}

/**
 * Redirect nếu đã đăng nhập (dùng cho trang login/register)
 * 
 * @param redirectTo - URL để redirect đến nếu đã đăng nhập
 */
export async function redirectIfAuthenticated(redirectTo: string = "/") {
  const session = await getSession();
  
  if (session?.user) {
    redirect(redirectTo);
  }
}

