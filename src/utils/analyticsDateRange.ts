import {
  endOfYear,
  format,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'

export type AnalyticsTimePeriod =
  | 'this-year'
  | 'last-year'
  | 'last-6-months'
  | 'last-3-months'

/**
 * Inclusive date range as YYYY-MM-DD for GET /admin/analytics.
 */
export function getAnalyticsDateRange(
  period: AnalyticsTimePeriod,
): { begin: string; end: string } {
  const now = new Date()
  const end = format(now, 'yyyy-MM-dd')

  switch (period) {
    case 'this-year':
      return { begin: format(startOfYear(now), 'yyyy-MM-dd'), end }
    case 'last-year': {
      const ref = subYears(now, 1)
      return {
        begin: format(startOfYear(ref), 'yyyy-MM-dd'),
        end: format(endOfYear(ref), 'yyyy-MM-dd'),
      }
    }
    case 'last-6-months':
      return { begin: format(subMonths(now, 6), 'yyyy-MM-dd'), end }
    case 'last-3-months':
      return { begin: format(subMonths(now, 3), 'yyyy-MM-dd'), end }
    default:
      return { begin: format(startOfYear(now), 'yyyy-MM-dd'), end }
  }
}
