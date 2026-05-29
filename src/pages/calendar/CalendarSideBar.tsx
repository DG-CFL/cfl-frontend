import { useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfMonth, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CalendarBarProps = {
  sidebarTitle: string
  selectedDate: Date
  onSelectDate: (date?: Date) => void
}

// The sidebar containing the mini calendar.
const CalendarBar = ({
  selectedDate,
  onSelectDate,
}: CalendarBarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayOfWeek = getDay(monthStart)
  const paddingDays = Array(startDayOfWeek).fill(null)
  
  // Calculate total calendar cells needed (always 6 rows x 7 days = 42 cells)
  const totalCells = 42
  const totalDays = paddingDays.length + allDays.length
  const trailingPaddingCount = totalCells - totalDays

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <aside className="h-full w-[300px] flex-shrink-0 border-r border-gray-100 bg-white p-6">
      <div className="flex h-full flex-col gap-8">
        <div>
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-[#0E121B]">Calendar</h1>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="whitespace-nowrap font-semibold">{format(currentMonth, 'MMMM yyyy')}</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:bg-muted"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:bg-muted"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-7 justify-items-center gap-1 text-center">
                {dayNames.map((day) => (
                  <div key={day} className="w-10 py-2 font-poppins text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 justify-items-center gap-1 text-center">
                {paddingDays.map((_, idx) => (
                  <div key={`padding-${idx}`} className="flex h-8 w-8 items-center justify-center" />
                ))}
                {allDays.map((day) => {
                  const isSelected = isSameDay(day, selectedDate)
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => onSelectDate(day)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full font-poppins text-sm transition-colors hover:bg-muted',
                        isSelected && 'bg-[#BAE6FD] font-semibold text-[#0E121B] hover:bg-[#BAE6FD]/80',
                        !isSameMonth(day, currentMonth) && 'text-muted-foreground/30'
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
                {Array(trailingPaddingCount)
                  .fill(null)
                  .map((_, idx) => (
                    <div key={`trailing-${idx}`} className="flex h-8 w-8 items-center justify-center" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default CalendarBar
