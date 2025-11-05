import axiosInstance from "./client";
import type { ApiResponse } from "./types";
import type { AxiosRequestConfig } from "axios";

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T> | T> {
  const res = await axiosInstance.get<ApiResponse<T>>(url, config);
  return res.data;
}

// config is for axios config
export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await axiosInstance.post<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function postFormData<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await axiosInstance.postForm<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function patch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await axiosInstance.patch<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const res = await axiosInstance.put<ApiResponse<T>>(url, body, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const res = await axiosInstance.delete<ApiResponse<T>>(url, config);
  return res.data;
}
