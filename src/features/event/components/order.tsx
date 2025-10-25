"use client";

import { useState } from "react";
import { DatePicker, Select, Input, Table, Pagination } from "antd";
import { FaPlus, FaSearch } from "react-icons/fa";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface OrderData {
  key: string;
  orderId: string;
  purchaseDate: string;
  customer: string;
  username: string;
  quantity: number;
  total: number;
  status: "completed" | "pending" | "cancelled";
}

export default function OrderListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [orderType, setOrderType] = useState("");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Dữ liệu mẫu - static để tránh hydration mismatch
  const mockData: OrderData[] = [
    {
      key: "0",
      orderId: "5BIB000001",
      purchaseDate: "10h03 - 15/04/2023",
      customer: "Minh Danny",
      username: "MinhDanny@gmail.com",
      quantity: 1,
      total: 12000000,
      status: "completed",
    },
    {
      key: "1",
      orderId: "5BIB000002",
      purchaseDate: "11h15 - 15/04/2023",
      customer: "Nguyễn Văn A",
      username: "nguyenvana@gmail.com",
      quantity: 2,
      total: 24000000,
      status: "completed",
    },
    {
      key: "2",
      orderId: "5BIB000003",
      purchaseDate: "14h30 - 15/04/2023",
      customer: "Trần Thị B",
      username: "tranthib@gmail.com",
      quantity: 1,
      total: 12000000,
      status: "pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { text: "Hoàn thành", className: "bg-green-500 text-white" },
      pending: { text: "Đã đóng", className: "bg-yellow-500 text-white" },
      cancelled: { text: "Đã hủy", className: "bg-red-500 text-white" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const columns: ColumnsType<OrderData> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      className: "text-blue-600 font-medium",
    },
    {
      title: "Ngày mua",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Số lượng vé",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (value: number) => value.toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusBadge(status),
    },
  ];

  return (
    <div className=" ">
      {/* Breadcrumb */}
      <div className=" border-b">
        <div className=" mx-auto pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Trang chủ</span>
            <span>›</span>
            <span>Danh sách sự kiện</span>
            <span>›</span>
            <span className="text-gray-900">[BẾN THÀNH] Đêm nhạc Minh Tuyết - Phạm Quỳnh Anh</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Danh sách đơn hàng</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1 rounded-lg flex items-center gap-2 font-medium">
            <FaPlus />
            Tạo đơn thủ công
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-3">
          {["Tất cả", "Hoàn tất", "Chờ xác nhận thanh toán", "Đã đóng", "Đã hủy"].map(
            (tab, index) => (
              <button
                key={index}
                className={`pb-3 px-1 font-medium text-sm ${
                  index === 0
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Mã đơn hàng, Email, Họ tên, sđt"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<FaSearch className="text-gray-400" />}
                className="w-full"
                size="large"
              />
            </div>

            {/* Order Type */}
            <Select
              placeholder="Loại đơn hàng"
              value={orderType}
              onChange={setOrderType}
              className="w-full"
              size="large"
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="online">Đơn online</Select.Option>
              <Select.Option value="manual">Đơn thủ công</Select.Option>
            </Select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Từ</span>
              <DatePicker
                placeholder="12/02/2023"
                format="DD/MM/YYYY"
                className="flex-1"
                size="large"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Đến</span>
              <DatePicker
                placeholder="02/12/2023"
                format="DD/MM/YYYY"
                className="flex-1"
                size="large"
              />
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium whitespace-nowrap">
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={false}
            className="order-table"
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <Pagination
            current={currentPage}
            total={200}
            pageSize={10}
            onChange={setCurrentPage}
            showSizeChanger={false}
            itemRender={(page, type, element) => {
              if (type === "prev") {
                return <button className="w-full rounded hover:bg-gray-100">‹</button>;
              }
              if (type === "next") {
                return <button className="w-full rounded hover:bg-gray-100">›</button>;
              }
              if (type === "page") {
                return (
                  <button
                    className={`w-full rounded ${
                      page === currentPage ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return element;
            }}
          />
          <span className="text-sm text-gray-600">1-10 trong số 200</span>
        </div>
      </div>

      <style jsx global>{`
        .order-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #1e40af;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }
        .order-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e5e7eb;
        }
        .order-table .ant-table-tbody > tr:hover > td {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}
