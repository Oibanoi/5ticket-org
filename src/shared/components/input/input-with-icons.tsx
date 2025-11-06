import clsx from "clsx";
import React, { ElementType, ForwardedRef, forwardRef, JSX, createElement } from "react";
import Svg from "../icon/svg";
import { BsX } from "react-icons/bs";
import { Props, ReactTag } from "types/element";
import { Tooltip } from "antd";

type InputProps = {
  clearable?: boolean;
  onClear?(): void;
  help?: React.ReactNode;
  isInvalid?: boolean;
  pre?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  inputClassName?: string;
  options?: (
    | string
    | number
    | {
        title: React.ReactNode | string;
        value: string | number | null;
        disabled?: boolean;
        extra?: any;
      }
  )[];
  onSubmit?(): void;

  onClickTrailing?(): void;
  onClickLeading?(e: React.MouseEvent<HTMLSpanElement>): void;
};
const DEFAULT_INPUT_TAG = "input";
interface ComponentInputWithIcons {
  <TTag extends ReactTag = typeof DEFAULT_INPUT_TAG>(props: Props<TTag, InputProps>): JSX.Element;
}

const InputWithIconsRef = forwardRef(
  <TTag extends ReactTag = typeof DEFAULT_INPUT_TAG>(
    {
      className,
      isInvalid,
      leading,
      trailing,
      onClickTrailing,
      inputClassName,
      help: helper,
      onClickLeading,
      as,
      clearable,
      onClear,
      onSubmit,
      pre,
      ...rest
    }: Props<TTag, InputProps>,
    ref: ForwardedRef<any>
  ) => {
    return (
      <div
        className={clsx(
          "relative group",
          { "input-leading-icon": leading, "input-trailing-icon": trailing },
          className
        )}
      >
        {pre}
        {leading || helper ? (
          <div className="leading-icon absolute inset-y-0">
            <Tooltip title={helper}>
              <span
                onClick={onClickLeading}
                className={clsx(helper ? "cursor-help" : "", "text-gray-300 sm:text-sm")}
              >
                {!leading || typeof leading === "string" ? (
                  <Svg src={helper ? "/icons/question.svg" : String(leading)} className="w-4 h-4" />
                ) : (
                  leading
                )}
              </span>
            </Tooltip>
          </div>
        ) : null}
        {createElement(as || DEFAULT_INPUT_TAG, {
          ...rest,
          onKeyDown: onSubmit ? (e: any) => e.key === "Enter" && onSubmit() : undefined,
          ref,
          className: clsx(
            "input w-full",
            { "input-error placeholder:text-red-400": isInvalid },
            inputClassName
          ),
        })}
        {clearable && (
          <div className="absolute group-hover:opacity-100 opacity-0 flex items-center justify-center inset-y-0 right-8 transition">
            <div onClick={onClear} className={"cursor-pointer rounded-full bg-gray-200 p-0.5"}>
              <BsX size={12} />
            </div>
          </div>
        )}
        {trailing ? (
          <div
            role={onClickTrailing && "button"}
            className="trailing-icon absolute inset-y-0"
            onClick={onClickTrailing}
          >
            <span className="text-gray-500 sm:text-sm">
              {!trailing || typeof trailing === "string" ? (
                <Svg src={String(trailing)} className="w-4 h-4" />
              ) : (
                trailing
              )}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
);
InputWithIconsRef.displayName = "InputWithIcons";
const InputWithIcons = InputWithIconsRef as ComponentInputWithIcons;

export default InputWithIcons;
