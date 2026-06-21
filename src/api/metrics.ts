import { api } from "./apiClient";
import type { APIResponse, Metrics } from "./types";

export const getMetrics = async (days = 30): Promise<APIResponse<Metrics>> => {
  const response = await api.get("/api/metrics", {
    params: { days },
  });

  return response.data;
};