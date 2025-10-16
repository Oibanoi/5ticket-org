export const isString = (val: any): val is string => typeof val === "string";
export const isUndefined = (obj: any): obj is undefined => typeof obj === "undefined";
export const isNil = (val: any): val is null | undefined => isUndefined(val) || val === null;
export const isObject = (fn: any): fn is object => !isNil(fn) && typeof fn === "object";
export const isNumber = (v: any): v is Number => typeof v === "number" && !isNaN(v);
export const isFunction = (obj: any): obj is (...args: any[]) => any => typeof obj === "function";

export const isPlainObject = (fn: any): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof ctor === "function" &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
  );
};

export function isPromise<D = unknown>(obj: any): obj is Promise<D> {
  if (typeof obj === "object" && typeof obj.then === "function") {
    return true;
  }
  return false;
}
export const isValidDate = <D = unknown>(d: D) => {
  return d instanceof Date && !isNaN(d as any);
};

//
export const phoneNumberRegex = /^(?:\+?84|0)(?:\d){9,10}$/;
export const phoneOrEmailRegex =
  /^(?:\+?84|0)(?:\d){9,10}|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/;
