import { api } from "./apiClient";
import type { APIResponse, Booking } from "./types";

export const getBookings = async (
  days: number,
  status?: string
): Promise<APIResponse<Booking[]>> => {
  const params: Record<string, string | number> = { days };
  if (status) {
    params.status = status;
  }
  const response = await api.get("/api/bookings", { params });

  return response.data;
};