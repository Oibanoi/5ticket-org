export interface CreateEventPayload {
  id?: number;
  name: string;
  sponsored_brands: string;
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
  is_enable: boolean;
  base_price: number;
  add_or_update_blacklist: Array<{
    value: string;
    type: string;
    is_enabled: boolean;
  }>;
}

export interface CreateEventResponse {
  id: string;
  message: string;
}
