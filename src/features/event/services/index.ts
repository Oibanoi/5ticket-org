import { post } from "shared/lib/api/fetcher";
import { CreateEventPayload, CreateEventResponse } from "../types/api";
import type { ApiResponse } from "shared/lib/api/types";

export const createEvent = async (payload: CreateEventPayload): Promise<CreateEventResponse> => {
  const response = await post<CreateEventResponse>("/main-event/create?tenant_id=1", payload);
  return response.data;
};

export const updateEvent = async (
  id: string,
  payload: CreateEventPayload
): Promise<CreateEventResponse> => {
  const response = await post<CreateEventResponse>(`/main-event/update?tenant_id=1`, payload);
  return response.data;
};
