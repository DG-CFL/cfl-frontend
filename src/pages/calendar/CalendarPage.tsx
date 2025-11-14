import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'

import {
  CALENDAR_FEATURES,
  CALENDAR_FILTERS,
  INITIAL_DATE,
  INITIAL_MONTH,
  INITIAL_YEAR,
  STATUS_COLORS,
} from './SampleCalendarData'
import CalendarMonthView from './calenderViews/CalendarMonthView'
import CalendarWeekView from './calenderViews/CalendarWeekView'
import CalendarDayView from './calenderViews/CalendarDayView'
import CalendarYearView from './calenderViews/CalendarYearView'
import CalendarListView from './CalendarListView'
import type { CalendarCategory } from './SampleCalendarData'
import type { CalendarState } from '@/components/ui/calendarpage'
import type { CalendarDisplayMode, CalendarViewOption } from '@/components/ui_custom/CalendarBar'
import { CalendarProvider, useCalendarMonth, useCalendarYear } from '@/components/ui/calendarpage'
import CalendarBar, { CalendarBarHeader } from '@/components/ui_custom/CalendarBar'

const CalendarPage = () => {
  const [view, setView] = useState<CalendarViewOption>('month')
  const [mode, setMode] = useState<CalendarDisplayMode>('grid')
  const [selectedDate, setSelectedDate] = useState<Date>(INITIAL_DATE)
  const [activeFilters, setActiveFilters] = useState<Array<CalendarCategory>>(
    CALENDAR_FILTERS.map((filter) => filter.id),
  )

  const [month, setMonth] = useCalendarMonth()
  const [year, setYear] = useCalendarYear()

  useEffect(() => {
    setMonth(INITIAL_MONTH)
    setYear(INITIAL_YEAR)
  }, [setMonth, setYear])

  useEffect(() => {
    if (selectedDate.getFullYear() === year && selectedDate.getMonth() === month) {
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

  const filteredFeatures = useMemo(
    () =>
      CALENDAR_FEATURES.filter((feature) =>
        activeFilters.includes(feature.status.id as CalendarCategory),
      ),
    [activeFilters],
  )

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
    setActiveFilters(CALENDAR_FILTERS.map((filter) => filter.id))
  }

  const renderActiveView = () => {
    if (mode === 'list') {
      return <CalendarListView />
    }

    switch (view) {
      case 'month':
        return <CalendarMonthView features={filteredFeatures} colors={STATUS_COLORS} />
      case 'week':
        return <CalendarWeekView />
      case 'day':
        return <CalendarDayView />
      case 'year':
        return <CalendarYearView />
      default:
        return <CalendarMonthView features={filteredFeatures} colors={STATUS_COLORS} />
    }
  }

  return (
    <div className="flex w-full">
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
      <div className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <CalendarProvider className="w-full gap-6">
          <main className="flex-1">
            <CalendarBarHeader
              view={view}
              onViewChange={setView}
              mode={mode}
              onModeChange={setMode}
              onToday={handleToday}
            />
            {renderActiveView()}
          </main>
        </CalendarProvider>
      </div>
    </div>
  )
}

export default CalendarPage
