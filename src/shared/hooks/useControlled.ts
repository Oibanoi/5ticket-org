import { useState } from "react";

type Dispatch<T> = T | ((prevState: T) => T);
type UseControlledState<T> = [T, (v: Dispatch<T>, ...rest: any[]) => void];
function useControlled<T>(
  valueProp?: T | undefined,
  defaultValue?: T,
  onChange?: (value: T, ...rest: any[]) => void
): UseControlledState<T> {
  const [valueState, setValueState] = useState<T>(defaultValue as any);

  const value = valueProp !== undefined ? valueProp : valueState;

  const setValue = (newValue: Dispatch<T>, ...rest: any[]) => {
    if (typeof newValue === "function") {
      setValueState((v) => {
        const value: T = (newValue as any)(v);
        onChange?.(value, ...rest);
        return value;
      });
    } else {
      onChange?.(newValue, ...rest);
      setValueState(newValue);
    }
  };

  return [value, setValue];
}

export default useControlled;
