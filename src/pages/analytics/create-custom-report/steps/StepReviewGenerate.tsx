import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  REPORT_METRICS,
  VISUALISATION_OPTIONS,
  type ExportFormat,
  type MetricId,
  type VisualisationId,
} from "../reportTypes"

type StepReviewGenerateProps = {
  metricIds: MetricId[]
  dateLabel: string
  visualisation: VisualisationId
  exportFormat: ExportFormat
  onExportFormatChange: (f: ExportFormat) => void
  generated: boolean
}

export function StepReviewGenerate({
  metricIds,
  dateLabel,
  visualisation,
  exportFormat,
  onExportFormatChange,
  generated,
}: StepReviewGenerateProps) {
  const labels = REPORT_METRICS.filter((m) => metricIds.includes(m.id)).map(
    (m) => m.label
  )
  const vizLabel =
    VISUALISATION_OPTIONS.find((v) => v.id === visualisation)?.label ?? ""

  return (
    <div className="space-y-6">
      <ReviewBlock title="Selected KPI Metrics">
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex rounded-full bg-[#6B7C3F]/12 px-3 py-1 text-sm font-medium text-[#5a6a35]"
            >
              {label}
            </span>
          ))}
        </div>
      </ReviewBlock>

      <ReviewBlock title="Date Range">
        <p className="text-sm font-medium text-gray-900">{dateLabel}</p>
      </ReviewBlock>

      <ReviewBlock title="Visualisation Type">
        <p className="text-sm font-medium text-gray-900">{vizLabel}</p>
      </ReviewBlock>

      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium text-gray-900">Save as?:</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          {(
            [
              { id: "pdf" as const, label: "PDF" },
              { id: "excel" as const, label: "Excel/CSV" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-800"
            >
              <button
                type="button"
                role="radio"
                aria-checked={exportFormat === opt.id}
                onClick={() => onExportFormatChange(opt.id)}
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  exportFormat === opt.id
                    ? "border-[#6B7C3F]"
                    : "border-gray-300"
                )}
              >
                {exportFormat === opt.id && (
                  <span className="size-2 rounded-full bg-[#6B7C3F]" />
                )}
              </button>
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {generated && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Report queued (demo). In production this would download{" "}
          {exportFormat === "pdf" ? "a PDF" : "a spreadsheet"}.
        </p>
      )}
    </div>
  )
}

function ReviewBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>
      {children}
    </div>
  )
}
