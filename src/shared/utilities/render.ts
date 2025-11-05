import React, { createElement, forwardRef } from "react";
import { ReactTag } from "types/element";

/** Chuẩn hóa PropsOf như HeadlessUI */
export type PropsOf<TTag extends React.ElementType> = React.ComponentPropsWithoutRef<TTag>;

/** ForwardRef giữ nguyên type và displayName */
export function forwardRefWithAs<T extends { name: string; displayName?: string }>(
  component: T
): T {
  return Object.assign(forwardRef(component as unknown as any) as any, {
    displayName: component.displayName ?? component.name,
  });
}

const DEFAULT_ELEMENT_TAG = "div";

type Props<T extends ReactTag = typeof DEFAULT_ELEMENT_TAG> = {
  as?: T;
  children?: React.ReactNode;
} & PropsOf<T>;

const Element = forwardRefWithAs(function <TTag extends ReactTag = typeof DEFAULT_ELEMENT_TAG>(
  { as, children, ...rest }: Props<TTag>,
  ref: React.Ref<any>
) {
  const Tag = as || DEFAULT_ELEMENT_TAG;
  return createElement(Tag, { ...rest, ref }, children);
});

export default Element;
