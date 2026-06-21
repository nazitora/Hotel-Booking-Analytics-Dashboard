import { api } from "./apiClient";
import type { APIResponse, Trend } from "./types";

export const getTrends = async (months = 6): Promise<APIResponse<Trend[]>> => {
  const response = await api.get("/api/trends", {
    params: { months },
  });

  return response.data;
};