import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { VISUALISATION_OPTIONS, type VisualisationId } from "../reportTypes"

type StepVisualisationProps = {
  value: VisualisationId
  onChange: (id: VisualisationId) => void
}

function TableGraphic() {
  return (
    <svg viewBox="0 0 80 56" className="w-full max-w-[5.5rem]" aria-hidden>
      <rect x="4" y="8" width="72" height="10" rx="1" fill="#6B7C3F" />
      <rect x="4" y="22" width="72" height="6" rx="1" fill="#E5E7EB" />
      <rect x="4" y="32" width="72" height="6" rx="1" fill="#E5E7EB" />
      <rect x="4" y="42" width="72" height="6" rx="1" fill="#E5E7EB" />
    </svg>
  )
}

function LineGraphic() {
  return (
    <svg viewBox="0 0 80 56" className="w-full max-w-[5.5rem]" aria-hidden>
      <line x1="8" y1="44" x2="72" y2="44" stroke="#D1D5DB" strokeWidth="1" />
      <line x1="8" y1="12" x2="8" y2="44" stroke="#D1D5DB" strokeWidth="1" />
      <polyline
        points="12,36 28,20 44,28 60,14 68,22"
        fill="none"
        stroke="#6B7C3F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BarGraphic() {
  return (
    <svg viewBox="0 0 80 56" className="w-full max-w-[5.5rem]" aria-hidden>
      <rect x="10" y="28" width="12" height="22" rx="1" fill="#A2C367" />
      <rect x="28" y="18" width="12" height="32" rx="1" fill="#6B7C3F" />
      <rect x="46" y="24" width="12" height="26" rx="1" fill="#A2C367" />
      <rect x="64" y="12" width="12" height="38" rx="1" fill="#6B7C3F" />
    </svg>
  )
}

function PieGraphic() {
  return (
    <svg viewBox="0 0 80 56" className="w-full max-w-[5.5rem]" aria-hidden>
      <circle cx="40" cy="28" r="20" fill="#A2C367" />
      <path
        d="M 40 28 L 40 8 A 20 20 0 1 1 24 44 Z"
        fill="#6B7C3F"
      />
    </svg>
  )
}

const graphics: Record<VisualisationId, ReactNode> = {
  table: <TableGraphic />,
  line: <LineGraphic />,
  bar: <BarGraphic />,
  pie: <PieGraphic />,
}

export function StepVisualisation({ value, onChange }: StepVisualisationProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {VISUALISATION_OPTIONS.map((opt) => {
        const selected = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border-2 bg-white p-4 text-center transition-all",
              selected
                ? "border-[#6B7C3F] ring-2 ring-[#6B7C3F]/20"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                selected
                  ? "border-[#6B7C3F] bg-[#6B7C3F]"
                  : "border-gray-300 bg-white"
              )}
            >
              {selected && (
                <span className="size-1.5 rounded-full bg-white" />
              )}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {opt.label}
            </span>
            <div className="flex min-h-[3.5rem] items-center justify-center text-gray-400">
              {graphics[opt.id]}
            </div>
          </button>
        )
      })}
    </div>
  )
}
