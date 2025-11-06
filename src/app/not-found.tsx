import { Button, Result } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Routers } from "shared/components/router";
import { Logo } from "shared/components/icon/logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang - 5Ticket ORG",
  description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="fill-black dark:fill-white w-24 h-auto" />
        </div>

        {/* 404 Result */}
        <Result
          status="404"
          title="404"
          subTitle={
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Oops! Không tìm thấy trang
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
              </p>
            </div>
          }
          extra={
            <div className="space-y-3 mt-8">
              <Link href={Routers.HOME}>
                <Button
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  className="w-full sm:w-auto"
                >
                  Về trang chủ
                </Button>
              </Link>
              <Link href={Routers.EVENTS}>
                <Button
                  size="large"
                  icon={<SearchOutlined />}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Xem sự kiện
                </Button>
              </Link>
            </div>
          }
        />


        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cần hỗ trợ?{" "}
            <a
              href="mailto:support@5ticket.com"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Liên hệ với chúng tôi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
