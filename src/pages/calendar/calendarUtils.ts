import { getHours, getMinutes, isSameDay } from 'date-fns'
import type {
  CalendarCategory,
  CalendarCategoryColors,
} from '@/pages/calendar/SampleCalendarData'
import type { Event } from '@/types/events'

export const getDayEventsLayout = (
  day: Date,
  events: Event[],
  colors: CalendarCategoryColors,
) => {
  const dayEvents = events.filter((event) => isSameDay(event.startDate, day))

  // 1. Prepare and Sort
  const eventsWithTime = dayEvents
    .map((event) => {
      const startHour = getHours(event.startDate)
      const startMinute = getMinutes(event.startDate)
      const endHour = getHours(event.endDate)
      const endMinute = getMinutes(event.endDate)

      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute

      return {
        original: event,
        start: startMinutes,
        end: endMinutes,
        duration: endMinutes - startMinutes,
        id: event.eventId,
      }
    })
    .sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start
      return b.duration - a.duration
    })

  // 2. Pack into columns
  const processed: any[] = []
  eventsWithTime.forEach((ev) => {
    let colIndex = 0
    while (true) {
      const collision = processed.find(
        (p) => p.colIndex === colIndex && p.end > ev.start,
      )
      if (!collision) break
      colIndex++
    }
    processed.push({ ...ev, colIndex })
  })

  // 3. Group into clusters to determine width
  const clusters: any[][] = []
  processed.forEach((ev) => {
    const lastCluster = clusters[clusters.length - 1]
    if (lastCluster) {
      const clusterEnd = Math.max(...lastCluster.map((e) => e.end))
      if (ev.start < clusterEnd) {
        lastCluster.push(ev)
        return
      }
    }
    clusters.push([ev])
  })

  // 4. Calculate styles
  const results: any[] = []
  clusters.forEach((cluster) => {
    const maxCol = Math.max(...cluster.map((e) => e.colIndex))
    const numCols = maxCol + 1

    cluster.forEach((ev) => {
      const pixelsPerMinute = 64 / 60
      const top = ev.start * pixelsPerMinute
      const height = ev.duration * pixelsPerMinute
      const widthPercent = 100 / numCols
      const leftPercent = ev.colIndex * widthPercent

      const color = colors[ev.original.status.id as CalendarCategory]

      results.push({
        event: ev.original,
        style: {
          top: `${top}px`,
          height: `${height}px`,
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          backgroundColor: color?.background || '#e2e8f0',
          color: color?.text || '#1e293b',
          position: 'absolute' as const,
        },
      })
    })
  })

  return results
}
