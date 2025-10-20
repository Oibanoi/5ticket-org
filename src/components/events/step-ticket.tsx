import React, { useState } from "react";
import { Input, DatePicker, Select, Checkbox, Button } from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Ticket {
  id: number;
  name: string;
  uniqueCode: string;
  price: number;
  currency: "VND" | "USD";
  isFree: boolean;
  totalTickets: number;
  minPerOrder: number;
  maxPerOrder: number;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  description: string;
}

interface Show {
  id: number;
  name: string;
  timeRange: [Dayjs | null, Dayjs | null];
  tickets: Ticket[];
}

const StepTicket: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([
    {
      id: 1,
      name: "Day 1",
      timeRange: [null, null],
      tickets: [
        {
          id: 1,
          name: "",
          uniqueCode: "",
          price: 0,
          currency: "VND",
          isFree: false,
          totalTickets: 0,
          minPerOrder: 1,
          maxPerOrder: 0,
          startDate: null,
          endDate: null,
          description: "",
        },
      ],
    },
  ]);

  const addTicket = (showId: number): void => {
    setShows(
      shows.map((show) => {
        if (show.id === showId) {
          return {
            ...show,
            tickets: [
              ...show.tickets,
              {
                id: Date.now(),
                name: "",
                uniqueCode: "",
                price: 0,
                currency: "VND",
                isFree: false,
                totalTickets: 0,
                minPerOrder: 1,
                maxPerOrder: 0,
                startDate: null,
                endDate: null,
                description: "",
              },
            ],
          };
        }
        return show;
      })
    );
  };

  const addShow = (): void => {
    setShows([
      ...shows,
      {
        id: Date.now(),
        name: `Day ${shows.length + 1}`,
        timeRange: [null, null],
        tickets: [
          {
            id: Date.now(),
            name: "",
            uniqueCode: "",
            price: 0,
            currency: "VND",
            isFree: false,
            totalTickets: 0,
            minPerOrder: 1,
            maxPerOrder: 0,
            startDate: null,
            endDate: null,
            description: "",
          },
        ],
      },
    ]);
  };

  const deleteShow = (showId: number): void => {
    setShows(shows.filter((show) => show.id !== showId));
  };

  const deleteTicket = (showId: number, ticketId: number): void => {
    setShows(
      shows.map((show) => {
        if (show.id === showId) {
          return {
            ...show,
            tickets: show.tickets.filter((ticket) => ticket.id !== ticketId),
          };
        }
        return show;
      })
    );
  };

  return (
    <div className=" bg-gray-50">
      <div className="">
        {shows.map((show) => (
          <div key={show.id} className="bg-white rounded-lg shadow-sm mb-6 relative">
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Tên suất diễn <span className="text-red-500">*</span>
                </label>
                <Input
                  value={show.name}
                  placeholder="Day 1"
                  className="max-w-md"
                  onChange={(e) => {
                    setShows(
                      shows.map((s) => (s.id === show.id ? { ...s, name: e.target.value } : s))
                    );
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button icon={<UpOutlined />} type="text" />
                <Button icon={<CloseOutlined />} type="text" onClick={() => deleteShow(show.id)} />
              </div>
            </div>

            {/* Time Range */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Thời gian diễn ra <span className="text-red-500">*</span>
                </label>
                <RangePicker
                  showTime
                  format="HH:mm:ss - DD/MM/YYYY"
                  placeholder={["Từ", "Đến"]}
                  className="flex-1"
                  value={show.timeRange}
                  onChange={(dates) => {
                    setShows(
                      shows.map((s) =>
                        s.id === show.id
                          ? { ...s, timeRange: dates as [Dayjs | null, Dayjs | null] }
                          : s
                      )
                    );
                  }}
                />
              </div>
            </div>

            {/* Tickets Section */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Loại vé</h3>

              {show.tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                  {/* Ticket Name and Code */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên vé <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Nhập tên vé" />
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unique code <span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Nhập mã" />
                      </div>
                      <Button icon={<UpOutlined />} type="text" />
                      <Button icon={<SaveOutlined />} type="text" />
                      <Button icon={<EditOutlined />} type="text" />
                      <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => deleteTicket(show.id, ticket.id)}
                      />
                    </div>
                  </div>

                  {/* Price and Quantities */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giá vé</label>
                      <div className="flex gap-2">
                        <Select defaultValue="VND" className="w-24">
                          <Select.Option value="VND">VND</Select.Option>
                          <Select.Option value="USD">USD</Select.Option>
                        </Select>
                        <Checkbox>Miễn phí</Checkbox>
                      </div>
                      <Input
                        type="number"
                        defaultValue={0}
                        prefix={<span className="text-red-500">*</span>}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tổng số lượng vé
                      </label>
                      <Input
                        type="number"
                        defaultValue={0}
                        prefix={<span className="text-red-500">*</span>}
                        className="mt-9"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng vé tối thiểu trong một đơn hàng
                      </label>
                      <Input
                        type="number"
                        defaultValue={1}
                        prefix={<span className="text-red-500">*</span>}
                        className="mt-9"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng vé tối đa trong một đơn hàng
                      </label>
                      <Input
                        type="number"
                        defaultValue={0}
                        prefix={<span className="text-red-500">*</span>}
                        className="mt-9"
                      />
                    </div>
                  </div>

                  {/* Sale Period */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày bắt đầu bán <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        showTime
                        format="HH:mm:ss - DD/MM/YYYY"
                        placeholder="hh:mm:ss - dd/mm/yyy"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày ngừng bán <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        showTime
                        format="HH:mm:ss - DD/MM/YYYY"
                        placeholder="hh:mm:ss - dd/mm/yyy"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Description and Image Upload */}
                  <div className="grid grid-cols-[1fr,300px] gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả vé
                      </label>
                      <TextArea rows={4} placeholder="Nhập mô tả" />
                    </div>
                    <div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <Button icon={<PlusOutlined />} type="default" size="large">
                          Thêm ảnh vé
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Tỉ lệ 1:1 (kích thước tối đa 1MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Ticket Button */}
              <Button
                type="default"
                icon={<PlusOutlined />}
                onClick={() => addTicket(show.id)}
                className="w-full border-2 border-dashed h-12 text-gray-600"
              >
                Tạo loại vé mới
              </Button>
            </div>
          </div>
        ))}

        {/* Add Show Button */}
        <div className="text-center">
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={addShow}
            size="large"
            className="border-2 border-dashed"
          >
            Thêm suất diễn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTicket;
