import { addDays, addWeeks, format, subDays, subWeeks } from 'date-fns'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'

import LoadingSkeleton from '../LoadingSkeleton'
import CalendarDayView from './calenderViews/CalendarDayView'
import CalendarListView from './calenderViews/CalendarListView'
import CalendarMonthView from './calenderViews/CalendarMonthView'
import CalendarWeekView from './calenderViews/CalendarWeekView'
import CalendarYearView from './calenderViews/CalendarYearView'
import { parseCalendarEvents } from './CalendarParser'
import { STATUS_COLORS } from './SampleCalendarData'
import type {
  CalendarDisplayMode,
  CalendarViewOption,
} from '@/pages/calendar/CalendarHeader'
import type { CalendarState } from '@/components/ui/calendarpage'
import type { EventParticipantEntry } from '@/types/events'

import { useCurrentUser } from '@/auth/AuthProvider'
import CalendarBar from '@/pages/calendar/CalendarSideBar'
import { CalendarBarHeader } from '@/pages/calendar/CalendarHeader'
import { useGetSessionEvents } from '@/operations/events'
import { Button } from '@/components/ui/button'
import {
  CalendarProvider,
  useCalendarMonth,
  useCalendarYear,
} from '@/components/ui/calendarpage'

function normalizeName(value: string) {
  return value.trim().toLowerCase()
}

function participantNameMatches(
  participant: EventParticipantEntry,
  currentUserName: string,
) {
  if (typeof participant === 'string') {
    return normalizeName(participant) === currentUserName
  }

  return normalizeName(participant.name) === currentUserName
}

const CalendarPage = () => {
  const [view, setView] = useState<CalendarViewOption>('month')
  const [mode, setMode] = useState<CalendarDisplayMode>('grid')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [month, setMonth] = useCalendarMonth()
  const [year, setYear] = useCalendarYear()
  const currentUser = useCurrentUser()
  const showCreateEvent =
    currentUser != null && currentUser.role !== 'public'

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

  const { data: eventsData, isLoading, isError } = useGetSessionEvents()

  const normalizedEvents = useMemo(() => {
    if (isError) {
      return []
    }

    const currentUserName = normalizeName(currentUser?.name ?? '')

    return parseCalendarEvents(eventsData as unknown).map((event) => ({
      ...event,
      isCurrentUserInvolved:
        currentUserName.length > 0 &&
        [...event.volunteerCoordinators, ...event.volunteers].some(
          (participant) =>
            participantNameMatches(participant, currentUserName),
        ),
    }))
  }, [eventsData, isError, currentUser?.name])

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
          events={normalizedEvents}
          colors={STATUS_COLORS}
          selectedDate={selectedDate}
        />
      )
    }

    switch (view) {
      case 'month':
        return (
          <CalendarMonthView
            events={normalizedEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'week':
        return (
          <CalendarWeekView
            events={normalizedEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'day':
        return (
          <CalendarDayView
            events={normalizedEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
      case 'year':
        return <CalendarYearView />
      default:
        return (
          <CalendarMonthView
            events={normalizedEvents}
            colors={STATUS_COLORS}
            selectedDate={selectedDate}
          />
        )
    }
  }

  const showSidebar = mode === 'grid' && (view === 'month' || view === 'year')



  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {showSidebar && (
        <CalendarBar
          sidebarTitle={sidebarTitle}
          selectedDate={selectedDate}
          onSelectDate={handleMiniCalendarSelect}
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
                {isLoading ? (
                  <LoadingSkeleton variant="inline" className="min-h-[400px]" />
                ) : (
                  renderActiveView()
                )}
              </div>
            </main>
          </CalendarProvider>
        </div>
        {showCreateEvent && (
          <Button
            asChild
            size="icon"
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-[#334155] shadow-lg hover:bg-[#1e293b]"
          >
            <Link to="/events/create">
              <Plus className="h-6 w-6" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default CalendarPage
