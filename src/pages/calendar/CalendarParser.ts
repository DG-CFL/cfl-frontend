import type { Event } from '@/types/events'

type CalendarApiPerson = string | { name?: string; role?: string }

type CalendarApiEvent = {
  eventId?: number | string
  event_id?: number | string
  name?: string | null
  description?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  venue?: string | null
  location?: string | null
  postalCode?: number | string | null
  coverImage?: string | null
  volunteerCoordinators?: Array<CalendarApiPerson>
  volunteer_coordinators?: Array<CalendarApiPerson>
  volunteers?: Array<CalendarApiPerson>
  category?: string | null
  status?: string | null
}

const toCalendarDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

const toCalendarPeople = (
  value: unknown,
  defaultRole: string,
): Event['volunteerCoordinators'] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        const name = entry.trim()
        return name.length > 0 ? { name, role: defaultRole } : null
      }

      if (entry && typeof entry === 'object') {
        const person = entry as { name?: unknown; role?: unknown }
        const name = typeof person.name === 'string' ? person.name.trim() : ''
        if (name.length === 0) {
          return null
        }

        const role =
          typeof person.role === 'string' && person.role.trim().length > 0
            ? person.role.trim()
            : defaultRole

        return { name, role }
      }

      return null
    })
    .filter((entry): entry is { name: string; role: string } => entry !== null)
}

const normalizeCalendarEvent = (value: unknown): Event | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const event = value as CalendarApiEvent
  const startDate = toCalendarDate(event.startDate)
  const endDate = toCalendarDate(event.endDate) ?? startDate

  if (!startDate || !endDate) {
    return null
  }

  const rawId = event.eventId ?? event.event_id ?? 0
  const eventId = Number(rawId)
  const venue = typeof event.venue === 'string' ? event.venue.trim() : ''
  const location = typeof event.location === 'string' ? event.location.trim() : venue
  const postalCode =
    event.postalCode === null || event.postalCode === undefined
      ? ''
      : String(event.postalCode).trim()
  const resolvedLocation =
    postalCode.length > 0 && location.length > 0 ? `${location}, ${postalCode}` : location

  return {
    eventId: Number.isNaN(eventId) ? 0 : eventId,
    name: event.name ?? '',
    status: event.status ?? 'Active',
    category: event.category === 'training' ? 'training' : 'event',
    location: resolvedLocation,
    coverImage: event.coverImage ?? undefined,
    startDate,
    endDate,
    description: event.description ?? '',
    volunteerCoordinators: toCalendarPeople(
      event.volunteerCoordinators ?? event.volunteer_coordinators,
      'Coordinator',
    ),
    volunteers: toCalendarPeople(event.volunteers, 'Volunteer'),
  }
}

const extractCalendarEvents = (payload: unknown): Array<unknown> => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>

    if (Array.isArray(obj.items)) {
      return obj.items
    }

    if (Array.isArray(obj.data)) {
      return obj.data
    }

    if (Array.isArray(obj.events)) {
      return obj.events
    }
  }

  return []
}

export const parseCalendarEvents = (payload: unknown): Event[] => {
  return extractCalendarEvents(payload)
    .map(normalizeCalendarEvent)
    .filter((event): event is Event => event !== null)
}
