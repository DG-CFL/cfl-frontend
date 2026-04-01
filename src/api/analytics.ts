import type { AnalyticsData } from '@/types/analytics'
import { api } from './baseApi'

const baseUrl = '/v1/admin/analytics'

export type AnalyticsSummaryParams = {
  begin: string
  end: string
}

export async function getAnalyticsSummary(
  params: AnalyticsSummaryParams,
): Promise<AnalyticsData> {
  const res = await api.get(baseUrl, {
    params: {
      begin: params.begin,
      end: params.end,
    },
  })
  return res.data
}
