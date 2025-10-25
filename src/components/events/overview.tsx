import dayjs from "dayjs";
import React from "react";
import { Card, Input, Select, Switch, DatePicker, Checkbox, Radio } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const Overview: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        className="bg-white shadow-sm rounded-lg col-span-1 lg:col-span-1"
        title="Thông tin chung"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sự kiện <span className="text-red-500">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập vào tên sự kiện"
                  status={errors.title ? "error" : ""}
                />
              )}
            />
            {errors.title && (
              <div className="text-red-500 text-xs mt-1">{errors.title.message as string}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại sự kiện <span className="text-red-500">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Chọn loại sự kiện"
                  className="w-full"
                  status={errors.category ? "error" : ""}
                  options={[
                    { value: "conference", label: "Hội nghị" },
                    { value: "concert", label: "Hòa nhạc" },
                    { value: "workshop", label: "Workshop" },
                  ]}
                />
              )}
            />
            {errors.category && (
              <div className="text-red-500 text-xs mt-1">{errors.category.message as string}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blacklist</label>
            <Controller
              name="blacklist"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Email hoặc sdt" />}
            />
            <div className="text-xs text-gray-400 mt-1">
              Email hoặc số điện thoại của người mà bạn muốn từ chối phục vụ trong sự kiện.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa điểm diễn ra <span className="text-red-500">*</span>
            </label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập địa điểm"
                  status={errors.location ? "error" : ""}
                />
              )}
            />
            {errors.location && (
              <div className="text-red-500 text-xs mt-1">{errors.location.message as string}</div>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotline</label>
              <Controller
                name="hotline"
                control={control}
                render={({ field }) => <Input {...field} placeholder="0987654321" />}
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã sự kiện</label>
              <Controller
                name="eventCode"
                control={control}
                render={({ field }) => <Input {...field} placeholder="6 kí tự" maxLength={6} />}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug của sự kiện</label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => <Input {...field} placeholder="slug-su-kien" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Cho phép mua vé theo nhóm</label>
            <Controller
              name="allowGroupBooking"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch checked={value} onChange={onChange} />
              )}
            />
          </div>
        </div>
      </Card>

      <div className="col-span-1 lg:col-span-1">
        <Card className="bg-white shadow-sm rounded-lg" title="Mốc thời gian">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian diễn ra <span className="text-red-500">*</span>
              </label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    showTime
                    placeholder="dd/mm/yyyy"
                    className="w-full"
                    status={errors.startDate ? "error" : ""}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                  />
                )}
              />
              {errors.startDate && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.startDate.message as string}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian kết thúc <span className="text-red-500">*</span>
              </label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    showTime
                    placeholder="dd/mm/yyyy"
                    className="w-full"
                    status={errors.endDate ? "error" : ""}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                  />
                )}
              />
              {errors.endDate && (
                <div className="text-red-500 text-xs mt-1">{errors.endDate.message as string}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian thay đổi thông tin
              </label>
              <Controller
                name="changeInfoDeadline"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    showTime
                    placeholder="dd/mm/yyyy"
                    className="w-full"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian mở checkin
              </label>
              <Controller
                name="checkinTime"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    showTime
                    placeholder="dd/mm/yyyy"
                    className="w-full"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                  />
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm rounded-lg mt-6" title="Phương thức thanh toán">
          <div className="space-y-4">
            <div>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field}>
                    <Radio value="auto">Thanh toán tự động qua trung gian thanh toán</Radio>
                    <div className="text-xs text-gray-400 ml-6">
                      Vé sẽ được gửi về tài khoản của người tổ chức khi thanh toán thành công
                    </div>
                  </Radio.Group>
                )}
              />
            </div>

            <div>
              <Controller
                name="selectAllPayments"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)}>
                    Chọn tất cả
                  </Checkbox>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {[
                { key: "payxQr", label: "Quét QR chuyển khoản ngân hàng - PayX QR" },
                { key: "payxAtm", label: "PayX thẻ ATM nội địa" },
                { key: "payxIntl", label: "PayX thẻ Quốc tế" },
                { key: "bankQr", label: "Quét QR chuyển khoản ngân hàng" },
                { key: "atmCard", label: "Thẻ ATM nội địa" },
                { key: "creditCard", label: "Thẻ tín dụng/ghi nợ" },
              ].map(({ key, label }) => (
                <Controller
                  key={key}
                  name={`paymentOptions.${key}`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)}>
                      {label}
                    </Checkbox>
                  )}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
