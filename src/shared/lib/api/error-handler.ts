// import { sonner } from "@/components/global/sonner";
import { AxiosError } from "axios";

export function handleApiError(error: AxiosError<{ message?: string }>) {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || error.message;

  console.log(`[API ERROR] ${status}: ${message}`);
  if (process.env.NODE_ENV !== "production") {
    // sonner({ title: "API Error", desc: message });
  }
}
