import { api } from "./baseApi";

export async function getAnalytics(): Promise<void> {
  const res = await api.get('/v1/analytics')
  return res.data
}
