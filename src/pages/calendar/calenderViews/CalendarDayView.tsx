import { useEffect, useRef } from 'react'
import { format, getHours, getMinutes, isSameDay } from 'date-fns'
import type { Feature } from '@/components/ui/calendarpage'
import type { CalendarCategory, CalendarCategoryColors } from '@/pages/calendar/SampleCalendarData'

type CalendarDayViewProps = {
  features?: Feature[]
  colors?: CalendarCategoryColors
  selectedDate?: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => i) // 00:00 to 23:00

const CalendarDayView = ({ features = [], colors = {} as CalendarCategoryColors, selectedDate = new Date() }: CalendarDayViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to 08:00 (8 * 64px = 512px)
      scrollRef.current.scrollTop = 512
    }
  }, [])

  const getDayEventsLayout = (day: Date) => {
    const dayEvents = features.filter((event) => isSameDay(event.startAt, day))

    // 1. Prepare and Sort
    const eventsWithTime = dayEvents.map((event) => {
      const startHour = getHours(event.startAt)
      const startMinute = getMinutes(event.startAt)
      const endHour = getHours(event.endAt)
      const endMinute = getMinutes(event.endAt)

      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute
      
      return {
        original: event,
        start: startMinutes,
        end: endMinutes,
        duration: endMinutes - startMinutes,
        id: event.id,
      }
    }).sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start
      return b.duration - a.duration
    })

    // 2. Pack into columns
    const processed: any[] = []
    eventsWithTime.forEach((ev) => {
      let colIndex = 0
      while (true) {
        const collision = processed.find((p) => 
          p.colIndex === colIndex && 
          p.end > ev.start
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

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div ref={scrollRef} className="flex flex-1 flex-col overflow-auto">
        <div className="min-w-[600px] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 flex border-b border-[#94A3B8] bg-white">
            <div className="w-16 flex-shrink-0 border-r border-[#94A3B8] bg-white" /> {/* Time column header spacer */}
            <div className="flex flex-1 items-center justify-center py-3 text-center">
              <span className="text-lg font-bold text-gray-900">{format(selectedDate, 'd MMM, EEEE')}</span>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex">
            {/* Time Column */}
            <div className="w-16 flex-shrink-0 bg-white text-xs text-gray-500 select-none">
              {HOURS.map((hour) => (
                <div key={hour} className="relative h-16 border-r border-[#94A3B8]">
                  {hour !== 0 && (
                    <span className="absolute -top-2 right-2 text-[11px] font-medium text-gray-900">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="relative flex-1">
              {/* Grid Lines */}
              {HOURS.map((hour) => (
                <div key={hour} className="h-16 border-b border-[#94A3B8] box-border" />
              ))}

              {/* Events */}
              {getDayEventsLayout(selectedDate).map(({ event, style }) => (
                <div
                  key={event.id}
                  className="absolute flex flex-col overflow-hidden rounded-md p-1 text-xs shadow-sm ring-1 ring-black/5 transition-all hover:z-10 hover:shadow-md"
                  style={style}
                >
                  <div className="font-semibold truncate">{event.name}</div>
                  <div className="mt-0.5 flex items-start gap-1 opacity-80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-0.5 h-3 w-3 flex-shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="leading-tight break-words">
                      {format(event.startAt, 'HH:mm')} - {format(event.endAt, 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarDayView
