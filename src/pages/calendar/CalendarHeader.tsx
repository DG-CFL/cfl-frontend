import { useMemo } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, List as ListIcon } from 'lucide-react'

import { CalendarDatePagination, useCalendarMonth, useCalendarYear } from '@/components/ui/calendarpage'
import { Button } from '@/components/ui/button'
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
  onNext?: () => void
  onPrev?: () => void
}

const viewOptions: Array<{ value: CalendarViewOption; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
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
export const CalendarBarHeader = ({ view, onViewChange, mode, onModeChange, onToday, onNext, onPrev }: CalendarToolbarProps) => {
  const currentLabel = useCurrentPeriodLabel(view)

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="h-9 rounded-[8px] border !border-[#475569] px-4"
          onClick={onToday}
        >
          <h4 className='text-[#475569]'>
            Today
          </h4>
        </Button>
        <CalendarDatePagination onNext={onNext} onPrev={onPrev} />
        <h1 className="ml-2 text-3xl font-bold text-[#0E121B]">{currentLabel}</h1>
      </div>

      <div className="flex items-center gap-3 h-full">
        <Select value={view} onValueChange={(value) => onViewChange(value as CalendarViewOption)}>
          <SelectTrigger className="!h-9 w-[107px] rounded-[8px] border !border-[#475569] bg-background px-3 text-sm font-medium text-[#475569] [&>svg]:text-[#475569] [&>svg]:opacity-100">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent align="end">
            {viewOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-[#475569]">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onModeChange && (
          <div className="flex h-9 w-[96px] items-center rounded-[30px] border border-[#475569] bg-background overflow-hidden">
            {modeOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant="ghost"
                className={cn(
                  'h-full flex-1 rounded-none p-0',
                  mode === value
                    ? '!bg-[#475569] !text-white hover:!bg-[#475569] hover:!text-white'
                    : '!text-[#475569] hover:!bg-transparent hover:!text-[#475569]',
                )}
                onClick={() => {
                  if (value !== mode) {
                    onModeChange(value)
                  }
                }}
                aria-pressed={mode === value}
                aria-label={`Switch to ${label} view`}
              >
                <Icon className="size-5" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
