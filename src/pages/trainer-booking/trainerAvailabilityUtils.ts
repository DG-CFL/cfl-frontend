import { eachDayOfInterval, format, parse } from "date-fns"

export function formatDayLabel(isoDate: string): {
  formattedDate: string
  dayName: string
} {
  const d = parse(isoDate, "yyyy-MM-dd", new Date())
  return {
    formattedDate: format(d, "MMM d, yyyy"),
    dayName: format(d, "EEE"),
  }
}

export function daysInRange(from: Date, to: Date): Array<string> {
  return eachDayOfInterval({ start: from, end: to }).map((d) =>
    format(d, "yyyy-MM-dd"),
  )
}

export type SlotSelection = { date: string; time: string }

export function intervalToSlot(
  interval: number,
  selectedDays: Array<string>,
  startHour: number,
  endHour: number,
  intervalsPerTimeslot: number,
): SlotSelection {
  const intervalsPerDay =
    (endHour - startHour + 1) * intervalsPerTimeslot
  const dayIndex = Math.floor(interval / intervalsPerDay)
  const timeIndex = interval % intervalsPerDay
  const hour =
    Math.floor(timeIndex / intervalsPerTimeslot) + startHour
  const minute =
    (timeIndex % intervalsPerTimeslot) * (60 / intervalsPerTimeslot)
  const time = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`
  return { date: selectedDays[dayIndex], time }
}
