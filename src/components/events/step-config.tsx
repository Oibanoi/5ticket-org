import React from "react";
import { Input, Select, Switch, Button, Collapse } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

type FieldType = "text" | "select";

interface InfoField {
  id: number;
  name: string;
  type: FieldType;
  defaultValue: string;
  note: string;
  attachment: string;
  required: boolean;
  options?: string;
}

interface Category {
  id: number;
  name: string;
  fields: InfoField[];
  expanded: boolean;
}

const StepConfig: React.FC = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const categories = watch('categories') || [
    {
      id: 1,
      name: "Cat 1",
      expanded: true,
      fields: [
        {
          id: 1,
          name: "Default",
          type: "text",
          defaultValue: "",
          note: "",
          attachment: "",
          required: true,
        },
      ],
    },
    {
      id: 2,
      name: "Cat 2",
      expanded: true,
      fields: [
        {
          id: 1,
          name: "Default",
          type: "text",
          defaultValue: "",
          note: "",
          attachment: "",
          required: true,
        },
        {
          id: 2,
          name: "Default",
          type: "select",
          defaultValue: "",
          note: "",
          attachment: "",
          required: true,
          options: "",
        },
        {
          id: 3,
          name: "Default",
          type: "text",
          defaultValue: "",
          note: "",
          attachment: "",
          required: false,
        },
      ],
    },
    {
      id: 3,
      name: "Cat 3",
      expanded: false,
      fields: [],
    },
    {
      id: 4,
      name: "Cat 4",
      expanded: false,
      fields: [],
    },
  ];

  const addField = (categoryId: number): void => {
    const newCategories = categories.map((cat: any) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          fields: [
            ...cat.fields,
            {
              id: Date.now(),
              name: "Default",
              type: "text",
              defaultValue: "",
              note: "",
              attachment: "",
              required: true,
            },
          ],
        };
      }
      return cat;
    });
    setValue('categories', newCategories, { shouldDirty: true });
  };

  const deleteField = (categoryId: number, fieldId: number): void => {
    const newCategories = categories.map((cat: any) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          fields: cat.fields.filter((field: any) => field.id !== fieldId),
        };
      }
      return cat;
    });
    setValue('categories', newCategories, { shouldDirty: true });
  };

  const updateField = (categoryId: number, fieldId: number, updates: Partial<InfoField>): void => {
    const newCategories = categories.map((cat: any) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          fields: cat.fields.map((field: any) =>
            field.id === fieldId ? { ...field, ...updates } : field
          ),
        };
      }
      return cat;
    });
    setValue('categories', newCategories, { shouldDirty: true });
  };

  const toggleCategory = (categoryId: number): void => {
    const newCategories = categories.map((cat: any) => 
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    );
    setValue('categories', newCategories, { shouldDirty: true });
  };

  return (
    <div className="  px-6 py-4 bg-gray-50 shadow-sm border border-gray-200">
      <div className="">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Cấu hình trường thông tin</h1>

        <div className="space-y-4 ">
          {categories.map((category) => (
            <div key={category.id} className=" rounded-lg ">
              {/* Category Header */}
              <div
                className="flex gap-2 items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category.id)}
              >
                <h2 className="text-base font-semibold text-gray-900 whitespace-nowrap">
                  {category.name}
                </h2>
                <hr className="w-full h-px border-t border-current" />
                <Button
                  type="text"
                  icon={category.expanded ? <UpOutlined /> : <DownOutlined />}
                  size="small"
                />
              </div>

              {/* Category Content */}
              {category.expanded && (
                <div className="p-6 space-y-6">
                  {category.fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                      {/* Field Header Row */}
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên trường thông tin <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={field.name}
                            placeholder="Default"
                            onChange={(e) =>
                              updateField(category.id, field.id, { name: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại thông tin <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={field.type}
                            className="w-full"
                            onChange={(value) =>
                              updateField(category.id, field.id, { type: value as FieldType })
                            }
                          >
                            <Select.Option value="text">Nhập text</Select.Option>
                            <Select.Option value="select">Lựa chọn</Select.Option>
                          </Select>
                        </div>
                        <div className="col-span-6 flex items-center gap-3">
                          <label className="text-sm font-medium text-gray-700">
                            Bắt buộc <span className="text-red-500">*</span>
                          </label>
                          <Switch
                            checked={field.required}
                            onChange={(checked) =>
                              updateField(category.id, field.id, { required: checked })
                            }
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => deleteField(category.id, field.id)}
                          />
                        </div>
                      </div>

                      {/* Options field for select type */}
                      {field.type === "select" && (
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-11">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lựa chọn <span className="text-red-500">*</span>
                            </label>
                            <Input
                              placeholder="Nhập vào các lựa chọn"
                              value={field.options}
                              onChange={(e) =>
                                updateField(category.id, field.id, { options: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* Default Value and Note Row */}
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá trị mặc định{" "}
                            {field.type === "select" && <span className="text-red-500">*</span>}
                          </label>
                          <Input
                            placeholder="Nhập giá trị mặc định"
                            value={field.defaultValue}
                            onChange={(e) =>
                              updateField(category.id, field.id, { defaultValue: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-span-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                          </label>
                          <Input
                            placeholder="Nhập ghi chú"
                            value={field.note}
                            onChange={(e) =>
                              updateField(category.id, field.id, { note: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Attachment Row */}
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ảnh đính kèm
                          </label>
                          <Input
                            placeholder="Nhập hypertext"
                            value={field.attachment}
                            onChange={(e) =>
                              updateField(category.id, field.id, { attachment: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-span-6 flex items-end">
                          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </div>
                      </div>

                      {/* Divider between fields */}
                      {index < category.fields.length - 1 && (
                        <div className="border-t border-gray-200 pt-6" />
                      )}
                    </div>
                  ))}

                  {/* Add Field Button */}
                  <Button
                    type="default"
                    icon={<PlusOutlined />}
                    onClick={() => addField(category.id)}
                    className="w-full border-2 border-dashed h-10 text-gray-600 mt-4"
                  >
                    Trường thông tin mới
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepConfig;
