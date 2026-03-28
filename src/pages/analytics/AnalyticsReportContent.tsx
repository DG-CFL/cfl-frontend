import { ArrowDown, ArrowUp, Download, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAnalytics } from "@/operations/analytics";
import LoadingSkeleton from "../LoadingSkeleton";
import type { TrainingOverviewDataPoint } from "@/types/analytics";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive,
}: MetricCardProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span className="font-medium">{change}</span>
          </div>
          <span className="text-gray-500">vs. last year</span>
        </div>
        <div className="text-xs text-gray-400">2 min ago</div>
      </CardContent>
    </Card>
  );
}

type TrainingOverviewChartProps = {
  dataPoints: TrainingOverviewDataPoint[]
}

export function TrainingOverviewChart({dataPoints}: TrainingOverviewChartProps) {
  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const scalePeople = (value: number) => {
    const min = 50;
    const max = 250;
    return (
      padding.top +
      chartHeight -
      ((value - min) / (max - min)) * chartHeight
    );
  };

  const scaleSessions = (value: number) => {
    const min = 3;
    const max = 15;
    return (
      padding.top +
      chartHeight -
      ((value - min) / (max - min)) * chartHeight
    );
  };

  const xStep = chartWidth / (dataPoints.length - 1);

  const peoplePath = dataPoints
    .map(
      (point, i) =>
        `${i === 0 ? "M" : "L"} ${padding.left + i * xStep} ${scalePeople(
          point.people
        )}`
    )
    .join(" ");

  const sessionsPath = dataPoints
    .map(
      (point, i) =>
        `${i === 0 ? "M" : "L"} ${padding.left + i * xStep} ${scaleSessions(
          point.sessions
        )}`
    )
    .join(" ");

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
              const y = padding.top + (chartHeight / 4) * i;
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
              );
            })}

            {[50, 100, 150, 200, 250].map((value) => (
              <text
                key={value}
                x={padding.left - 10}
                y={scalePeople(value) + 4}
                textAnchor="end"
                className="fill-gray-600 text-xs"
              >
                {value}
              </text>
            ))}

            {[3, 6, 9, 12, 15].map((value) => (
              <text
                key={value}
                x={width - padding.right + 10}
                y={scaleSessions(value) + 4}
                textAnchor="start"
                className="fill-gray-600 text-xs"
              >
                {value}
              </text>
            ))}

            <path
              d={peoplePath}
              fill="none"
              stroke="#60A5FA"
              strokeWidth={2}
            />

            <path
              d={sessionsPath}
              fill="none"
              stroke="#10B981"
              strokeWidth={2}
            />

            {dataPoints.map((point, i) => (
              <circle
                key={`people-${i}`}
                cx={padding.left + i * xStep}
                cy={scalePeople(point.people)}
                r={4}
                fill="#60A5FA"
              />
            ))}

            {dataPoints.map((point, i) => (
              <circle
                key={`sessions-${i}`}
                cx={padding.left + i * xStep}
                cy={scaleSessions(point.sessions)}
                r={4}
                fill="#10B981"
              />
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

type CertificationChartProps = {
  totalCount: number
  certifiedCount: number
}

export function CertificationsChart({totalCount, certifiedCount}: CertificationChartProps) {
 
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const certifiedOffset = circumference - (certifiedCount / totalCount) * circumference;
  const certifiedPercent = Math.round((certifiedCount / totalCount) * 100)

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
                {certifiedPercent}%
              </div>
              <div className="text-sm text-gray-600">of members</div>
              <div className="text-sm text-gray-600">certified</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-700" />
              <span className="text-sm text-gray-600">Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-200" />
              <span className="text-sm text-gray-600">Uncertified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Same metrics + charts as the main Analytics page (for live view and PDF preview). */
export function AnalyticsReportContent() {
  const { data, isLoading} = useGetAnalytics()

  if (isLoading || !data) {
    return <LoadingSkeleton/>
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Training Sessions"
          value={data.totalTrainingSessions}
          change="35%"
          isPositive={true}
        />
        <MetricCard
          title="No. of People Trained"
          value={data.numberPeopleTrained}
          change="20%"
          isPositive={true}
        />
        <MetricCard
          title="Newly Certified Volunteers"
          value={data.newlyCertifiedMembers}
          change="14%"
          isPositive={true}
        />
        <MetricCard
          title="Total Certified"
          value={data.certifiedMembers}
          change="5%"
          isPositive={true}
        />
        <MetricCard
          title="Average Attendance"
          value={data.averageAttendance}
          change="35%"
          isPositive={true}
        />
        <MetricCard
          title="Volunteer Engagement"
          value={data.volunteerEngagement}
          change="25%"
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrainingOverviewChart dataPoints={data.trainingOverview}/>
        <CertificationsChart totalCount={data.totalMembers} certifiedCount={data.certifiedMembers}/>
      </div>
    </>
  );
}
