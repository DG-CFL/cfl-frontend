import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'

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
import { Button } from '@/components/ui/button'

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
    setActiveFilters([])
  }

  const renderActiveView = () => {
    if (mode === 'list') {
      return <CalendarListView />
    }

    switch (view) {
      case 'month':
        return (
          <CalendarMonthView
            features={filteredFeatures}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'week':
        return <CalendarWeekView />
      case 'day':
        return <CalendarDayView />
      case 'year':
        return <CalendarYearView />
      default:
        return (
          <CalendarMonthView
            features={filteredFeatures}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
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
      <div className="relative flex-1 overflow-hidden">
        <div className="h-full w-full">
          <CalendarProvider className="h-full w-full gap-6">
            <main className="flex h-full flex-col pb-16">
              <div className="px-6 pb-6 pt-8">
                <CalendarBarHeader
                  view={view}
                  onViewChange={setView}
                  mode={mode}
                  onModeChange={setMode}
                  onToday={handleToday}
                />
              </div>
              {renderActiveView()}
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
