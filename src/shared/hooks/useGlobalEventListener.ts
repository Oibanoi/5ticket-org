import { useEffect } from "react";

function useGlobalEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: ((this: Window, ev: WindowEventMap[K]) => any) | null,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(
    function () {
      if (listener != null) {
        window.addEventListener(event, listener, options);
        return function () {
          window.removeEventListener(event, listener, options);
        };
      }
    },
    [listener, event, options]
  );
}

export default useGlobalEventListener;
