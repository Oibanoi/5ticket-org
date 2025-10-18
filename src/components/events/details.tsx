import React from "react";
import { Card, Button, Input, Upload, Form } from "antd";
import Svg from "shared/components/icon/svg";

const { TextArea } = Input;

const UploadBox: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="p-4 border rounded bg-gray-50 flex flex-col items-center justify-center h-36">
    <div className="mb-2 text-sm font-medium">{title}</div>
    <div className="mb-3 text-xs text-gray-400">{hint}</div>
    <Button type="default">+ Tải ảnh lên</Button>
  </div>
);

const DescriptionBlock: React.FC = () => {
  return (
    <div className="border border-dashed rounded p-4 mb-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <Input placeholder="Tiêu đề" className="max-w-xs" />
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded border">▲</button>
          <button className="px-2 py-1 rounded border">✖</button>
        </div>
      </div>
      <div className="border rounded p-2">
        {/* toolbar placeholder */}
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <span>Normal text</span>
          <span className="mx-2">|</span>
          <button className="px-2 py-1 border rounded">B</button>
          <button className="px-2 py-1 border rounded">I</button>
          <button className="px-2 py-1 border rounded">U</button>
        </div>
        <TextArea rows={6} placeholder="Nhập mô tả..." />
      </div>
    </div>
  );
};

const Details: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm rounded">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UploadBox title="Ảnh bìa sự kiện" hint="Kích thước tối ưu 1440x864px (Tối đa 3MB)" />
          <UploadBox title="Logo sự kiện" hint="Thêm mới logo sự kiện 200 x 200px (Tối đa 2MB)" />
          <UploadBox title="Ảnh kèm mail" hint="1560x600px (Tối đa 2MB)" />
        </div>

        <div className="mt-6">
          <Form layout="inline">
            <Form.Item label="Đơn vị tổ chức">
              <Input placeholder="Tên đơn vị tổ chức" />
            </Form.Item>
            <Form.Item>
              <Button icon={<Svg src="/icons/upload.svg" width={16} height={16} />}>
                Thêm logo
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default">+ Thêm đơn vị tổ chức</Button>
            </Form.Item>
          </Form>
        </div>
      </Card>

      <Card className="bg-white shadow-sm rounded">
        <div>
          <div className="mb-4">Mô tả</div>
          <DescriptionBlock />
          <DescriptionBlock />

          <div className="text-center mt-4">
            <Button type="default">+ Thêm mô tả</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Details;
