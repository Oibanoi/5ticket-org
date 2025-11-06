import { api } from "./index";
import type { ApiResponse } from "./types";
import type { AxiosRequestConfig } from "axios";

/**
 * HTTP methods wrapper with automatic axios instance selection
 *
 * These functions automatically use:
 * - clientAxios in browser/Client Components
 * - serverAxios in Server Components/API Routes
 *
 * All responses are unwrapped from ApiResponse<T> wrapper
 */

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const res = await api.get<ApiResponse<T>>(url, config);
  return res.data;
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.post<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function postFormData<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.postForm<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function patch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.patch<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await api.put<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const res = await api.delete<ApiResponse<T>>(url, config);
  return res.data;
}
