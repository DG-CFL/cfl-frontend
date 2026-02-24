import type {
  CalendarCategory,
  CalendarCategoryColors,
} from '../SampleCalendarData'
import { CalendarBody, CalendarHeader } from '@/components/ui/calendarpage'
import type { Event } from '@/types/events'
import { Link } from '@tanstack/react-router'

type CalendarMonthViewProps = {
  events: Array<Event>
  colors: CalendarCategoryColors
  selectedDate?: Date
}

const CalendarMonthView = ({
  events,
  colors,
  selectedDate,
}: CalendarMonthViewProps) => {
  console.log(events)
  return (
    <div className="flex h-full flex-col bg-white">
      <CalendarHeader className="border-t border-muted-foreground/20 bg-white" />
      <CalendarBody events={events} selectedDate={selectedDate}>
        {({ event }) => {
          const palette = colors[event.category]

          return (
            <Link
              to="/events/$eventId/view"
              params={{ eventId: event.eventId.toString() }}
            >
              <span
                key={event.eventId}
                className="flex items-center truncate rounded-md px-2 py-1 font-poppins text-xs font-medium leading-4"
                style={{
                  backgroundColor: palette.background,
                  color: palette.text,
                }}
              >
                {event.name}
              </span>
            </Link>
          )
        }}
      </CalendarBody>
    </div>
  )
}

export default CalendarMonthView
