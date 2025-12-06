import { format, isSameMonth } from 'date-fns'
import { Clock, MapPin, User } from 'lucide-react'
import type { Feature } from '@/components/ui/calendarpage'
import type { CalendarCategory, CalendarCategoryColors } from '@/pages/calendar/SampleCalendarData'

type CalendarEventListViewProps = {
  features: Feature[]
  colors: CalendarCategoryColors
  selectedDate: Date
}

const CalendarEventListView = ({ features, colors, selectedDate }: CalendarEventListViewProps) => {
  // Filter events by selected month and sort by date
  const sortedFeatures = features
    .filter(feature => isSameMonth(feature.startAt, selectedDate))
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

  // Group by date
  const groupedFeatures: { [key: string]: Feature[] } = {}
  sortedFeatures.forEach(feature => {
    const dateKey = format(feature.startAt, 'yyyy-MM-dd')
    if (!groupedFeatures[dateKey]) {
      groupedFeatures[dateKey] = []
    }
    groupedFeatures[dateKey].push(feature)
  })

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="space-y-6 pt-6">
          {Object.entries(groupedFeatures).map(([dateKey, events]) => {
            const date = new Date(dateKey)
            return (
              <div key={dateKey} className="flex gap-6">
                {/* Date Column */}
                <div className="flex w-32 flex-shrink-0 flex-col items-start rounded-lg bg-[#F1F5F9] p-4">
                  <span className="text-xl font-bold text-[#0F172A]">
                    {format(date, 'MMM d')}
                  </span>
                  <span className="text-sm font-medium text-[#898C8C]">
                    {format(date, 'EEEE')}
                  </span>
                </div>

                {/* Events Column */}
                <div className="flex-1 space-y-3">
                  {events.map((event) => {
                    const color = colors[event.status.id as CalendarCategory]
                    
                    return (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 rounded-lg border border-[#9CA3AF] bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        {/* Color Strip */}
                        <div
                          className="w-1.5 self-stretch rounded-full"
                          style={{ backgroundColor: color?.background }}
                        />

                        {/* Event Details */}
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{event.name}</h4>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(event.startAt, 'h:mm a')}
                              </span>
                            </div>

                            {event.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}

                            {(event.currentAttendees !== undefined || event.maxAttendees !== undefined) && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                <span>
                                  {event.currentAttendees ?? 0} /{event.maxAttendees ?? 0}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          
          {sortedFeatures.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-center text-gray-500">
              <p className="text-lg font-medium">No events found for this month</p>
              <p className="text-sm">Try adjusting your filters or selecting a different month</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarEventListView
