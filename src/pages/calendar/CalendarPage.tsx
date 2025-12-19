import { addDays, addWeeks, format, subDays, subWeeks } from 'date-fns'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { CalendarState } from '@/components/ui/calendarpage'
import {
  CalendarProvider,
  useCalendarMonth,
  useCalendarYear,
} from '@/components/ui/calendarpage'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { useGetEvents } from '@/operations/events'
import type {
  CalendarDisplayMode,
  CalendarViewOption,
} from '@/pages/calendar/CalendarHeader'
import { CalendarBarHeader } from '@/pages/calendar/CalendarHeader'
import CalendarBar from '@/pages/calendar/CalendarSideBar'
import LoadingSkeleton from '../LoadingSkeleton'
import CalendarDayView from './calenderViews/CalendarDayView'
import CalendarListView from './calenderViews/CalendarListView'
import CalendarMonthView from './calenderViews/CalendarMonthView'
import CalendarWeekView from './calenderViews/CalendarWeekView'
import CalendarYearView from './calenderViews/CalendarYearView'
import type { CalendarCategory } from './SampleCalendarData'
import {
  CALENDAR_FILTERS,
  STATUS_COLORS
} from './SampleCalendarData'

const CalendarPage = () => {
  const [view, setView] = useState<CalendarViewOption>('month')
  const [mode, setMode] = useState<CalendarDisplayMode>('grid')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeFilters, setActiveFilters] = useState<Array<CalendarCategory>>(
    CALENDAR_FILTERS.map((filter) => filter.id),
  )

  const [month, setMonth] = useCalendarMonth()
  const [year, setYear] = useCalendarYear()

  useEffect(() => {
    setMonth(new Date().getMonth() as CalendarState['month'])
    setYear(new Date().getFullYear())
  }, [setMonth, setYear])

  useEffect(() => {
    if (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month
    ) {
      return
    }

    const daysInTargetMonth = new Date(year, month + 1, 0).getDate()
    const clampedDay = Math.min(selectedDate.getDate(), daysInTargetMonth)
    setSelectedDate(new Date(year, month, clampedDay))
  }, [month, year, selectedDate])

  const sidebarTitle = useMemo(
    () => format(new Date(year, month, 1), 'MMMM yyyy'),
    [month, year],
  )

  const { data: events, isLoading, isError } = useGetEvents()

  const filteredEvents = events?.filter((event) => activeFilters.includes(event.category)) ?? []

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setMonth(date.getMonth() as CalendarState['month'])
    setYear(date.getFullYear())
  }

  const handleMiniCalendarSelect = (date?: Date) => {
    if (date) {
      handleSelectDate(date)
    }
  }

  const handleToday = () => {
    handleSelectDate(new Date())
  }

  const toggleFilter = (filterId: CalendarCategory) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId],
    )
  }

  const resetFilters = () => {
    setActiveFilters([])
  }

  const handleNext = () => {
    if (view === 'week') {
      handleSelectDate(addWeeks(selectedDate, 1))
    } else if (view === 'day') {
      handleSelectDate(addDays(selectedDate, 1))
    } else if (view === 'month') {
      const nextMonth = new Date(year, month + 1, 1)
      handleSelectDate(nextMonth)
    }
  }

  const handlePrev = () => {
    if (view === 'week') {
      handleSelectDate(subWeeks(selectedDate, 1))
    } else if (view === 'day') {
      handleSelectDate(subDays(selectedDate, 1))
    } else if (view === 'month') {
      const prevMonth = new Date(year, month - 1, 1)
      handleSelectDate(prevMonth)
    }
  }

  const renderActiveView = () => {
    if (mode === 'list') {
      return (
        <CalendarListView
          events={filteredEvents}
          colors={STATUS_COLORS}
          selectedDate={selectedDate}
        />
      )
    }

    switch (view) {
      case 'month':
        return (
          <CalendarMonthView
            events={filteredEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'week':
        return (
          <CalendarWeekView
            features={filteredEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'day':
        return (
          <CalendarDayView
            events={filteredEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'year':
        return <CalendarYearView />
      default:
        return (
          <CalendarMonthView
            events={filteredEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
    }
  }

  const showSidebar = mode === 'grid' && (view === 'month' || view === 'year')

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return <ErrorAlert />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {showSidebar && (
        <CalendarBar
          sidebarTitle={sidebarTitle}
          selectedDate={selectedDate}
          onSelectDate={handleMiniCalendarSelect}
          filters={CALENDAR_FILTERS}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          resetFilters={resetFilters}
          statusColors={STATUS_COLORS}
        />
      )}
      <div className="relative flex-1 overflow-hidden">
        <div className="h-full w-full">
          <CalendarProvider className="h-full w-full gap-6">
            <main className="flex h-full flex-col">
              <div className="px-6 pt-8">
                <CalendarBarHeader
                  view={view}
                  onViewChange={setView}
                  mode={mode}
                  onModeChange={setMode}
                  onToday={handleToday}
                  onNext={
                    view === 'week' || view === 'day' ? handleNext : undefined
                  }
                  onPrev={
                    view === 'week' || view === 'day' ? handlePrev : undefined
                  }
                />
              </div>
              <div className="flex-1 min-h-0 px-6 pb-6">
                {renderActiveView()}
              </div>
            </main>
          </CalendarProvider>
        </div>
        <Button
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-[#334155] shadow-lg hover:bg-[#1e293b]"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default CalendarPage
