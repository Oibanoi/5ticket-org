import React from "react";
import { Card, Button, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import FileUploader from "shared/components/ui/FileUploader";
import Svg from "shared/components/icon/svg";
import { useFileUpload } from "features/event/hooks/useFileUpload";

const { TextArea } = Input;

interface UploadBoxProps {
  title: string;
  hint?: string;
  name: string;
  accept?: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({ title, hint, name }) => {
  const { setValue } = useFormContext();
  const { uploadFiles } = useFileUpload({
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/*"],
  });

  const handleFilesChange = async (files: File[]) => {
    if (files.length > 0) {
      try {
        const uploadedFiles = await uploadFiles(files);
        if (uploadedFiles) {
          setValue(name, uploadedFiles, { shouldDirty: true });
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-gray-400 mb-2">{hint}</div>
      <FileUploader
        onFilesChange={handleFilesChange}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        className="h-32"
      />
    </div>
  );
};

interface DescriptionBlockProps {
  index: number;
  onRemove: () => void;
  onMoveUp: () => void;
}

const DescriptionBlock: React.FC<DescriptionBlockProps> = ({ index, onRemove, onMoveUp }) => {
  const { control } = useFormContext();

  return (
    <div className="border border-dashed rounded p-4 mb-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <Controller
          name={`descriptions.${index}.title`}
          control={control}
          render={({ field }) => <Input {...field} placeholder="Tiêu đề" className="max-w-xs" />}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            className="px-2 py-1 rounded border hover:bg-gray-50"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-2 py-1 rounded border hover:bg-red-50 text-red-600"
          >
            ✖
          </button>
        </div>
      </div>
      <div className="border rounded p-2">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <span>Normal text</span>
          <span className="mx-2">|</span>
          <button type="button" className="px-2 py-1 border rounded">
            B
          </button>
          <button type="button" className="px-2 py-1 border rounded">
            I
          </button>
          <button type="button" className="px-2 py-1 border rounded">
            U
          </button>
        </div>
        <Controller
          name={`descriptions.${index}.content`}
          control={control}
          render={({ field }) => <TextArea {...field} rows={6} placeholder="Nhập mô tả..." />}
        />
      </div>
    </div>
  );
};

const Details: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const descriptions = watch("descriptions") || [{ title: "", content: "" }];
  const organizers = watch("organizers") || [{ name: "", logo: null }];
  const { uploadFiles } = useFileUpload({ maxSize: 2 * 1024 * 1024 });

  const addDescription = () => {
    setValue("descriptions", [...descriptions, { title: "", content: "" }], { shouldDirty: true });
  };

  const removeDescription = (index: number) => {
    const newDescriptions = descriptions.filter((_: any, i: number) => i !== index);
    setValue("descriptions", newDescriptions, { shouldDirty: true });
  };

  const moveDescriptionUp = (index: number) => {
    if (index > 0) {
      const newDescriptions = [...descriptions];
      [newDescriptions[index - 1], newDescriptions[index]] = [
        newDescriptions[index],
        newDescriptions[index - 1],
      ];
      setValue("descriptions", newDescriptions, { shouldDirty: true });
    }
  };

  const addOrganizer = () => {
    setValue("organizers", [...organizers, { name: "", logo: null }], { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm rounded">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UploadBox
            name="coverImage"
            title="Ảnh bìa sự kiện"
            hint="Kích thước tối ưu 1440x864px (Tối đa 3MB)"
          />
          <UploadBox
            name="logoImage"
            title="Logo sự kiện"
            hint="Thêm mới logo sự kiện 200 x 200px (Tối đa 2MB)"
          />
          <UploadBox name="emailImage" title="Ảnh kèm mail" hint="1560x600px (Tối đa 2MB)" />
        </div>
        {errors.images && (
          <div className="text-red-500 text-xs mt-2">{errors.images.message as string}</div>
        )}

        <div className="mt-6 space-y-4">
          {organizers.map((organizer: any, index: number) => (
            <div key={index} className="border rounded p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn vị tổ chức
                  </label>
                  <Controller
                    name={`organizers.${index}.name`}
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Tên đơn vị tổ chức" />}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`organizer-logo-${index}`}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        try {
                          const uploadedFiles = await uploadFiles(files);
                          if (uploadedFiles) {
                            const newOrganizers = [...organizers];
                            newOrganizers[index].logo = uploadedFiles[0];
                            setValue("organizers", newOrganizers, { shouldDirty: true });
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                        }
                      }
                    }}
                  />
                  <Button
                    icon={<Svg src="/icons/upload.svg" width={16} height={16} />}
                    onClick={() => document.getElementById(`organizer-logo-${index}`)?.click()}
                  >
                    Thêm logo
                  </Button>
                  {index > 0 && (
                    <Button
                      danger
                      onClick={() => {
                        const newOrganizers = organizers.filter((_: any, i: number) => i !== index);
                        setValue("organizers", newOrganizers, { shouldDirty: true });
                      }}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button type="default" onClick={addOrganizer}>
            + Thêm đơn vị tổ chức
          </Button>
        </div>
      </Card>

      <Card className="bg-white shadow-sm rounded">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium">Mô tả</h3>
            {errors.description && (
              <div className="text-red-500 text-xs">{errors.description.message as string}</div>
            )}
          </div>

          {descriptions.map((desc: any, index: number) => (
            <DescriptionBlock
              key={index}
              index={index}
              onRemove={() => removeDescription(index)}
              onMoveUp={() => moveDescriptionUp(index)}
            />
          ))}

          <div className="text-center mt-4">
            <Button type="default" onClick={addDescription}>
              + Thêm mô tả
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Details;
