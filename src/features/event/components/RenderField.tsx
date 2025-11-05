import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { renderField } from "./form-field-helper";

interface FieldConfig {
  name: string;
  label?: string;
  type:
    | "input"
    | "select"
    | "date"
    | "switch"
    | "checkbox"
    | "radio"
    | "textarea"
    | "number"
    | "checkboxGroup"
    | "upload"
    | "inputTag";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
  props?: Record<string, any>;
}

const RenderField: React.FC<FieldConfig> = ({
  name,
  label,
  type,
  required,
  placeholder,
  options,
  description,
  props = {},
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const showError = Boolean(error);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const fieldElement = renderField(type, {
            ...field,
            ...props,
            type,
            placeholder,
            options,
            status: showError ? "error" : "",
          });
          return fieldElement || <div />;
        }}
      />
      {description && <div className="text-xs text-gray-400 mt-1">{description}</div>}
      {showError && <div className="text-red-500 text-xs mt-1">{error?.message as string}</div>}
    </div>
  );
};

export default RenderField;
