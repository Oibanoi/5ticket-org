export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
