import type { AnalyticsData } from "@/types/analytics";
import { api } from "./baseApi";

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await api.get('/v1/analytics')
  return res.data
}
