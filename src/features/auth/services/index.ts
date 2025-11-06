import type { AxiosRequestConfig } from "axios";
import { get, post } from "shared/lib/api/fetcher";

export interface LoginResponse {
  user_id: number;
  access_token: string;
  role: {
    id: number;
    name: string;
    newRolePermissions: any[];
  };
  email: string | null;
  username: string;
}

export interface UserByEmailResponse {
  id: number;
  email: string;
  name: string;
  [key: string]: unknown;
}

export interface MeSummaryResponse {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

// config is for axios config
export function login(data: { email: string; password: string }, configs?: AxiosRequestConfig) {
  return post<LoginResponse>("/login", data, configs);
}

export function logout(config?: AxiosRequestConfig) {
  return post<{ message: string }>("/logout", undefined, config);
}

export function forgot(email: string) {
  return post<{ message: string }>("/forgot", null, { params: { email } });
}

export function reset(payload: {
  otp: string;
  email: string;
  new_password: string;
  new_password_confirm: string;
}) {
  return post<{ message: string }>("/reset", payload);
}

export function getUserByEmail(email: string) {
  return get<UserByEmailResponse>(`/partner/user/find`, { params: { email } });
}

export function getMeSummary(config?: AxiosRequestConfig) {
  return get<MeSummaryResponse>("/users/me/summary", config);
}