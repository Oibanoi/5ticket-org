import { Input, InputProps } from "antd";
import { forwardRef } from "react";
import Svg from "shared/components/icon/svg";
import clsx from "clsx";

export interface InputWithIconsProps extends Omit<InputProps, "prefix" | "suffix"> {
  leading?: string; // Path to SVG icon
  trailing?: string; // Path to SVG icon
  onClickLeading?: () => void;
  onClickTrailing?: () => void;
  isInvalid?: boolean;
}

const InputWithIcons = forwardRef<any, InputWithIconsProps>(
  (
    {
      leading,
      trailing,
      onClickLeading,
      onClickTrailing,
      isInvalid,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        {...props}
        className={clsx(className, isInvalid && "border-red-500")}
        prefix={
          leading ? (
            <button
              type="button"
              onClick={onClickLeading}
              className={clsx(onClickLeading && "cursor-pointer")}
              disabled={!onClickLeading}
            >
              <Svg src={leading} className="w-4 h-4" />
            </button>
          ) : undefined
        }
        suffix={
          trailing ? (
            <button
              type="button"
              onClick={onClickTrailing}
              className={clsx(onClickTrailing && "cursor-pointer")}
              disabled={!onClickTrailing}
            >
              <Svg src={trailing} className="w-4 h-4" />
            </button>
          ) : undefined
        }
        status={isInvalid ? "error" : undefined}
      />
    );
  }
);

InputWithIcons.displayName = "InputWithIcons";

export default InputWithIcons;

