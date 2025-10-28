import React from "react";
import { Input, DatePicker, Select, Checkbox, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
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
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const shows = watch("shows") || [
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
  ];

  const addTicket = (showId: number): void => {
    const newShows = shows.map((show: any) => {
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
    });
    setValue("shows", newShows, { shouldDirty: true });
  };

  const addShow = (): void => {
    const newShows = [
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
    ];
    setValue("shows", newShows, { shouldDirty: true });
  };

  const deleteShow = (showId: number): void => {
    const newShows = shows.filter((show: any) => show.id !== showId);
    setValue("shows", newShows, { shouldDirty: true });
  };

  const deleteTicket = (showId: number, ticketId: number): void => {
    const newShows = shows.map((show: any) => {
      if (show.id === showId) {
        return {
          ...show,
          tickets: show.tickets.filter((ticket: any) => ticket.id !== ticketId),
        };
      }
      return show;
    });
    setValue("shows", newShows, { shouldDirty: true });
  };

  return (
    <div className=" bg-gray-50">
      <div className="">
        {shows.map((show: any) => (
          <div key={show.id} className="bg-white rounded-lg shadow-sm mb-6 relative">
            {/* Header */}
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Tên suất diễn <span className="text-red-500">*</span>
                </label>
                <Controller
                  name={`shows.${shows.findIndex((s: any) => s.id === show.id)}.name`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Day 1" className="max-w-md" />
                  )}
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
                <Controller
                  name={`shows.${shows.findIndex((s: any) => s.id === show.id)}.timeRange`}
                  control={control}
                  render={({ field }) => (
                    <RangePicker
                      {...field}
                      showTime
                      format="HH:mm:ss - DD/MM/YYYY"
                      placeholder={["Từ", "Đến"]}
                      className="flex-1"
                    />
                  )}
                />
              </div>
            </div>

            {/* Tickets Section */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Loại vé</h3>

              {show.tickets.map((ticket: any, ticketIndex: number) => {
                const showIndex = shows.findIndex((s: any) => s.id === show.id);
                return (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 mb-4">
                    {/* Ticket Name and Code */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên vé <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.name`}
                          control={control}
                          render={({ field }) => <Input {...field} placeholder="Nhập tên vé" />}
                        />
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unique code <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name={`shows.${showIndex}.tickets.${ticketIndex}.uniqueCode`}
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Nhập mã" />}
                          />
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá vé
                        </label>
                        <div className="flex gap-2">
                          <Controller
                            name={`shows.${showIndex}.tickets.${ticketIndex}.currency`}
                            control={control}
                            render={({ field }) => (
                              <Select {...field} className="w-24">
                                <Select.Option value="VND">VND</Select.Option>
                                <Select.Option value="USD">USD</Select.Option>
                              </Select>
                            )}
                          />
                          <Controller
                            name={`shows.${showIndex}.tickets.${ticketIndex}.isFree`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Checkbox
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                              >
                                Miễn phí
                              </Checkbox>
                            )}
                          />
                        </div>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.price`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              prefix={<span className="text-red-500">*</span>}
                              className="mt-2"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tổng số lượng vé
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.totalTickets`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              prefix={<span className="text-red-500">*</span>}
                              className="mt-9"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng vé tối thiểu trong một đơn hàng
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.minPerOrder`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              prefix={<span className="text-red-500">*</span>}
                              className="mt-9"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số lượng vé tối đa trong một đơn hàng
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.maxPerOrder`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              prefix={<span className="text-red-500">*</span>}
                              className="mt-9"
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Sale Period */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày bắt đầu bán <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.startDate`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              showTime
                              format="HH:mm:ss - DD/MM/YYYY"
                              placeholder="hh:mm:ss - dd/mm/yyy"
                              className="w-full"
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày ngừng bán <span className="text-red-500">*</span>
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.endDate`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              showTime
                              format="HH:mm:ss - DD/MM/YYYY"
                              placeholder="hh:mm:ss - dd/mm/yyy"
                              className="w-full"
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Description and Image Upload */}
                    <div className="grid grid-cols-[1fr,300px] gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả vé
                        </label>
                        <Controller
                          name={`shows.${showIndex}.tickets.${ticketIndex}.description`}
                          control={control}
                          render={({ field }) => (
                            <TextArea {...field} rows={4} placeholder="Nhập mô tả" />
                          )}
                        />
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
                );
              })}

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
