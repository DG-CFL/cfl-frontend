import {
  getAnalyticsSummary,
  type AnalyticsSummaryParams,
} from '@/api/analytics'
import { useQuery } from '@tanstack/react-query'

export function useGetAnalyticsSummary(params: AnalyticsSummaryParams | null) {
  return useQuery({
    queryKey: ['analytics', 'summary', params?.begin, params?.end],
    queryFn: () => getAnalyticsSummary(params!),
    enabled: Boolean(params?.begin && params?.end),
  })
}

export type { AnalyticsSummaryParams }
