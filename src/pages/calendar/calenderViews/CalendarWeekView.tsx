import { useEffect, useMemo, useRef } from 'react'
import { addDays, differenceInMinutes, format, startOfWeek } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CalendarCategoryColors } from '@/pages/calendar/SampleCalendarData'
import { getDayEventsLayout } from '../calendarUtils'
import type { Event } from '@/types/events'
import { Link } from '@tanstack/react-router'

type CalendarWeekViewProps = {
  events?: Event[]
  colors?: CalendarCategoryColors
  selectedDate?: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => i) // 00:00 to 23:00

const CalendarWeekView = ({
  events = [],
  colors = {} as CalendarCategoryColors,
  selectedDate = new Date(),
}: CalendarWeekViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }) // Sunday start
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  }, [weekStart])

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to 08:00 (8 * 64px = 512px)
      scrollRef.current.scrollTop = 512
    }
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div ref={scrollRef} className="flex flex-1 flex-col overflow-auto">
        <div className="min-w-[800px] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 flex border-b border-[#94A3B8] bg-white">
            <div className="w-16 flex-shrink-0 border-r border-[#94A3B8] bg-white" />{' '}
            {/* Time column header spacer */}
            <div className="flex flex-1">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 border-r border-[#94A3B8] py-3 text-center last:border-r-0',
                    'bg-white',
                  )}
                >
                  <div className="text-lg font-bold text-black">
                    {format(day, 'd MMM')}
                  </div>
                  <div className="text-sm font-medium text-black">
                    {format(day, 'EEEE')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex">
            {/* Time Column */}
            <div className="w-16 flex-shrink-0 bg-white text-xs text-gray-500 select-none">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="relative h-16 border-r border-[#94A3B8]"
                >
                  {hour !== 0 && (
                    <span className="absolute -top-2 right-2 text-[11px] font-medium text-gray-900">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Week Grid */}
            <div className="relative flex flex-1">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-[#94A3B8] box-border"
                  />
                ))}
              </div>

              {/* Vertical Day Lines */}
              <div className="absolute inset-0 flex">
                {weekDays.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-[#94A3B8] last:border-r-0"
                  />
                ))}
              </div>

              {/* Events */}
              <div className="absolute inset-0 flex">
                {weekDays.map((day, i) => (
                  <div key={i} className="relative flex-1">
                    {getDayEventsLayout(day, events, colors).map(
                      ({ event, style }) => {
                        const durationInMinutes = differenceInMinutes(
                          event.endDate,
                          event.startDate,
                        )
                        const isShortEvent = durationInMinutes < 45
                        const isVeryShortEvent = durationInMinutes < 20

                        return (
                          <Link
                            to="/events/$eventId/view"
                            params={{ eventId: event.id }}
                          >
                            <div
                              key={event.id}
                              className={cn(
                                'absolute flex overflow-hidden rounded-md shadow-sm ring-1 ring-black/5 transition-all hover:z-10 hover:shadow-md',
                                isShortEvent
                                  ? 'flex-row items-center px-1'
                                  : 'flex-col p-1',
                                isVeryShortEvent
                                  ? 'text-[10px] leading-none'
                                  : 'text-xs',
                              )}
                              style={style}
                            >
                              {isShortEvent ? (
                                <div className="flex items-center gap-1 truncate">
                                  <span className="font-semibold">
                                    {event.name}
                                  </span>
                                  <span className="opacity-80">
                                    {format(event.startDate, 'HH:mm')}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div className="font-semibold truncate">
                                    {event.name}
                                  </div>
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
                                      {format(event.startDate, 'HH:mm')} -{' '}
                                      {format(event.endDate, 'HH:mm')}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </Link>
                        )
                      },
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarWeekView
