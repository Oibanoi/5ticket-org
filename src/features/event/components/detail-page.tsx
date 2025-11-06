"use client";

import { useState } from "react";
import { DatePicker } from "antd";
import { FaMoneyBillWave, FaShoppingCart, FaTicketAlt } from "react-icons/fa";
import dayjs, { Dayjs } from "dayjs";
import Svg from "shared/components/icon/svg";

const { RangePicker } = DatePicker;

export default function DashboardOverview() {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs("2023-10-31"),
    dayjs("2024-10-31"),
  ]);

  // Dữ liệu mẫu cho biểu đồ
  const chartData = [
    { date: "25/10", value: 200 },
    { date: "26/10", value: 225 },
    { date: "27/10", value: 170 },
    { date: "28/10", value: 300 },
    { date: "29/10", value: 170 },
    { date: "30/10", value: 245 },
    { date: "31/10", value: 215 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

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
            <span className="text-gray-900 font-medium">Tổng quan</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto ">
        {/* Tabs */}
        <div
          aria-label="step-list"
          className="step-group -space-x-2 lg:-space-x-8 overflow-x-auto py-2"
        >
          <button className="step px-6 py-2 bg-blue-600 text-white rounded-full font-medium flex items-center gap-2">
            <Svg src="/icons/step_done.svg" width={16} height={16} className="lg:w-5 lg:h-5" />
            Báo cáo tổng quan
          </button>
          <button className="step px-6 py-2 bg-white text-gray-700 rounded-full font-medium border border-gray-300 hover:bg-gray-50">
            <Svg src="/icons/step_done.svg" width={16} height={16} className="lg:w-5 lg:h-5" />
            Thông tin tổng quan
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          {/* Tổng doanh thu */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMoneyBillWave className="text-green-600 text-2xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-normal mb-1">Tổng doanh thu</span>
                <div className="text-xl font-bold text-gray-600">200.000.000đ</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-normal mb-1">Tổng đơn hàng</span>
                <div className="text-xl font-bold text-gray-600">1.200</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTicketAlt className="text-pink-600 text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-normal mb-1">Tổng số vé</span>
                <div className="text-xl font-bold text-gray-600">1.500</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Tổng doanh thu</h2>
              <div className="text-2xl font-bold text-blue-600">124.150.000đ</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Thời gian</span>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
                format="DD/MM/YYYY"
                className="w-72"
              />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
              <span>300</span>
              <span>250</span>
              <span>200</span>
              <span>150</span>
              <span>100</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full flex items-end justify-between gap-4 pb-8">
              {chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t-sm relative group cursor-pointer hover:bg-blue-700 transition-colors"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
