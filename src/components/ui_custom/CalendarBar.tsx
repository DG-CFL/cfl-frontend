import { useMemo, useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfMonth, subMonths } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Filter, List as ListIcon } from 'lucide-react'

import type { CalendarCategory, CalendarCategoryColors } from '@/pages/calendar/SampleCalendarData'
import { CalendarDatePagination, useCalendarMonth, useCalendarYear } from '@/components/ui/calendarpage'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type CalendarViewOption = 'day' | 'week' | 'month' | 'year'
export type CalendarDisplayMode = 'grid' | 'list'

const useCurrentPeriodLabel = (view: CalendarViewOption) => {
  const [month] = useCalendarMonth()
  const [year] = useCalendarYear()

  return useMemo(() => {
    const current = new Date(year, month, 1)
    return format(current, view === 'year' ? 'yyyy' : 'MMMM yyyy')
  }, [month, year, view])
}

type CalendarToolbarProps = {
  view: CalendarViewOption
  onViewChange: (view: CalendarViewOption) => void
  mode: CalendarDisplayMode
  onModeChange?: (mode: CalendarDisplayMode) => void
  onToday: () => void
}

const viewOptions: Array<{ value: CalendarViewOption; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const modeOptions: Array<{
  value: CalendarDisplayMode
  label: string
  icon: typeof CalendarIcon
}> = [
  { value: 'grid', label: 'Calendar', icon: CalendarIcon },
  { value: 'list', label: 'List', icon: ListIcon },
]

// The header containing Today button, left and right button, month/year label, view selector, and mode selector
export const CalendarBarHeader = ({ view, onViewChange, mode, onModeChange, onToday }: CalendarToolbarProps) => {
  const currentLabel = useCurrentPeriodLabel(view)

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" className="h-9 rounded-md px-4 font-medium" onClick={onToday}>
          Today
        </Button>
        <CalendarDatePagination />
        <h1 className="ml-2 text-3xl font-bold text-[#0E121B]">{currentLabel}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Select value={view} onValueChange={(value) => onViewChange(value as CalendarViewOption)}>
          <SelectTrigger className="h-9 w-[120px] rounded-md border-input bg-background px-3 text-sm font-medium">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent align="end">
            {viewOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onModeChange && (
          <div className="flex items-center rounded-md border bg-background p-1">
            {modeOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-7 w-7 rounded-sm',
                  mode === value
                    ? 'bg-muted text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50',
                )}
                onClick={() => {
                  if (value !== mode) {
                    onModeChange(value)
                  }
                }}
                aria-pressed={mode === value}
                aria-label={`Switch to ${label} view`}
              >
                <Icon className="size-4" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type CalendarBarProps = {
  sidebarTitle: string
  selectedDate: Date
  onSelectDate: (date?: Date) => void
  filters: Array<{ id: CalendarCategory; label: string }>
  activeFilters: Array<CalendarCategory>
  toggleFilter: (filterId: CalendarCategory) => void
  resetFilters: () => void
  statusColors: CalendarCategoryColors
}

// The sidebar containing mini calendar and filters
const CalendarBar = ({
  selectedDate,
  onSelectDate,
  filters,
  activeFilters,
  toggleFilter,
  resetFilters,
  statusColors,
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
    <aside className="h-full w-[300px] flex-shrink-0 border-r bg-white p-6">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0E121B]">Filter</h3>
              <Filter className="size-4 text-muted-foreground" />
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>

          <ul className="space-y-3">
            {filters.map((filter) => (
              <li key={filter.id} className="flex items-center gap-3">
                <Checkbox
                  id={`filter-${filter.id}`}
                  checked={activeFilters.includes(filter.id)}
                  onCheckedChange={() => toggleFilter(filter.id)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor={`filter-${filter.id}`} className="text-sm font-medium text-[#0E121B]">
                  {filter.label}
                </label>
              </li>
            ))}
          </ul>

          <button
            onClick={resetFilters}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            x Remove filters
          </button>
        </div>
      </div>
    </aside>
  )
}

export default CalendarBar
