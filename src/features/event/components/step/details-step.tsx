import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import InputMedia from "shared/components/input/input-media";
import clsx from "clsx";
import ModalSelectImage from "shared/components/modal/modal-image";
import Svg from "shared/components/icon/svg";
import RenderField from "../RenderField";

type Organizer = {
  name: string;
  logo: string | null;
};

const Details: React.FC = () => {
  const { getValues, setValue, formState, register, watch } = useFormContext();

  const descriptionsField = useFieldArray({ name: "descriptions" });
  const [organizationalUnits, setOrganizationalUnits] = useState<Organizer[]>([]);
  const initValues = watch("organizational_units");
  // ✅ Lấy giá trị ban đầu từ form (string → object[])
  useEffect(() => {
    const init = initValues || getValues("organizational_units");
    console.log("init", init);
    try {
      const parsed = init ? JSON.parse(init) : [];
      if (Array.isArray(parsed)) {
        setOrganizationalUnits(parsed);
      } else {
        setOrganizationalUnits([]);
        setValue("organizational_units", "[]");
      }
    } catch {
      setOrganizationalUnits([]);
      setValue("organizational_units", "[]");
    }
  }, [initValues, getValues, setValue]);

  // ✅ Đồng bộ state → form field (string)
  const updateFormValue = (list: Organizer[]) => {
    setOrganizationalUnits(list);
    console.log("updateFormValue", JSON.stringify(list));
    setValue("organizational_units", JSON.stringify(list));
  };

  // ✅ Thêm / xóa / sửa đơn vị
  const handleAdd = () => updateFormValue([...organizationalUnits, { name: "", logo: null }]);
  const handleRemove = (index: number) =>
    updateFormValue(organizationalUnits.filter((_, i) => i !== index));

  const handleChangeName = (index: number, name: string) => {
    const newList = organizationalUnits.map((o, i) => (i === index ? { ...o, name } : o));
    updateFormValue(newList);
  };

  const handleChangeLogo = (index: number, logo: string) => {
    const newList = organizationalUnits.map((o, i) => (i === index ? { ...o, logo } : o));
    updateFormValue(newList);
  };

  // ✅ Hàm chọn ảnh qua modal
  const insertImage = () => {
    ModalSelectImage.open((file) => {
      // const { onChange, name } = methods.register("fileName");
      // onChange({ target: { value: file, name } });
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
                  formState.errors.logo_url && "border-red-500"
                )}
                inputProps={register(`logo_url`)}
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
                  formState.errors.wall_paper_url && "border-red-500"
                )}
                inputProps={register(`wall_paper_url`)}
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
                className="w-full h-[278px] bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center"
                inputProps={register(`email_image_url`)}
                desc="Thêm mới ảnh nội dung email (Tối đa 3MB)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Đơn vị tổ chức */}
      <div className="bg-white py-4 px-6 rounded-md">
        <div className="mb-6">
          <div className="font-bold mb-4">Đơn vị tổ chức</div>
          <div className="space-y-4">
            {organizationalUnits.map((org, index) => (
              <div key={index} className="flex flex-wrap gap-2 items-center">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0"
                />
                <div className="flex items-center gap-x-8">
                  <div className="flex items-center">
                    <div className="text-xs mr-5 font-medium">
                      Tên đơn vị tổ chức {index + 1} <span className="text-red-500">*</span>
                    </div>
                    <Input
                      placeholder="Tên đơn vị"
                      value={org.name}
                      onChange={(e) => handleChangeName(index, e.target.value)}
                    />
                  </div>
                  <div className="relative w-56 flex items-center gap-2">
                    <Button onClick={() => insertImage()}>
                      <Svg src="/icons/upload.svg" width={24} height={24} />
                      <span className="label-text text-current">Thêm logo</span>
                    </Button>
                    {org.logo && (
                      <img
                        src={org.logo}
                        alt="Logo"
                        className="w-10 h-10 object-contain rounded border"
                      />
                    )}
                  </div>
                </div>
                {organizationalUnits.length === index + 1 && (
                  <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm đơn vị tổ chức
                  </Button>
                )}
              </div>
            ))}

            {!organizationalUnits.length && (
              <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd}>
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
