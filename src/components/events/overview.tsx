import React from "react";
import { Card, Form, Input, Select, Switch, DatePicker, Checkbox, Radio } from "antd";
import locale from "antd/lib/date-picker/locale/vi_VN";

const { TextArea } = Input;

const Overview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        className="bg-white shadow-sm rounded-lg col-span-1 lg:col-span-1"
        title="Thông tin chung"
      >
        <Form layout="vertical">
          <Form.Item label="Tên sự kiện">
            <Input placeholder="Nhập vào tên sự kiện" />
          </Form.Item>

          <Form.Item label="Loại sự kiện">
            <Select placeholder="Nhập vào tên sự kiện" options={[]} />
          </Form.Item>

          <Form.Item label="Blacklist">
            <Input placeholder="Email hoặc sdt" />
            <div className="text-xs text-gray-400 mt-1">
              Email hoặc số điện thoại của người mà bạn muốn từ chối phục vụ trong sự kiện.
            </div>
          </Form.Item>

          <Form.Item label="Địa điểm diễn ra">
            <Input placeholder="Nhập vào tên sự kiện" />
          </Form.Item>

          <div className="flex gap-3">
            <Form.Item label="Hotline" className="flex-1">
              <Input placeholder="0987654321" />
            </Form.Item>
            <Form.Item label="Mã sự kiện" className="w-40">
              <Input placeholder="6 kí tự" />
            </Form.Item>
          </div>

          <Form.Item label="Slug của sự kiện">
            <Input placeholder="Nhập vào tên sự kiện" />
          </Form.Item>

          <Form.Item label="Cho phép mua vé theo nhóm">
            <Switch />
          </Form.Item>
        </Form>
      </Card>

      <div className="col-span-1 lg:col-span-1">
        <Card className="bg-white shadow-sm rounded-lg" title="Mốc thời gian">
          <Form layout="vertical">
            <Form.Item label="Thời gian diễn ra">
              <DatePicker showTime placeholder="dd/mm/yyyy" locale={locale} className="w-full" />
            </Form.Item>

            <Form.Item label="Thời gian kết thúc">
              <DatePicker showTime placeholder="dd/mm/yyyy" locale={locale} className="w-full" />
            </Form.Item>

            <Form.Item label="Thời gian thay đổi thông tin">
              <DatePicker showTime placeholder="dd/mm/yyyy" locale={locale} className="w-full" />
            </Form.Item>

            <Form.Item label="Thời gian mở checkin">
              <DatePicker showTime placeholder="dd/mm/yyyy" locale={locale} className="w-full" />
            </Form.Item>
          </Form>
        </Card>

        <Card className="bg-white shadow-sm rounded-lg mt-6" title="Phương thức thanh toán">
          <Form layout="vertical">
            <Form.Item>
              <Radio.Group>
                <Radio value="auto">Thanh toán tự động qua trung gian thanh toán</Radio>
                <div className="text-xs text-gray-400 ml-6">
                  Vé sẽ được gửi về tài khoản của người tổ chức khi thanh toán thành công
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Chọn tất cả">
              <Checkbox>Quét QR chuyển khoản ngân hàng - PayX QR</Checkbox>
            </Form.Item>

            <div className="grid grid-cols-1 gap-2">
              <Checkbox>PayX thẻ ATM nội địa</Checkbox>
              <Checkbox>PayX thẻ Quốc tế</Checkbox>
              <Checkbox>Quét QR chuyển khoản ngân hàng</Checkbox>
              <Checkbox>Thẻ ATM nội địa</Checkbox>
              <Checkbox>Thẻ tín dụng/ghi nợ</Checkbox>
            </div>
          </Form>
        </Card>
      </div>

      <div className="col-span-1 lg:col-span-1" />
    </div>
  );
};

export default Overview;
