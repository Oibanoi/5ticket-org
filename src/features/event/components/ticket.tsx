"use client";

import { useState } from "react";
import { DatePicker, Select, Input, Table, Pagination } from "antd";
import { FaPlus, FaSearch } from "react-icons/fa";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

interface TicketData {
  key: string;
  ticketCode: string;
  account: string;
  name: string;
  orderCode: string;
  time: string;
  status: "active" | "void" | "checked";
  action: "print" | "check";
}

export default function TicketListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [orderType, setOrderType] = useState("");

  // Dữ liệu mẫu
  const mockData: TicketData[] = Array.from({ length: 10 }, (_, i) => ({
    key: `${i}`,
    ticketCode: "SKX1239843JY",
    account: "MinhDanny@gmail.com",
    name: "Danny",
    orderCode: "#5TICKET1244",
    time: "09:02 - 12/02/2023",
    status: i === 5 ? "void" : "active",
    action: i === 5 ? "check" : "print",
  }));

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: "Đang hoạt động", className: "bg-green-500 text-white" },
      void: { text: "Vô hiệu", className: "bg-gray-400 text-white" },
      checked: { text: "Đã check-in", className: "bg-blue-500 text-white" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const getActionButton = (action: string) => {
    if (action === "print") {
      return (
        <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-1.5 rounded-full text-sm font-medium">
          Vỡ hiệu
        </button>
      );
    }
    return (
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-medium">
        Kích hoạt
      </button>
    );
  };

  const columns: ColumnsType<TicketData> = [
    {
      title: "Mã vé",
      dataIndex: "ticketCode",
      key: "ticketCode",
      className: "text-blue-600 font-medium",
    },
    {
      title: "Tài khoản",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      className: "text-blue-600 font-medium",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (action: string) => getActionButton(action),
    },
  ];

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className=" border-b">
        <div className=" mx-auto  pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Trang chủ</span>
            <span>›</span>
            <span>Danh sách sự kiện</span>
            <span>›</span>
            <span className="text-gray-900">[BẾN THÀNH] Đêm nhạc Minh Tuyết - Phạm Quỳnh Anh</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Danh sách vé</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Danh sách vé</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1 rounded-lg flex items-center gap-2 font-medium">
            <FaPlus />
            Tạo đơn thủ công
          </button>
        </div>
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
            className="ticket-table"
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
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
        .ticket-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #1e40af;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }
        .ticket-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e5e7eb;
        }
        .ticket-table .ant-table-tbody > tr:hover > td {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}
