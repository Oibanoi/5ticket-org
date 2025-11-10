import React from "react";
import { Input } from "antd";
import { Controller, Control, FieldError } from "react-hook-form";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface FormFieldProps {
  name: string;
  control: Control<any>;
  type?: "text" | "email" | "password";
  placeholder?: string;
  label?: string;
  icon?: "user" | "lock" | React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
  size?: "small" | "middle" | "large";
  className?: string;
}

const getIcon = (iconType?: "user" | "lock" | React.ReactNode) => {
  if (React.isValidElement(iconType)) return iconType;
  
  switch (iconType) {
    case "user":
      return <UserOutlined className="text-gray-400" />;
    case "lock":
      return <LockOutlined className="text-gray-400" />;
    default:
      return undefined;
  }
};

export const FormField: React.FC<FormFieldProps> = ({
  name,
  control,
  type = "text",
  placeholder,
  label,
  icon,
  disabled = false,
  autoComplete,
  size = "large",
  className = "rounded-lg",
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            {type === "password" ? (
              <Input.Password
                {...field}
                id={name}
                size={size}
                prefix={getIcon(icon)}
                placeholder={placeholder}
                status={fieldState.error ? "error" : ""}
                disabled={disabled}
                autoComplete={autoComplete}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className={className}
              />
            ) : (
              <Input
                {...field}
                id={name}
                type={type}
                size={size}
                prefix={getIcon(icon)}
                placeholder={placeholder}
                status={fieldState.error ? "error" : ""}
                disabled={disabled}
                autoComplete={autoComplete}
                className={className}
              />
            )}
            
            {fieldState.error && (
              <p className="text-red-500 text-xs">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};
