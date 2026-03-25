import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { REPORT_METRICS, type MetricId } from "../reportTypes"

type StepSelectMetricsProps = {
  selected: Set<MetricId>
  onToggle: (id: MetricId) => void
}

export function StepSelectMetrics({ selected, onToggle }: StepSelectMetricsProps) {
  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
      {REPORT_METRICS.map((metric) => {
        const isOn = selected.has(metric.id)
        return (
          <li key={metric.id}>
            <button
              type="button"
              onClick={() => onToggle(metric.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50/80"
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isOn
                    ? "border-[#6B7C3F] bg-[#6B7C3F]"
                    : "border-gray-300 bg-white"
                )}
                aria-hidden
              >
                {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {metric.label}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
