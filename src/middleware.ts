import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Middleware này sẽ chạy trước khi render bất kỳ page nào
// Cực kỳ mượt mà, không có flash, redirect ngay từ server
export default withAuth(
  function middleware(req) {
    // Có thể thêm logic custom ở đây nếu cần
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Cho phép truy cập các trang public
        const publicPaths = [
          "/login",
          "/register", 
          "/forgot-password",
          "/reset-password",
        ];
        
        // Cho phép truy cập các route auth
        if (pathname.startsWith("/api/auth") || publicPaths.some(path => pathname.startsWith(path))) {
          return true;
        }
        
        // Các route còn lại yêu cầu authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Redirect đến trang login nếu chưa đăng nhập
    },
  }
);

// Cấu hình các routes mà middleware sẽ chạy
export const config = {
  matcher: [
    /*
     * Match tất cả các request paths ngoại trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

