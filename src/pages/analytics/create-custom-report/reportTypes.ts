export const REPORT_PRIMARY = "#6B7C3F"
export const REPORT_PRIMARY_HOVER = "#5a6a35"

export const REPORT_METRICS = [
  { id: "training_sessions", label: "Training sessions conducted" },
  { id: "people_trained", label: "People trained" },
  { id: "newly_certified", label: "Newly certified volunteers" },
  { id: "total_certified", label: "Total certified volunteers (Cumulative)" },
  { id: "attendance_rate", label: "Attendance rate" },
  { id: "certification_ratio", label: "Certification ratio" },
] as const

export type MetricId = (typeof REPORT_METRICS)[number]["id"]

export const VISUALISATION_OPTIONS = [
  { id: "table", label: "Table" },
  { id: "line", label: "Line Chart" },
  { id: "bar", label: "Bar Graph" },
  { id: "pie", label: "Pie Chart" },
] as const

export type VisualisationId = (typeof VISUALISATION_OPTIONS)[number]["id"]

export type ExportFormat = "pdf" | "excel"
