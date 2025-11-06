"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button, Result } from "antd";
import { ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Routers } from "shared/components/router";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Result
          status="500"
          title="Oops! Đã có lỗi xảy ra"
          subTitle="Xin lỗi, đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục."
          extra={
            <div className="space-y-3">
              <Button
                type="primary"
                size="large"
                icon={<ReloadOutlined />}
                onClick={reset}
                className="w-full"
              >
                Thử lại
              </Button>
              <Link href={Routers.HOME}>
                <Button
                  size="large"
                  icon={<HomeOutlined />}
                  className="w-full"
                >
                  Về trang chủ
                </Button>
              </Link>
            </div>
          }
        />
        
        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Chi tiết lỗi (Development):
            </h3>
            <p className="text-xs text-red-600 dark:text-red-300 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
