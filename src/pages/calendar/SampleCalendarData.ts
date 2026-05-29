import type { CalendarState, Status } from '@/components/ui/calendarpage'
import type { Event } from '@/types/events'

export type CalendarCategory = 'event' | 'training'

export type CalendarCategoryColors = Record<
  CalendarCategory,
  {
    background: string
    text: string
  }
>

export const STATUS_COLORS: CalendarCategoryColors = {
  event: { background: '#FDDCE4', text: '#9A3A4E' },
  training: { background: '#F9D675', text: '#8C6710' },
}

export const CURRENT_USER_EVENT_COLOR = {
  background: '#DBEAFE',
  text: '#1D4ED8',
}

export const STATUS_MAP: Record<CalendarCategory, Status> = {
  event: { id: 'event', name: 'Event', color: STATUS_COLORS.event.background },
  training: {
    id: 'training',
    name: 'Training',
    color: STATUS_COLORS.training.background,
  },
}

export const CALENDAR_FILTERS: Array<{ id: CalendarCategory; label: string }> = [
  { id: 'event', label: 'Events' },
  { id: 'training', label: 'Trainings' },
]

export const getEventColor = (category: CalendarCategory) => {
  return STATUS_COLORS[category]
}

export const getCalendarEventColor = (event: Event) => {
  return event.isCurrentUserInvolved
    ? CURRENT_USER_EVENT_COLOR
    : getEventColor(event.category)
}
