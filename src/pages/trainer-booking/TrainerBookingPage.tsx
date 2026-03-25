import { useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { CalendarClock, CheckCircle2, ChevronLeft } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { Dispatch, SetStateAction } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { StepDateRange } from "@/pages/analytics/create-custom-report/steps/StepDateRange"
import type { SlotSelection } from "@/pages/trainer-booking/trainerAvailabilityUtils"
import {
  daysInRange,
  formatDayLabel,
  intervalToSlot,
} from "@/pages/trainer-booking/trainerAvailabilityUtils"

const INTERVALS_PER_TIMESLOT = 2

export type TrainerBookingPayload = {
  dateRange: { fromIso: string; toIso: string }
  startHour: number
  endHour: number
  slots: Array<SlotSelection>
}

type Step = "dates" | "grid" | "success"

/** Flat indices are row-major (day × time). A linear [min,max] range wrongly fills whole days when dragging vertically. */
function intervalsInRectangle(
  flatA: number,
  flatB: number,
  intervalsPerDay: number,
): Array<number> {
  const d0 = Math.floor(flatA / intervalsPerDay)
  const s0 = flatA % intervalsPerDay
  const d1 = Math.floor(flatB / intervalsPerDay)
  const s1 = flatB % intervalsPerDay
  const dayMin = Math.min(d0, d1)
  const dayMax = Math.max(d0, d1)
  const slotMin = Math.min(s0, s1)
  const slotMax = Math.max(s0, s1)
  const out: Array<number> = []
  for (let d = dayMin; d <= dayMax; d++) {
    for (let s = slotMin; s <= slotMax; s++) {
      out.push(d * intervalsPerDay + s)
    }
  }
  return out
}

function AvailabilityGrid({
  selectedDays,
  startHour,
  endHour,
  markedIntervals,
  setMarkedIntervals,
}: {
  selectedDays: Array<string>
  startHour: number
  endHour: number
  markedIntervals: Array<number>
  setMarkedIntervals: Dispatch<SetStateAction<Array<number>>>
}) {
  const timeLabels = useMemo(
    () =>
      Array.from(
        { length: endHour - startHour + 1 },
        (_, i) => `${startHour + i}:00`,
      ),
    [startHour, endHour],
  )

  const intervalsPerDay = timeLabels.length * INTERVALS_PER_TIMESLOT

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)
  const [draggedOverIntervals, setDraggedOverIntervals] = useState<
    Array<number>
  >([])
  const [isOnMouseMarked, setIsOnMouseMarked] = useState<boolean | null>(null)
  const [prevState, setPrevState] = useState<Array<number>>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDragging(false)
        setMarkedIntervals(prevState)
        setDragStart(null)
        setDragEnd(null)
        setIsOnMouseMarked(null)
        setDraggedOverIntervals([])
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prevState, setMarkedIntervals])

  const handleInteractionStart = (interval: number) => {
    setPrevState(markedIntervals)
    setIsDragging(true)
    setDragStart(interval)
    setDragEnd(interval)
    setIsOnMouseMarked(markedIntervals.includes(interval))
    setDraggedOverIntervals([interval])
  }

  const handleInteractionMove = (interval: number) => {
    if (!isDragging || dragStart === null) return
    setDragEnd(interval)
    setDraggedOverIntervals(
      intervalsInRectangle(dragStart, interval, intervalsPerDay),
    )
  }

  const handleInteractionEnd = () => {
    if (dragStart !== null && dragEnd !== null) {
      const rangeIntervals = intervalsInRectangle(
        dragStart,
        dragEnd,
        intervalsPerDay,
      )

      setMarkedIntervals((prev) => {
        if (isOnMouseMarked) {
          return prev.filter((x) => !rangeIntervals.includes(x))
        }
        return [...new Set([...prev, ...rangeIntervals])]
      })
    }
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
    setIsOnMouseMarked(null)
    setDraggedOverIntervals([])
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isDragging) return
    const target = e.relatedTarget as HTMLElement | null
    if (!target || !target.dataset.interval) {
      handleInteractionEnd()
    }
  }

  const handleTouchStart = (interval: number, event: React.TouchEvent) => {
    handleInteractionStart(interval)
    event.preventDefault()
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    const el = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    ) as HTMLElement | null
    if (el?.dataset.interval) {
      handleInteractionMove(parseInt(el.dataset.interval, 10))
    }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    handleInteractionEnd()
    event.preventDefault()
  }

  if (selectedDays.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Select at least one day in the previous step.
      </p>
    )
  }

  return (
    <div
      className="touch-none select-none overflow-x-auto rounded-xl border border-gray-200 bg-white p-2"
      onMouseLeave={handleMouseLeave}
    >
      <p className="mb-3 text-sm text-gray-600">
        Click and drag across cells to toggle availability.
        Press Esc to undo the current drag.
      </p>
      <div className="flex min-w-[520px] flex-col">
        <div className="flex">
          <div className="w-8 shrink-0 md:w-10" />
          {timeLabels.map((label, timeIndex) => (
            <div
              key={timeIndex}
              className="flex-1 border border-gray-200 py-2 text-center text-[10px] md:text-xs lg:text-sm"
            >
              <span className="font-medium md:hidden">{label.split(":")[0]}</span>
              <span className="hidden md:inline">{label}</span>
            </div>
          ))}
        </div>
        {selectedDays.map((day, dayIndex) => {
          const { formattedDate, dayName } = formatDayLabel(day)
          return (
            <div key={day} className="flex h-24 md:h-28">
              <div
                className="flex w-8 shrink-0 flex-col justify-center border border-gray-200 px-0.5 text-center text-[9px] leading-tight md:w-10 md:text-[10px]"
                title={formattedDate}
              >
                <span className="font-semibold">{dayName}</span>
                <span className="text-muted-foreground">{formattedDate}</span>
              </div>
              <div className="flex flex-1">
                {Array.from({ length: intervalsPerDay }, (_, intervalIndex) => {
                  const interval = dayIndex * intervalsPerDay + intervalIndex
                  const highlighted = draggedOverIntervals.includes(interval)
                  const marked = markedIntervals.includes(interval)
                  return (
                    <div
                      key={interval}
                      data-interval={interval}
                      className={`flex-1 border-y border-r border-gray-200 first:border-l md:border ${
                        highlighted
                          ? isOnMouseMarked
                            ? "bg-red-200"
                            : "bg-emerald-200"
                          : marked
                            ? "bg-[#6B7C3F]/35"
                            : "bg-white hover:bg-gray-100"
                      }`}
                      onMouseDown={() => handleInteractionStart(interval)}
                      onMouseEnter={() => handleInteractionMove(interval)}
                      onMouseUp={handleInteractionEnd}
                      onTouchStart={(e) => handleTouchStart(interval, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TrainerBookingPage() {
  const [step, setStep] = useState<Step>("dates")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [startHour, setStartHour] = useState(8)
  const [endHour, setEndHour] = useState(21)
  const [markedIntervals, setMarkedIntervals] = useState<Array<number>>([])
  const [savedPayload, setSavedPayload] = useState<TrainerBookingPayload | null>(
    null,
  )

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  const selectedDays = useMemo(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return []
    return daysInRange(dateRange.from, dateRange.to)
  }, [dateRange])

  const goToGrid = useCallback(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return
    if (endHour <= startHour) return
    setMarkedIntervals([])
    setStep("grid")
  }, [dateRange, endHour, startHour])

  const confirmBooking = useCallback(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return
    const slots = [...new Set(markedIntervals)]
      .sort((a, b) => a - b)
      .map((interval) =>
        intervalToSlot(
          interval,
          selectedDays,
          startHour,
          endHour,
          INTERVALS_PER_TIMESLOT,
        ),
      )

    const payload: TrainerBookingPayload = {
      dateRange: {
        fromIso: format(dateRange.from, "yyyy-MM-dd"),
        toIso: format(dateRange.to, "yyyy-MM-dd"),
      },
      startHour,
      endHour,
      slots,
    }
    setSavedPayload(payload)
    setStep("success")
  }, [dateRange, endHour, markedIntervals, selectedDays, startHour])

  const resetFlow = () => {
    setStep("dates")
    setDateRange(undefined)
    setMarkedIntervals([])
    setSavedPayload(null)
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6B7C3F]/15 text-[#6B7C3F]">
              <CalendarClock className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Trainer booking
              </h1>
              <p className="text-sm text-gray-600">
                Set your availability window, then paint open times on the grid.
              </p>
            </div>
          </div>
          {step !== "dates" && (
            <Button
              type="button"
              variant="outline"
              className="w-fit rounded-lg border-gray-300 bg-white shadow-none"
              onClick={() => {
                if (step === "success") resetFlow()
                else setStep("dates")
              }}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {step === "success" ? "Start over" : "Back"}
            </Button>
          )}
        </div>

        {step === "dates" && (
          <div className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                1. Choose dates
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Pick a start and end date for the period you want to offer.
              </p>
              <StepDateRange range={dateRange} onRangeChange={setDateRange} />
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                2. Daily hours
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                These bounds define the columns on the availability grid (same
                idea as the event time window in the calendar tools).
              </p>
              <div className="flex flex-wrap items-end gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tb-start-hour">Start</Label>
                  <select
                    id="tb-start-hour"
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm shadow-none"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tb-end-hour">End</Label>
                  <select
                    id="tb-end-hour"
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm shadow-none"
                  >
                    {hours
                      .filter((h) => h > startHour)
                      .map((h) => (
                        <option key={h} value={h}>
                          {h}:00
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-6">
              <Button
                type="button"
                className="rounded-lg bg-[#6B7C3F] px-6 text-white hover:bg-[#5a6a35]"
                disabled={
                  !dateRange ||
                  !dateRange.from ||
                  !dateRange.to ||
                  endHour <= startHour
                }
                onClick={goToGrid}
              >
                Continue to grid
              </Button>
            </div>
          </div>
        )}

        {step === "grid" && (
          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                3. Mark your availability
              </h2>
              <p className="text-sm text-gray-600">
                Drag to select 30-minute blocks. Drag again over selected blocks
                to remove them.
              </p>
            </div>

            <AvailabilityGrid
              selectedDays={selectedDays}
              startHour={startHour}
              endHour={endHour}
              markedIntervals={markedIntervals}
              setMarkedIntervals={setMarkedIntervals}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-600">
                {markedIntervals.length} block
                {markedIntervals.length === 1 ? "" : "s"} selected
              </p>
              <Button
                type="button"
                className="rounded-lg bg-[#6B7C3F] px-6 text-white hover:bg-[#5a6a35]"
                onClick={confirmBooking}
              >
                Confirm availability
              </Button>
            </div>
          </div>
        )}

        {step === "success" && savedPayload && (
          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-9 w-9" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Availability saved locally
              </h2>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                This preview does not call the API yet. Your selection is stored
                in memory as{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                  savedPayload
                </code>{" "}
                for the next integration step.
              </p>
            </div>

            <dl className="grid gap-3 rounded-xl bg-[#F7F7F7] p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Date range</dt>
                <dd className="font-medium text-gray-900">
                  {savedPayload.dateRange.fromIso} →{" "}
                  {savedPayload.dateRange.toIso}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Hours</dt>
                <dd className="font-medium text-gray-900">
                  {savedPayload.startHour}:00 – {savedPayload.endHour}:00
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Slots</dt>
                <dd className="font-medium text-gray-900">
                  {savedPayload.slots.length} time block
                  {savedPayload.slots.length === 1 ? "" : "s"}
                </dd>
              </div>
            </dl>

            <details className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                View raw payload
              </summary>
              <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-[#0E121B] p-4 text-left text-xs text-emerald-100">
                {JSON.stringify(savedPayload, null, 2)}
              </pre>
            </details>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-gray-300"
                onClick={resetFlow}
              >
                Book another window
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
