import type { Feature } from '@/components/ui/calendarpage'
import type { CalendarCategory, CalendarCategoryColors } from '../SampleCalendarData'
import { CalendarBody, CalendarHeader } from '@/components/ui/calendarpage'

type CalendarMonthViewProps = {
  features: Array<Feature>
  colors: CalendarCategoryColors
}

const CalendarMonthView = ({ features, colors }: CalendarMonthViewProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-muted-foreground/20 bg-white shadow-md">
      <CalendarHeader className="border-b border-muted-foreground/10 bg-muted/30" />
      <CalendarBody features={features}>
        {({ feature }) => {
          const category = feature.status.id as CalendarCategory
          const palette = colors[category]

          return (
            <span
              key={feature.id}
              className="inline-flex items-center truncate rounded-full px-2 py-1 text-xs font-semibold"
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
