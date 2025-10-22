"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import Svg from "shared/components/icon/svg";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  preview?: boolean;
  className?: string;
}

export default function FileUploader({
  onFilesChange,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  preview = true,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange(newFiles);

      if (preview) {
        const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxFiles));
      }
    },
    [files, maxFiles, onFilesChange, preview]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onFilesChange(newFiles);

      if (preview) {
        URL.revokeObjectURL(previews[index]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [files, previews, onFilesChange, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          {
            "border-blue-400 bg-blue-50": isDragActive,
            "border-gray-300 hover:border-gray-400": !isDragActive,
          }
        )}
      >
        <input {...getInputProps()} />
        <Svg
          src="/icons/upload.svg"
          width={48}
          height={48}
          className="mx-auto mb-4 text-gray-400"
        />
        <p className="text-sm text-gray-600">
          {isDragActive ? "Thả file vào đây..." : "Kéo thả file hoặc click để chọn"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tối đa {maxFiles} file, mỗi file không quá {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {preview && previews[index] && (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Svg src="/icons/trash.svg" width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
