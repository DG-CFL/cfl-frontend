import { useMemo } from 'react'
import { Download, Plus } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { useGetAnalyticsSummary } from '@/operations/analytics'
import type { TrainingOverviewDataPoint } from '@/types/analytics'
import type { AnalyticsTimePeriod } from '@/utils/analyticsDateRange'
import { getAnalyticsDateRange } from '@/utils/analyticsDateRange'
import LoadingSkeleton from '../LoadingSkeleton'

export function MetricCard({
  title,
  value,
  suffix,
}: {
  title: string
  value: string | number
  suffix?: string
}) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">
          {value}
          {suffix ? (
            <span className="ml-1 text-lg font-semibold text-gray-600">
              {suffix}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function linspace(min: number, max: number, count: number): Array<number> {
  if (count <= 1) return [Math.round(min)]
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, i) =>
    Math.round(min + step * i),
  )
}

const CHART = {
  width: 600,
  height: 300,
  padding: { top: 40, right: 60, bottom: 40, left: 60 },
} as const

type TrainingOverviewChartProps = {
  dataPoints: Array<TrainingOverviewDataPoint>
}

export function TrainingOverviewChart({
  dataPoints,
}: TrainingOverviewChartProps) {
  const { width, height, padding } = CHART
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const chartModel = useMemo(() => {
    const points =
      dataPoints.length > 0
        ? dataPoints
        : [{ people: 0, sessions: 0 } satisfies TrainingOverviewDataPoint]

    const peopleVals = points.map((p) => p.people)
    const sessionVals = points.map((p) => p.sessions)

    let peopleMin = Math.min(0, ...peopleVals)
    let peopleMax = Math.max(1, ...peopleVals)
    if (peopleMax <= peopleMin) peopleMax = peopleMin + 1

    let sessionsMin = Math.min(0, ...sessionVals)
    let sessionsMax = Math.max(1, ...sessionVals)
    if (sessionsMax <= sessionsMin) sessionsMax = sessionsMin + 1

    const peopleTicks = linspace(peopleMin, peopleMax, 5)
    const sessionsTicks = linspace(sessionsMin, sessionsMax, 5)

    const xStep =
      points.length > 1 ? chartWidth / (points.length - 1) : chartWidth

    const scalePeople = (value: number) =>
      padding.top +
      chartHeight -
      ((value - peopleMin) / (peopleMax - peopleMin)) * chartHeight

    const scaleSessions = (value: number) =>
      padding.top +
      chartHeight -
      ((value - sessionsMin) / (sessionsMax - sessionsMin)) * chartHeight

    const peoplePath = points
      .map(
        (point, i) =>
          `${i === 0 ? 'M' : 'L'} ${padding.left + i * xStep} ${scalePeople(point.people)}`,
      )
      .join(' ')

    const sessionsPath = points
      .map(
        (point, i) =>
          `${i === 0 ? 'M' : 'L'} ${padding.left + i * xStep} ${scaleSessions(point.sessions)}`,
      )
      .join(' ')

    return {
      points,
      peopleTicks,
      sessionsTicks,
      scalePeople,
      scaleSessions,
      peoplePath,
      sessionsPath,
      xStep,
    }
  }, [dataPoints, chartHeight, chartWidth, padding])

  if (dataPoints.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Training overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-gray-500">
            No training overview data for this period.
          </p>
        </CardContent>
      </Card>
    )
  }

  const {
    points,
    peopleTicks,
    sessionsTicks,
    scalePeople,
    scaleSessions,
    peoplePath,
    sessionsPath,
    xStep,
  } = chartModel

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">
          Training overview
        </CardTitle>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded p-2 hover:bg-gray-100"
            aria-label="Chart export"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </button>
          <button
            type="button"
            className="rounded p-2 hover:bg-gray-100"
            aria-label="Chart add"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-400" />
            <span className="text-sm text-gray-600">
              No. of people trained
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Training sessions</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <svg width={width} height={height} className="min-w-full">
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding.top + (chartHeight / 4) * i
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                />
              )
            })}

            {peopleTicks.map((value) => (
              <text
                key={`p-${value}`}
                x={padding.left - 10}
                y={scalePeople(value) + 4}
                textAnchor="end"
                className="fill-gray-600 text-xs"
              >
                {value}
              </text>
            ))}

            {sessionsTicks.map((value) => (
              <text
                key={`s-${value}`}
                x={width - padding.right + 10}
                y={scaleSessions(value) + 4}
                textAnchor="start"
                className="fill-gray-600 text-xs"
              >
                {value}
              </text>
            ))}

            <path
              d={sessionsPath}
              fill="none"
              stroke="#10B981"
              strokeWidth={3}
            />

            <path
              d={peoplePath}
              fill="none"
              stroke="#60A5FA"
              strokeWidth={3}
              strokeDasharray="8 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, i) => (
              <circle
                key={`sessions-${i}`}
                cx={padding.left + i * xStep}
                cy={scaleSessions(point.sessions)}
                r={5}
                fill="#10B981"
              />
            ))}

            {points.map((point, i) => (
              <circle
                key={`people-${i}`}
                cx={padding.left + i * xStep}
                cy={scalePeople(point.people)}
                r={4}
                fill="#60A5FA"
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

type CertificationChartProps = {
  totalCount: number
  certifiedCount: number
}

export function CertificationsChart({
  totalCount,
  certifiedCount,
}: CertificationChartProps) {
  const radius = 80
  const circumference = 2 * Math.PI * radius

  const certifiedPercent =
    totalCount > 0
      ? Math.round((certifiedCount / totalCount) * 100)
      : 0

  const certifiedOffset =
    totalCount > 0
      ? circumference - (certifiedCount / totalCount) * circumference
      : circumference

  return (
    <Card className="bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
          <div className="relative">
            <svg
              width={200}
              height={200}
              className="-rotate-90 transform"
              aria-hidden
            >
              <circle
                cx={100}
                cy={100}
                r={radius}
                fill="none"
                stroke="#D1FAE5"
                strokeWidth={20}
              />
              <circle
                cx={100}
                cy={100}
                r={radius}
                fill="none"
                stroke="#059669"
                strokeWidth={20}
                strokeDasharray={circumference}
                strokeDashoffset={certifiedOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900">
                {totalCount === 0 ? '—' : `${certifiedPercent}%`}
              </div>
              <div className="text-sm text-gray-600">of members</div>
              <div className="text-sm text-gray-600">certified</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-700" />
              <span className="text-sm text-gray-600">
                Certified ({certifiedCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-200" />
              <span className="text-sm text-gray-600">
                Uncertified ({Math.max(0, totalCount - certifiedCount)})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export type AnalyticsReportContentProps = {
  /** Defaults to current calendar year through today (PDF preview). */
  timePeriod?: AnalyticsTimePeriod
}

/** Metrics + charts from GET /v1/admin/analytics for the selected period. */
export function AnalyticsReportContent({
  timePeriod = 'this-year',
}: AnalyticsReportContentProps) {
  const range = useMemo(
    () => getAnalyticsDateRange(timePeriod),
    [timePeriod],
  )

  const { data, isLoading, isError } = useGetAnalyticsSummary(range)

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !data) {
    return (
      <ErrorAlert message="Could not load analytics summary. Check that you are signed in as an admin." />
    )
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Training Sessions"
          value={data.totalTrainingSessions}
        />
        <MetricCard
          title="No. of People Trained"
          value={data.intPeopleTrained}
        />
        <MetricCard
          title="Newly Certified Volunteers"
          value={data.newlyCertifiedMembers}
        />
        <MetricCard title="Total Certified" value={data.certifiedMembers} />
        <MetricCard
          title="Average Attendance"
          value={data.averageAttendance}
          suffix="%"
        />
        <MetricCard
          title="Volunteer Engagement"
          value={data.volunteerEngagement}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrainingOverviewChart dataPoints={data.trainingOverview} />
        <CertificationsChart
          totalCount={data.totalMembers}
          certifiedCount={data.certifiedMembers}
        />
      </div>
    </>
  )
}
