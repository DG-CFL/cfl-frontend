import type { Feature } from '@/components/ui/calendarpage'
import type { CalendarCategory, CalendarCategoryColors } from '../SampleCalendarData'
import { CalendarBody, CalendarHeader } from '@/components/ui/calendarpage'

type CalendarMonthViewProps = {
  features: Array<Feature>
  colors: CalendarCategoryColors
  selectedDate?: Date
}

const CalendarMonthView = ({ features, colors, selectedDate }: CalendarMonthViewProps) => {
  return (
    <div className="flex flex-1 min-h-0 flex-col bg-white">
      <CalendarHeader className="border-t border-muted-foreground/20 bg-white" />
      <CalendarBody features={features} selectedDate={selectedDate}>
        {({ feature }) => {
          const category = feature.status.id as CalendarCategory
          const palette = colors[category]

          return (
            <span
              key={feature.id}
              className="flex items-center truncate rounded-md px-2 py-1 font-poppins text-xs font-medium leading-4"
              style={{ backgroundColor: palette.background, color: palette.text }}
            >
              {feature.name}
            </span>
          )
        }}
      </CalendarBody>
    </div>
  )
}

export default CalendarMonthView
