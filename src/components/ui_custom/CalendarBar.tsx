import { useMemo, useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isSameMonth, startOfMonth, subMonths } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List as ListIcon } from 'lucide-react'

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full px-4" onClick={onToday}>
            Today
          </Button>
          <h1 className="text-2xl font-semibold leading-none text-[#0E121B]">{currentLabel}</h1>
        </div>
        <CalendarDatePagination />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Select value={view} onValueChange={(value) => onViewChange(value as CalendarViewOption)}>
          <SelectTrigger size="sm" className="min-w-[160px] justify-between rounded-full bg-white px-4 text-sm font-semibold">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent className="w-[200px]">
            {viewOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onModeChange && (
          <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
            {modeOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant="ghost"
                size="icon"
                className={cn(
                  'size-9 rounded-full transition-colors',
                  mode === value
                    ? 'bg-[#E2E8F0] text-[#0E121B] hover:bg-[#E2E8F0]'
                    : 'text-muted-foreground hover:bg-transparent',
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
    <aside className="h-screen w-[366px] flex-shrink-0 bg-[#F8FAFC] p-6 pt-20"> 
      <div className="space-y-4">
        <div className="space-y-2">
          <h1>Calendar</h1>
          <div className="pt-8 grid grid-cols-[1fr_auto] items-center gap-4">
            <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="size-4 font-bold" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleNextMonth}
              >
                <ChevronRight className="size-4 font-bold" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-7 justify-items-center gap-1 text-center">
            {dayNames.map((day) => (
              <div key={day} className="w-10 py-2 font-poppins text-base font-normal leading-6">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 justify-items-center gap-1 text-center">
            {paddingDays.map((_, idx) => (
              <div key={`padding-${idx}`} className="flex h-10 w-10 items-center justify-center" />
            ))}
            {allDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => onSelectDate(day)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md font-poppins text-base font-normal leading-6 transition-colors hover:bg-accent',
                    isSelected && 'bg-[#CBD5E1] font-semibold text-foreground',
                    isToday && !isSelected && 'bg-accent font-medium',
                    !isSameMonth(day, currentMonth) && 'text-muted-foreground/50'
                  )}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
            {Array(trailingPaddingCount)
              .fill(null)
              .map((_, idx) => (
                <div key={`trailing-${idx}`} className="flex h-10 w-10 items-center justify-center" />
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#0E121B]">Filter</h3>
            <Button variant="ghost" size="sm" className="px-2 text-xs" onClick={resetFilters}>
              Remove filters
            </Button>
          </div>
          <ul className="space-y-3">
            {filters.map((filter) => (
              <li key={filter.id} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: statusColors[filter.id].background }}
                />
                <Checkbox
                  id={`filter-${filter.id}`}
                  checked={activeFilters.includes(filter.id)}
                  onCheckedChange={() => toggleFilter(filter.id)}
                />
                <label htmlFor={`filter-${filter.id}`} className="text-sm font-medium text-[#0E121B]">
                  {filter.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default CalendarBar
