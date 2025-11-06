"use client";

import { useEffect } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { sonner } from "components/global/sonner";

interface UseDevelopmentModeProps {
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  fieldName?: string;
}

/**
 * Hook to enable development mode toggle by pressing 'd' key 5 times
 * or tapping the screen 5 times quickly
 */
export function useDevelopmentMode({
  getValues,
  setValue,
  fieldName = "isDevelopment",
}: UseDevelopmentModeProps) {
  useEffect(() => {
    let clicked = 0;
    let lastPress = 0;

    // Make sonner available globally for debugging
    Object.assign(window, { sonner });

    function handleKeydown(e: KeyboardEvent) {
      if (["d", "đ", "D", "Đ"].includes(e.key)) {
        clicked++;
        if (clicked === 5) {
          clicked = 0;
          const isDev = !getValues(fieldName);
          setValue(fieldName, isDev);
          sonner(isDev ? "Development mode enabled" : "Development mode disabled");
        }
      }
    }

    function handleTouchStart() {
      if (Date.now() - lastPress > 500) {
        clicked = 0;
      }
      lastPress = Date.now();
      clicked++;
      
      if (clicked === 5) {
        clicked = 0;
        const isDev = !getValues(fieldName);
        setValue(fieldName, isDev);
        sonner(isDev ? "Development mode enabled" : "Development mode disabled");
      }
    }

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [getValues, setValue, fieldName]);
}

