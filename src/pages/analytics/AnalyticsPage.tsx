import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useGetAnalytics } from "@/operations/analytics";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function MetricCard({ title, value, change, isPositive }: MetricCardProps) {
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
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
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

function TrainingOverviewChart() {
  // Sample data points for the line chart
  const dataPoints = [
    { people: 120, sessions: 5 },
    { people: 150, sessions: 7 },
    { people: 180, sessions: 8 },
    { people: 200, sessions: 10 },
    { people: 220, sessions: 12 },
    { people: 240, sessions: 12 },
    { people: 250, sessions: 15 },
  ];

  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale for people (left axis: 50-250)
  const scalePeople = (value: number) => {
    const min = 50;
    const max = 250;
    return (
      padding.top +
      chartHeight -
      ((value - min) / (max - min)) * chartHeight
    );
  };

  // Scale for sessions (right axis: 3-15)
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

  // Generate path for people line
  const peoplePath = dataPoints
    .map(
      (point, i) =>
        `${i === 0 ? "M" : "L"} ${padding.left + i * xStep} ${scalePeople(
          point.people
        )}`
    )
    .join(" ");

  // Generate path for sessions line
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
        <CardTitle className="text-lg font-semibold">Training overview</CardTitle>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-sm text-gray-600">No. of people trained</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Training sessions</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <svg width={width} height={height} className="min-w-full">
            {/* Grid lines */}
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

            {/* Left Y-axis labels (People) */}
            {[50, 100, 150, 200, 250].map((value) => (
              <text
                key={value}
                x={padding.left - 10}
                y={scalePeople(value) + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {value}
              </text>
            ))}

            {/* Right Y-axis labels (Sessions) */}
            {[3, 6, 9, 12, 15].map((value) => (
              <text
                key={value}
                x={width - padding.right + 10}
                y={scaleSessions(value) + 4}
                textAnchor="start"
                className="text-xs fill-gray-600"
              >
                {value}
              </text>
            ))}

            {/* People line */}
            <path
              d={peoplePath}
              fill="none"
              stroke="#60A5FA"
              strokeWidth={2}
            />

            {/* Sessions line */}
            <path
              d={sessionsPath}
              fill="none"
              stroke="#10B981"
              strokeWidth={2}
            />

            {/* Data points for people */}
            {dataPoints.map((point, i) => (
              <circle
                key={`people-${i}`}
                cx={padding.left + i * xStep}
                cy={scalePeople(point.people)}
                r={4}
                fill="#60A5FA"
              />
            ))}

            {/* Data points for sessions */}
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

function CertificationsChart() {
  const certified = 65;
  const uncertified = 35;
  const total = certified + uncertified;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const certifiedOffset = circumference - (certified / total) * circumference;

  return (
    <Card className="bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          <div className="relative">
            <svg width={200} height={200} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={100}
                cy={100}
                r={radius}
                fill="none"
                stroke="#D1FAE5"
                strokeWidth={20}
              />
              {/* Certified segment */}
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
              <div className="text-4xl font-bold text-gray-900">{certified}%</div>
              <div className="text-sm text-gray-600">of members</div>
              <div className="text-sm text-gray-600">certified</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-700" />
              <span className="text-sm text-gray-600">Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-200" />
              <span className="text-sm text-gray-600">Uncertified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const {data: analytics, isLoading } = useGetAnalytics()

  console.log(analytics)


  const [timePeriod, setTimePeriod] = useState("this-year");

  return (
    <div className="w-full min-h-screen bg-[#F7F7F7] p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger 
              size="sm"
              className="!w-[140px] !h-9 !bg-white !border !border-gray-300 !text-gray-600 hover:!bg-gray-50 !rounded-lg !px-3 !text-sm !shadow-none data-[size=sm]:!h-9 data-[size=default]:!h-9"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="h-9 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg px-4 text-sm font-normal shadow-none"
          >
            <Plus className="w-4 h-4 mr-2 text-gray-600" />
            Create Custom Report
          </Button>
          <Button 
            className="h-9 bg-[#6B7C3F] hover:bg-[#5a6a35] text-white border-0 rounded-lg px-4 text-sm font-normal shadow-none"
          >
            <Download className="w-4 h-4 mr-2 text-white" />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="Total Training Sessions"
          value="12 / 15"
          change="35%"
          isPositive={true}
        />
        <MetricCard
          title="No. of People Trained"
          value="240"
          change="20%"
          isPositive={true}
        />
        <MetricCard
          title="Newly Certified Volunteers"
          value="45"
          change="14%"
          isPositive={true}
        />
        <MetricCard
          title="Total Certified"
          value="892"
          change="5%"
          isPositive={true}
        />
        <MetricCard
          title="Average Attendance"
          value="94.3%"
          change="35%"
          isPositive={true}
        />
        <MetricCard
          title="Volunteer Engagement"
          value="78 / 100"
          change="25%"
          isPositive={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrainingOverviewChart />
        <CertificationsChart />
      </div>
    </div>
  );
}

