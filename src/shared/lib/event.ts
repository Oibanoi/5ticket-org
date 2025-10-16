import EventEmitter from "events";
import { useCallback, useEffect } from "react";

const events = new EventEmitter();

const useEventListener = (event: string | symbol, listener: (...args: any[]) => void) => {
  useEffect(
    function () {
      if (listener != null) {
        events.on(event, listener);
        return function () {
          events.off(event, listener);
        };
      }
    },
    [listener, event]
  );
};

const createEventEmitter =
  (event: string | symbol) =>
  (...args: any[]) =>
    events.emit(event, ...args);

const useEventEmitter = (event: string | symbol) => {
  const emitter = useCallback((...args: any[]) => createEventEmitter(event)(...args), [event]);
  return emitter;
};

export { createEventEmitter, events, useEventEmitter, useEventListener };
