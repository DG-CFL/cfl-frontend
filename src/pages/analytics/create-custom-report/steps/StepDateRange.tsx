import { useEffect, useMemo, useState } from "react"
import {
  endOfMonth,
  endOfYear,
  format,
  parse,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns"
import type { DateRange } from "react-day-picker"
import { CalendarDays } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const DISPLAY_FMT = "dd/MM/yyyy"
const PLACEHOLDER = "DD / MM / YYYY"

type StepDateRangeProps = {
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
}

function parseDdMmYyyy(value: string): Date | undefined {
  const trimmed = value.replace(/\s/g, "")
  if (!trimmed) return undefined
  try {
    const d = parse(trimmed, "d/M/yyyy", new Date())
    return Number.isNaN(d.getTime()) ? undefined : d
  } catch {
    return undefined
  }
}

export function StepDateRange({ range, onRangeChange }: StepDateRangeProps) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [startDraft, setStartDraft] = useState("")
  const [endDraft, setEndDraft] = useState("")

  useEffect(() => {
    setStartDraft(range?.from ? format(range.from, DISPLAY_FMT) : "")
  }, [range?.from])

  useEffect(() => {
    setEndDraft(range?.to ? format(range.to, DISPLAY_FMT) : "")
  }, [range?.to])

  const defaultMonth = useMemo(
    () => range?.from ?? range?.to ?? new Date(),
    [range?.from, range?.to]
  )

  const applyPreset = (preset: "7d" | "month" | "year") => {
    const today = new Date()
    if (preset === "7d") {
      onRangeChange({ from: subDays(today, 6), to: today })
    } else if (preset === "month") {
      onRangeChange({ from: startOfMonth(today), to: endOfMonth(today) })
    } else {
      onRangeChange({ from: startOfYear(today), to: endOfYear(today) })
    }
  }

  const commitStart = () => {
    const d = parseDdMmYyyy(startDraft)
    if (d) onRangeChange({ from: d, to: range?.to })
    else if (range?.from) setStartDraft(format(range.from, DISPLAY_FMT))
    else setStartDraft("")
  }

  const commitEnd = () => {
    const d = parseDdMmYyyy(endDraft)
    if (d) onRangeChange({ from: range?.from, to: d })
    else if (range?.to) setEndDraft(format(range.to, DISPLAY_FMT))
    else setEndDraft("")
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div
        className={cn(
          "rounded-xl border border-gray-200 p-2",
          "[&_button[data-range-end=true]]:!bg-[#6B7C3F] [&_button[data-range-end=true]]:!text-white",
          "[&_button[data-range-middle=true]]:!bg-[#C8E6D9]/80 [&_button[data-range-middle=true]]:!text-gray-900",
          "[&_button[data-range-start=true]]:!bg-[#6B7C3F] [&_button[data-range-start=true]]:!text-white",
          "[&_button[data-selected-single=true]]:!bg-[#6B7C3F] [&_button[data-selected-single=true]]:!text-white"
        )}
      >
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={defaultMonth}
          selected={range}
          onSelect={onRangeChange}
          className="rounded-lg"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="space-y-2">
          <Label className="text-gray-700">Start Date</Label>
          <div className="flex gap-1">
            <Input
              className="h-11 flex-1 rounded-lg border-gray-200 shadow-none"
              placeholder={PLACEHOLDER}
              value={startDraft}
              onChange={(e) => setStartDraft(e.target.value)}
              onBlur={commitStart}
            />
            <Popover open={startOpen} onOpenChange={setStartOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 shrink-0 rounded-lg border-gray-200 shadow-none"
                  aria-label="Open start date calendar"
                >
                  <CalendarDays className="size-5 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={range?.from}
                  onSelect={(d) => {
                    onRangeChange({ from: d, to: range?.to })
                    setStartOpen(false)
                  }}
                  defaultMonth={range?.from}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">End Date</Label>
          <div className="flex gap-1">
            <Input
              className="h-11 flex-1 rounded-lg border-gray-200 shadow-none"
              placeholder={PLACEHOLDER}
              value={endDraft}
              onChange={(e) => setEndDraft(e.target.value)}
              onBlur={commitEnd}
            />
            <Popover open={endOpen} onOpenChange={setEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 shrink-0 rounded-lg border-gray-200 shadow-none"
                  aria-label="Open end date calendar"
                >
                  <CalendarDays className="size-5 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={range?.to}
                  onSelect={(d) => {
                    onRangeChange({ from: range?.from, to: d })
                    setEndOpen(false)
                  }}
                  defaultMonth={range?.to ?? range?.from}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "7d", label: "Last 7 Days" },
              { key: "month", label: "This Month" },
              { key: "year", label: "This year" },
            ] as const
          ).map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              className="h-9 rounded-full border-gray-300 bg-white text-gray-700 shadow-none hover:bg-gray-50"
              onClick={() => applyPreset(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
