import { get } from "shared/lib/api/fetcher";
import type { ApiResponse } from "shared/lib/api/types";

export interface GetEventResponse {
  id: number;
  name: string;
  deleted: boolean;
  sponsored_brands: string;
  status: string;
  event_type: string;
  hotline: string;
  location: string;
  province: string;
  ward: string;
  prefix: string;
  slug: string;
  group_buy_enable: boolean;
  start_date: string;
  end_date: string;
  registration_change_start_date: string;
  registration_change_end_date: string;
  transfer_start_date: string;
  transfer_end_date: string;
  checkin_start_date: string;
  checkin_end_date: string;
  payment_options: string;
  logo_url: string;
  wall_paper_url: string;
  email_image_url: string;
  organizational_units: string;
  description: string;
  base_price: number;
  tenant_id: number | null;
  created_on: string;
  modified_on: string;
  is_enable: boolean;
}

export const getEventById = async (id: string): Promise<GetEventResponse> => {
  const response = await get<any>(`/main-event/detail?main_event_id=${id}`);
  return response.data;
};

export interface GetAllEventParams {
  main_event_id?: number;
  name?: string;
  event_types?: string;
  pageNo?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface EventListItem {
  id: number;
  name: string;
  deleted: boolean;
  sponsored_brands: string;
  status: string;
  event_type: string;
  hotline: string;
  location: string;
  province: string;
  ward: string;
  prefix: string;
  slug: string;
  group_buy_enable: boolean;
  start_date: string;
  end_date: string;
  registration_change_start_date: string;
  registration_change_end_date: string;
  transfer_start_date: string;
  transfer_end_date: string;
  checkin_start_date: string;
  checkin_end_date: string;
  payment_options: string;
  logo_url: string;
  wall_paper_url: string;
  email_image_url: string;
  organizational_units: string;
  description: string;
  base_price: number;
  tenant_id: number | null;
  customize_fields: any;
  created_on: string;
  modified_on: string;
  is_enable: boolean;
}

export interface GetAllEventResponse {
  content: EventListItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export const getAllEvent = async (params?: GetAllEventParams): Promise<GetAllEventResponse> => {
  const response = await get<GetAllEventResponse>("/main-event/list", {
    params,
  });
  // Handle both ApiResponse<T> and T return types
  return "data" in response ? response.data : response;
};
