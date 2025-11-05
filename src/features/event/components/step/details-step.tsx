import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "antd";
import RenderField from "../RenderField";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import InputMedia from "shared/components/input/input-media";
import clsx from "clsx";
import ModalSelectImage from "shared/components/modal/modal-image";
import Svg from "shared/components/icon/svg";

const Details: React.FC = () => {
  const methods = useFormContext();
  const organizersField = useFieldArray({ name: "organizers" });
  const descriptionsField = useFieldArray({ name: "descriptions" });
  const insertImage = () => {
    ModalSelectImage.open((file) => {
      const { onChange, name } = methods.register("fileName");
      onChange({ target: { value: file, name } });
    });
  };
  return (
    <div className="text-sm space-y-4">
      <ModalSelectImage />
      {/* Hình ảnh sự kiện + Ảnh email */}
      <div className="bg-white px-6 py-4 rounded-md">
        <div className="flex flex-wrap -mx-6">
          {/* Logo sự kiện */}
          <div className="px-6 flex flex-col items-start">
            <div className="label-text" aria-required>
              <b>Logo sự kiện</b>
            </div>
            <div className="block-image block-square w-[278px] mt-3">
              <InputMedia
                role="button"
                modal
                del
                className={clsx(
                  "w-full h-[278px] bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center",
                  methods.formState.errors.logo_url && "border-red-500"
                )}
                inputProps={methods.register(`logo_url`)}
                desc="Thêm mới logo sự kiện 200 x 200px (Tối đa 2MB)"
              />
            </div>
          </div>

          {/* Ảnh bìa sự kiện */}
          <div className="px-6 border-l border-gray-200 flex-1 flex flex-col">
            <div className="label-text" aria-required>
              <b>Ảnh bìa sự kiện</b>
            </div>
            <div className="relative w-full mt-3">
              <InputMedia
                modal
                role="button"
                del
                className={clsx(
                  "w-full h-[278px] bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center",
                  methods.formState.errors.wall_paper_url && "border-red-500"
                )}
                inputProps={methods.register(`wall_paper_url`)}
                desc="Kích thước tối ưu 1560x600px (Tối đa 3MB)"
              />
            </div>
          </div>

          {/* Ảnh nội dung email */}
          <div className="px-6 border-l border-gray-200 flex flex-col items-start">
            <div className="label-text">
              <b>Ảnh nội dung email</b>
            </div>
            <div className="block-image block-square w-[278px] mt-3">
              <InputMedia
                role="button"
                del
                modal
                className={clsx(
                  "w-full h-[278px] bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center"
                  // methods.formState.errors.race_extension?.content_image && "border-red-500"
                )}
                inputProps={methods.register(`email_image_url`)}
                desc="Thêm mới ảnh nội dung email (Tối đa 3MB)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Đơn vị tổ chức */}
      <div className="bg-white py-4 px-6 rounded-md">
        <div className="mb-6">
          <div className="font-bold mb-4">Đơn vị tổ chức</div>
          <div className="space-y-4">
            {organizersField.fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap gap-2 items-center">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => organizersField.remove(index)}
                  className="flex-shrink-0"
                />
                <div className="flex items-center gap-x-8">
                  <div className="flex items-center">
                    <div className="text-xs mr-5 font-medium">
                      Tên đơn vị tổ chức {index + 1} <span className="text-red-500">*</span>
                    </div>
                    <div className="relative">
                      <RenderField
                        name={`organizers.${index}.name`}
                        type="input"
                        placeholder="Tên đơn vị"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative w-56">
                    <Button
                      // outline
                      // variant="none"
                      // className={clsx(
                      //   "btn-xs gap-x-2 font-bold flex",
                      //   get(methods.formState.errors, fileName) && "text-red-500"
                      // )}
                      onClick={insertImage}
                    >
                      <Svg src="/icons/upload.svg" width={24} height={24} />
                      <span className="label-text text-current" aria-required>
                        Thêm logo
                      </span>
                    </Button>
                  </div>
                </div>
                {organizersField.fields.length === index + 1 && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => organizersField.append({ name: "", logo: null })}
                  >
                    Thêm đơn vị tổ chức
                  </Button>
                )}
              </div>
            ))}
            {!organizersField.fields.length && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => organizersField.append({ name: "", logo: null })}
              >
                Thêm đơn vị tổ chức
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mô tả sự kiện */}
      <div className="bg-white py-4 px-6 rounded-md">
        <div className="font-bold mb-4">Mô tả sự kiện</div>
        <div className="space-y-3">
          {descriptionsField.fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Mô tả {index + 1}</span>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => descriptionsField.remove(index)}
                />
              </div>
              <div className="space-y-3">
                <RenderField
                  name={`descriptions.${index}.title`}
                  type="input"
                  placeholder="Tiêu đề mô tả"
                  required
                />
                <RenderField
                  name={`descriptions.${index}.content`}
                  type="textarea"
                  placeholder="Nội dung mô tả chi tiết"
                  required
                  props={{ rows: 4 }}
                />
              </div>
            </div>
          ))}
          <div className="flex">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => descriptionsField.append({ title: "", content: "" })}
              className="ml-auto"
            >
              Thêm mô tả
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
