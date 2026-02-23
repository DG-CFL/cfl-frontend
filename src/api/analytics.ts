import { api } from "./baseApi";

export async function getAnalytics(): Promise<void> {
  const res = await api.get('/analytics')
  return res.data
}
