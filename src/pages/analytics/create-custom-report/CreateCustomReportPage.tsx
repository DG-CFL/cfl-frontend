import { useCallback, useState } from "react"
import type { DateRange } from "react-day-picker"
import { ChevronLeft, Download } from "lucide-react"
import { format } from "date-fns"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ReportStepCard } from "./ReportStepCard"
import { ReportStepper } from "./ReportStepper"
import { StepSelectMetrics } from "./steps/StepSelectMetrics"
import { StepDateRange } from "./steps/StepDateRange"
import { StepVisualisation } from "./steps/StepVisualisation"
import { StepReviewGenerate } from "./steps/StepReviewGenerate"
import type {
  ExportFormat,
  MetricId,
  VisualisationId,
} from "./reportTypes"

const DISPLAY_FMT = "dd/MM/yyyy"

export default function CreateCustomReportPage() {
  const [step, setStep] = useState(1)
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricId>>(
    () => new Set()
  )
  const [range, setRange] = useState<DateRange | undefined>()
  const [visualisation, setVisualisation] =
    useState<VisualisationId>("table")
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf")
  const [generated, setGenerated] = useState(false)

  const toggleMetric = useCallback((id: MetricId) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const canGoNext = useCallback(() => {
    if (step === 1) return selectedMetrics.size > 0
    if (step === 2) return Boolean(range?.from && range?.to)
    if (step === 3) return true
    return false
  }, [step, selectedMetrics, range])

  const goNext = () => {
    if (!canGoNext()) return
    if (step < 4) {
      setStep((s) => s + 1)
      setGenerated(false)
    }
  }

  const goPrev = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      setGenerated(false)
    }
  }

  const dateLabel =
    range?.from && range?.to
      ? `${format(range.from, DISPLAY_FMT)} - ${format(range.to, DISPLAY_FMT)}`
      : "—"

  const handleGenerate = () => {
    setGenerated(true)
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F7F7] p-6 pb-16">
      <Link
        to="/analytics"
        className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to dashboard
      </Link>

      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          Create Custom Report
        </h1>
        <p className="text-base text-gray-500">
          Create, customise, and export professional reports.
        </p>
      </div>

      <div className="mb-8">
        <ReportStepper currentStep={step} />
      </div>

      {step === 1 && (
        <ReportStepCard
          title="Step 1: Select Metrics"
          description="Choose the KPI metrics you want to include in your report."
        >
          <StepSelectMetrics
            selected={selectedMetrics}
            onToggle={toggleMetric}
          />
        </ReportStepCard>
      )}

      {step === 2 && (
        <ReportStepCard
          title="Step 2: Choose Date Range"
          description="Select the time period for your report using the datepicker or typing."
        >
          <StepDateRange range={range} onRangeChange={setRange} />
        </ReportStepCard>
      )}

      {step === 3 && (
        <ReportStepCard
          title="Step 3: Choose Visualisation"
          description="Select how you want to visualise your data."
        >
          <StepVisualisation
            value={visualisation}
            onChange={setVisualisation}
          />
        </ReportStepCard>
      )}

      {step === 4 && (
        <ReportStepCard
          title="Step 4: Review & Generate"
          description="Confirm your choices and export format."
        >
          <StepReviewGenerate
            metricIds={[...selectedMetrics]}
            dateLabel={dateLabel}
            visualisation={visualisation}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            generated={generated}
          />
        </ReportStepCard>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-gray-300 bg-white px-4 text-gray-600 shadow-none hover:bg-gray-50 disabled:opacity-40"
          onClick={goPrev}
          disabled={step === 1}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        {step < 4 ? (
          <Button
            type="button"
            className="h-10 rounded-lg border-0 bg-[#6B7C3F] px-6 text-white shadow-none hover:bg-[#5a6a35] disabled:opacity-40"
            onClick={goNext}
            disabled={!canGoNext()}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            className="h-10 rounded-lg border-0 bg-[#6B7C3F] px-6 text-white shadow-none hover:bg-[#5a6a35]"
            onClick={handleGenerate}
          >
            <Download className="size-4" />
            Generate Report
          </Button>
        )}
      </div>
    </div>
  )
}
