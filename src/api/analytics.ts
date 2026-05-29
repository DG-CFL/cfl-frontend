import type { AnalyticsData } from '@/types/analytics'
import type { TrainingOverviewDataPoint } from '@/types/analytics'
import { api } from './baseApi'

const baseUrl = '/v1/admin/analytics'

export type AnalyticsSummaryParams = {
  begin: string
  end: string
}

type RawTrainingOverviewDataPoint = {
  people?: unknown
  sessions?: unknown
  peopleTrained?: unknown
  intPeopleTrained?: unknown
  noOfPeopleTrained?: unknown
  numberOfPeopleTrained?: unknown
  totalPeopleTrained?: unknown
  trainingSessions?: unknown
  totalTrainingSessions?: unknown
}

type RawAnalyticsData = Omit<AnalyticsData, 'trainingOverview'> & {
  trainingOverview?: Array<RawTrainingOverviewDataPoint>
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function normalizeTrainingOverviewPoint(
  point: RawTrainingOverviewDataPoint,
): TrainingOverviewDataPoint {
  return {
    people: toNumber(
      point.people ??
        point.peopleTrained ??
        point.intPeopleTrained ??
        point.noOfPeopleTrained ??
        point.numberOfPeopleTrained ??
        point.totalPeopleTrained,
    ),
    sessions: toNumber(
      point.sessions ?? point.trainingSessions ?? point.totalTrainingSessions,
    ),
  }
}

function normalizeAnalyticsData(data: RawAnalyticsData): AnalyticsData {
  return {
    ...data,
    totalTrainingSessions: toNumber(data.totalTrainingSessions),
    intPeopleTrained: toNumber(data.intPeopleTrained),
    totalMembers: toNumber(data.totalMembers),
    certifiedMembers: toNumber(data.certifiedMembers),
    newlyCertifiedMembers: toNumber(data.newlyCertifiedMembers),
    averageAttendance: toNumber(data.averageAttendance),
    volunteerEngagement: toNumber(data.volunteerEngagement),
    trainingOverview: (data.trainingOverview ?? []).map(
      normalizeTrainingOverviewPoint,
    ),
  }
}

export async function getAnalyticsSummary(
  params: AnalyticsSummaryParams,
): Promise<AnalyticsData> {
  const res = await api.get<RawAnalyticsData>(baseUrl, {
    params: {
      begin: params.begin,
      end: params.end,
    },
  })
  return normalizeAnalyticsData(res.data)
}
