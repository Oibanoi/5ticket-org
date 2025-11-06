"use client";

import Link from "next/link";
import { Logo } from "components/layout/secondary/logo";

interface LoginHeaderProps {
  isDevelopment?: boolean;
}

export function LoginHeader({ isDevelopment }: LoginHeaderProps) {
  return (
    <div className="flex items-center flex-col">
      <div>
        <Link href="/" className="relative flex items-end">
          <Logo className="text-secondary-600 w-32" stroke="currentColor" fill="currentColor" />
          {isDevelopment && (
            <b className="inline-block text-xxs ml-0.5 rounded-md bg-black dark:bg-white text-white dark:text-black px-1 mb-0.5">
              DEV
            </b>
          )}
        </Link>
      </div>
      <h2 className="text-secondary-600 text-xl font-bold mt-3">Đăng nhập hệ thống</h2>
    </div>
  );
}

