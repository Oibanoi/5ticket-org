import React, { ForwardRefRenderFunction, JSXElementConstructor, PropsWithoutRef } from "react";

export type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
export type CustomProps<P, A extends keyof JSX.IntrinsicElements = "div"> = P &
  Omit<JSX.IntrinsicElements[A], keyof P>;
declare let __: "1D45E01E-AF44-47C4-988A-19A94EBAF55C";
export declare type __ = typeof __;

// export type PropsOf<TTag extends ReactTag> = TTag extends React.ElementType
//   ? Omit<React.ComponentProps<TTag>, "ref">
//   : never;

type OurProps<TTag extends ReactTag, TSlot> = {
  ref?: React.Ref<HTMLElement>;
  as?: TTag;
  children?: React.ReactNode | ((bag: TSlot) => React.ReactElement);
};
type PropsWeControl = keyof OurProps<any, any>;

type CleanProps<TTag extends ReactTag, TOmitableProps extends PropertyKey = never> = Omit<
  PropsOf<TTag>,
  TOmitableProps | PropsWeControl
>;

type PropsWithStandardRef<T extends ReactTag, Props = unknown> = Props &
  CleanProps<T> &
  OurProps<T, {}>;
export type CustomElementProps<T extends React.ElementType<any> = "div", P = unknown> = P &
  Omit<CleanProps<T>, keyof P> &
  OurProps<T, {}>;

// export type Props<T extends ReactTag, Overrides = {}, TSlot = {}> = CleanProps<T, keyof Overrides> &
//   OurProps<T, TSlot> &
//   Overrides;

export type PropsWithoutBag<TTag extends ReactTag, Overrides = {}, TSlot = {}> = CleanProps<
  TTag,
  keyof Overrides
> & {
  ref?: React.Ref<HTMLElement>;
  as?: TTag;
  children?: React.ReactNode;
} & Overrides; // ClassNameOverride<TTag, TSlot> &

export type Props<TTag extends ReactTag, Overrides = {}, TSlot = {}> = CleanProps<
  TTag,
  keyof Overrides
> &
  OurProps<TTag, TSlot> &
  Overrides;

type GetObject<T extends object> = { [K in keyof T]: T[K] };

export type ComponentDynamicRef<Props, S extends ReactTag = "section"> = <
  T extends React.ElementType<Props> | ReactTag = S
>(
  props: PropsWithStandardRef<T, Props>
) => React.ReactElement<any, any> | null;

// With ref as element
export type ComponentWithRef<Props, S extends ReactTag> = React.ForwardRefExoticComponent<
  PropsWithoutRef<CustomProps<Props, S>> & React.RefAttributes<any>
>;
