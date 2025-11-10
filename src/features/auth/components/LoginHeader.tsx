"use client";

import { Logo } from "components/layout/secondary/logo";

interface LoginHeaderProps {
  isDevelopment?: boolean;
}

export function LoginHeader({ isDevelopment }: LoginHeaderProps) {
  return (
    <div className="text-center space-y-6">
    {/* Logo with DEV Badge */}
    <div className="relative inline-flex items-center justify-center">
      <Logo className="fill-black dark:fill-light" fill="currentColor" />
      {isDevelopment && (
        <div className="absolute -top-2 -right-2 animate-pulse">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-ping"></span>
            DEV
          </span>
        </div>
      )}
    </div>

    {/* Title and Description */}
    <div className="space-y-3">
      <p className="text-gray-600 dark:text-gray-400">Đăng nhập để tiếp tục vào hệ thống</p>
    </div>
  </div>
  );
}

