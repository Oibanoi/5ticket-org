import React from "react";
import {
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Checkbox,
  Radio,
  Upload,
  UploadProps,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import type {
  InputProps,
  SelectProps,
  DatePickerProps,
  SwitchProps,
  CheckboxProps,
  RadioGroupProps,
} from "antd";
import InputTag from "shared/components/input/input-tag";

export const fieldComponents = {
  input: Input,
  textarea: Input.TextArea,
  number: InputNumber,
  select: Select,
  date: DatePicker,
  switch: Switch,
  checkbox: Checkbox,
  checkboxGroup: Checkbox.Group,
  radio: Radio.Group,
  upload: Upload,
  inputTag: InputTag,
};

export type FieldType = keyof typeof fieldComponents;

// ✅ Type tổng hợp props cho từng loại field
type CommonFieldProps =
  | InputProps
  | SelectProps
  | DatePickerProps
  | SwitchProps
  | CheckboxProps
  | RadioGroupProps
  | UploadProps
  | any;

interface RenderFieldProps extends CommonFieldProps {
  type: FieldType;
  value?: any;
  onChange?: (value: any) => void;
  options?: { label: string; value: any }[];
  placeholder?: string;
}

// ✅ Logic render
export const renderField = (
  type: FieldType,
  props: RenderFieldProps
): React.ReactElement | null => {
  const Comp = fieldComponents[type] as React.ElementType;

  switch (type) {
    case "input":
    case "number":
      return <Comp {...props} className="w-full" />;

    case "textarea":
      return (
        <Comp
          {...props}
          className="w-full"
          onChange={(content: string) => props.onChange?.(content)}
        />
      );

    case "select":
      return (
        <Comp
          {...props}
          className="w-full"
          options={props.options}
          placeholder={props.placeholder}
        />
      );

    case "date":
      return (
        <Comp
          {...props}
          showTime
          className="w-full"
          value={props.value ? dayjs(props.value) : null}
          onChange={(date: Dayjs | null) => props.onChange?.(date ? date.toISOString() : null)}
        />
      );

    case "switch":
      return <Comp {...props} />;

    case "checkbox":
      const { value: checkboxValue, onChange: checkboxOnChange, ...checkboxRest } = props;
      return (
        <Comp
          {...checkboxRest}
          checked={checkboxValue}
          onChange={(e: any) => checkboxOnChange?.(e.target.checked)}
        >
          {props.children}
        </Comp>
      );

    case "checkboxGroup":
      return <Comp {...props} options={props.options} />;

    case "radio":
      return <Comp {...props} options={props.options} />;

    case "upload":
      const { value: uploadValue, onChange: uploadOnChange, ...uploadRest } = props;
      return (
        <Comp
          {...uploadRest}
          fileList={uploadValue || []}
          listType="picture-card"
          className="w-full"
          onChange={(info: any) => {
            const fileList = info.fileList || [];
            uploadOnChange?.(fileList);
          }}
        >
          {props.children ?? "+ Upload"}
        </Comp>
      );

    case "inputTag":
      return (
        <Comp
          {...props}
          className="w-full"
          onChange={(event: any) => {
            props.onChange?.(event.target.value);
          }}
        />
      );

    default:
      return null;
  }
};
