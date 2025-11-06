import { toast } from "react-hot-toast";

/**
 * Sonner toast notification function
 * Uses react-hot-toast under the hood
 */
export function sonner(message: string, options?: { type?: "success" | "error" | "loading" }) {
  const { type = "success" } = options || {};
  
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.error(message);
    case "loading":
      return toast.loading(message);
    default:
      return toast(message);
  }
}

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).sonner = sonner;
}

