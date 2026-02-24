import type { CalendarState, Status } from '@/components/ui/calendarpage'

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
  return STATUS_COLORS[category] || { background: '#E5E7EB', text: '#374151' }
}
