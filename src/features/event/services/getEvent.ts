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
  "organizational units": string;
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
