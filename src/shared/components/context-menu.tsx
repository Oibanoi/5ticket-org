import { useIsomorphicLayoutEffect } from "framer-motion";
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useBoolean from "shared/hooks/useBoolean";
import useGlobalEventListener from "shared/hooks/useGlobalEventListener";
import { events } from "shared/lib/event";
import { getPointerPosition } from "shared/utilities/position";
import { isNumber, isString } from "shared/utilities/validator";

const MENU_OPEN = Symbol("MENU_OPEN");
type ContextOption = {
  contextId?: number | string;
};
type CustomEvent = React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>;
type InternalOption = {
  contextId: number | string;
  close(): void;
  data: any;
  event: CustomEvent;
  referenceTarget: HTMLElement | SVGElement;
};
export function contextMenu(e: CustomEvent, data: any) {
  events.emit(MENU_OPEN, e, data, { contextId: "root" });
}
export function useContextMenu(contextId?: string | number) {
  return function contextMenu(e: CustomEvent, data: any) {
    events.emit(MENU_OPEN, e, data, { contextId: contextId });
  };
}
type ContextMenu<D> = {
  renderData: React.ComponentType<D>;
  id?: string | number;
};
function ContextMenu<D>(props: ContextMenu<D>) {
  const { id = "root" } = props;
  const isReady = useBoolean();
  const contextToRender = useRef(new Map<string | number, InternalOption>()).current;
  const [contextIds, setContextIds] = useState<Record<string | number, boolean>>({});
  const CONTEXT_ID = useRef(0);

  /**
   * Generate a random id
   */
  function generateContextId() {
    return `${CONTEXT_ID.current++}`;
  }
  const getContextId = useCallback((options?: ContextOption) => {
    return options && (isString(options.contextId) || isNumber(options.contextId))
      ? options.contextId
      : generateContextId();
  }, []);

  const removeContext = useCallback(
    (contextId?: string | number | null) => {
      if (contextId) {
        const modal = contextToRender.get(contextId);
        if (!modal?.data.transition) contextToRender.delete(contextId);
      } else {
        contextToRender.clear();
      }
      contextId == null
        ? setContextIds({})
        : setContextIds((state) => {
            const { [contextId]: remove, ...newState } = state;
            return newState;
          });
    },
    [setContextIds, contextToRender]
  );

  useEffect(() => {
    isReady.setTrue();
    function buildContext(e: CustomEvent, data: D, options?: ContextOption) {
      if (options?.contextId !== id) return;
      const contextId = getContextId(options);
      const newOptions = Object.assign(
        { event: e, referenceTarget: e.currentTarget, data },
        { contextId }
      );
      const contextOption = {
        ...newOptions,
        close() {
          removeContext(contextId);
        },
      };
      contextToRender.set(contextId, contextOption);
      setContextIds(() => ({ [contextId]: true }));
    }
    events.on(MENU_OPEN, buildContext);
    return () => {
      events.off(MENU_OPEN, buildContext);
    };
  }, [contextToRender, getContextId, id, isReady, removeContext]);

  return isReady.value
    ? createPortal(
        <div>
          {Array.from(contextToRender.values()).map((option) => {
            return (
              <ContextItem
                key={option.contextId}
                {...option}
                isShow={contextIds[option.contextId]}
                renderData={props.renderData}
              />
            );
          })}
        </div>,
        document.body
      )
    : null;
}
const ContextItem = (props: InternalOption & { isShow: boolean } & ContextMenu<any>) => {
  const { renderData: Render, data } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (!props.isShow) props.close();
  }, [props, props.isShow]);
  useIsomorphicLayoutEffect(() => {
    if (ref.current) {
      const bcr = props.referenceTarget.getBoundingClientRect();
      const contentWidth = ref.current.clientWidth;
      const contentHeight = ref.current.clientHeight;
      let [x, y] =
        props.event.type === "contextmenu"
          ? getPointerPosition(props.event.nativeEvent)
          : props.referenceTarget
          ? [bcr.x, bcr.y + bcr.height]
          : [0, 0];
      let isOutView = y > innerHeight - contentHeight;
      y = y + scrollY;
      x = x + scrollX;
      isOutView ||= y > document.scrollingElement!.scrollHeight - contentHeight;
      ref.current.style.top = (isOutView ? y - contentHeight : y) + "px";
      ref.current.style.left = (x > innerWidth - contentWidth ? x - contentWidth : x) + "px";
      // Hack for mobile
      setTimeout(() => setClicked(true));
    }
  }, [props.event]);
  useGlobalEventListener("click", clicked ? props.close : () => void 0);
  useGlobalEventListener("resize", props.close);
  useGlobalEventListener("scroll", props.close);

  return (
    <div className="absolute left-0 top-0 z-50" ref={ref}>
      <div onMouseDown={(e) => e.stopPropagation()}>
        <Render {...data} />
      </div>
    </div>
  );
};

ContextMenu.List = function ContextMenuList({ children }: PropsWithChildren) {
  return (
    <ul className="menu p-1">
      {React.Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  );
};

export default ContextMenu;
