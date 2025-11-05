import { Tooltip } from "antd";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";
import Svg from "../icon/svg";

type CustomChangeInputEvent<V> = {
  target: Omit<HTMLElement, "value"> & { value: V; name?: string };
};

type Value = string[];
type Props = {
  help?: React.ReactNode;
  value?: Value;
  defaultValues?: Value;
  onChange?(event: CustomChangeInputEvent<Value>): void;
  separateKey?: Value;
};
type OverWriteProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  keyof Props
> &
  Props;
type CustomInput = Omit<HTMLInputElement, keyof Props> & Props;

const InputTag = forwardRef(function InputTag(
  {
    help,
    disabled,
    placeholder,
    value: valueProps,
    defaultValues,
    onChange,
    separateKey = ["Enter", ",", " "],
    ...rest
  }: OverWriteProps,
  forwardedRef: React.Ref<CustomInput>
) {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>(defaultValues || valueProps || []);
  const values = valueProps || tags;
  const ref = useRef<HTMLInputElement>(null);

  useImperativeHandle(forwardedRef, () => ({
    ...ref.current!,
    get value() {
      return tags;
    },
    set value(tags: string[]) {
      setTags(Array.isArray(tags) ? tags : []);
    },
  }));

  const handleChange = (tags: string[], e: HTMLElement) => {
    onChange?.({
      target: { ...e, value: tags, name: rest.name, type: undefined } as any,
    });
    setTags(tags);
  };

  const handleChangeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    const value = element.value.trim();
    if (!value) return setQuery("");
    const isExisted = values?.includes(value);
    if (!isExisted) {
      handleChange([...values, value], element);
    }
    setQuery("");
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (separateKey.includes(e.key)) {
      e.preventDefault();
      return handleChangeInput(e);
    }
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        break;
      case "Backspace":
        if (values.length && e.currentTarget.value.length === 0) {
          const newValues = [...values];
          const last = newValues.pop()!;
          handleChange(newValues, e.currentTarget);
          setQuery(last);
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const onDelete: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const input = e.currentTarget.dataset.value;
    const newValue = values.filter((v) => v !== input);
    handleChange(newValue, e.currentTarget);
  };

  const showPlaceHolder = !query && !values.length;

  return (
    <label
      aria-disabled={disabled}
      className={`flex flex-wrap items-center gap-1 w-full border rounded-lg px-2 py-1 text-sm min-h-[40px] cursor-text transition-colors
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-400 focus-within:border-blue-500 border-gray-300"
        }
      `}
    >
      {help && (
        <Tooltip title={help} placement="top">
          <span className="text-gray-400 cursor-help inline-flex mr-1">
            <Svg src="/icons/question.svg" className="w-4 h-4" />
          </span>
        </Tooltip>
      )}

      {/* Các tag */}
      {values.map(
        (value) =>
          value && (
            <div
              key={value}
              className="flex items-center px-2 py-0.5 bg-blue-50 border border-blue-300 text-blue-700 text-xs rounded-full"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <span>{value}</span>
              <div
                className="cursor-pointer hover:bg-blue-100 rounded-full ml-1 p-0.5"
                data-value={value}
                onClick={onDelete}
              >
                <GrClose size={10} />
              </div>
            </div>
          )
      )}

      {/* Input nhập tag */}
      <div className="flex-1 min-w-[120px]">
        <input
          {...rest}
          className="bg-transparent w-full text-sm py-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none"
          value={query}
          onKeyDown={onKeyDown}
          onChange={(e) => setQuery(e.target.value)}
          ref={ref}
          placeholder={showPlaceHolder ? placeholder : undefined}
          disabled={disabled}
        />
      </div>
    </label>
  );
});

export default InputTag;
