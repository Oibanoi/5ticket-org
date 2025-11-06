import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
import { forwardRef } from "react";

export interface ButtonProps extends AntButtonProps {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, loading, children, disabled, ...props }, ref) => {
    return (
      <AntButton
        ref={ref as any}
        loading={isLoading || loading}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </AntButton>
    );
  }
);

Button.displayName = "Button";

