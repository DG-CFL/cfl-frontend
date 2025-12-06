import type { CalendarState, Feature, Status } from '@/components/ui/calendarpage'

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

export const CALENDAR_FEATURES: Array<Feature> = [
  {
    id: '1',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 1, 10, 0),
    endAt: new Date(2025, 8, 1, 12, 0),
    status: STATUS_MAP.event,
    location: 'A Place',
    currentAttendees: 10,
    maxAttendees: 20,
  },
  {
    id: '2',
    name: 'This is a CFL training',
    startAt: new Date(2025, 8, 3, 14, 0),
    endAt: new Date(2025, 8, 3, 15, 30),
    status: STATUS_MAP.training,
    location: 'Training Room B',
    currentAttendees: 5,
    maxAttendees: 15,
  },
  {
    id: '3',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 16, 9, 0),
    endAt: new Date(2025, 8, 16, 17, 0),
    status: STATUS_MAP.event,
    location: 'Main Hall',
    currentAttendees: 32,
    maxAttendees: 50,
  },
  {
    id: '4',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 17, 10, 0),
    endAt: new Date(2025, 8, 17, 11, 0),
    status: STATUS_MAP.event,
  },
  {
    id: '5',
    name: 'This is a CFL training',
    startAt: new Date(2025, 8, 17, 10, 30),
    endAt: new Date(2025, 8, 17, 12, 0),
    status: STATUS_MAP.training,
  },
  {
    id: '6',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 18, 13, 0),
    endAt: new Date(2025, 8, 18, 14, 0),
    status: STATUS_MAP.event,
  },
  {
    id: '7',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 20, 11, 0),
    endAt: new Date(2025, 8, 20, 12, 30),
    status: STATUS_MAP.event,
  },
  {
    id: '8',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 21, 9, 0),
    endAt: new Date(2025, 8, 21, 10, 30),
    status: STATUS_MAP.event,
  },
  {
    id: '9',
    name: 'This is a CFL training',
    startAt: new Date(2025, 8, 21, 10, 0),
    endAt: new Date(2025, 8, 21, 11, 30),
    status: STATUS_MAP.training,
  },
  {
    id: '10',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 22, 14, 0),
    endAt: new Date(2025, 8, 22, 16, 0),
    status: STATUS_MAP.event,
  },
  {
    id: '11',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 25, 10, 0),
    endAt: new Date(2025, 8, 25, 12, 0),
    status: STATUS_MAP.event,
  },
  {
    id: '12',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 27, 13, 0),
    endAt: new Date(2025, 8, 27, 15, 0),
    status: STATUS_MAP.event,
  },
  {
    id: '13',
    name: 'This is a CFL event',
    startAt: new Date(2025, 8, 30, 9, 0),
    endAt: new Date(2025, 8, 30, 11, 0),
    status: STATUS_MAP.event,
  },
  // Overlapping Scenario (Sep 15)
  {
    id: '14',
    name: 'Morning Briefing',
    startAt: new Date(2025, 8, 15, 9, 0),
    endAt: new Date(2025, 8, 15, 10, 0),
    status: STATUS_MAP.event,
    location: 'Room 101',
  },
  {
    id: '15',
    name: 'Team Sync',
    startAt: new Date(2025, 8, 15, 9, 30),
    endAt: new Date(2025, 8, 15, 10, 30),
    status: STATUS_MAP.training,
    location: 'Room 102',
  },
  {
    id: '16',
    name: 'Client Call',
    startAt: new Date(2025, 8, 15, 9, 45),
    endAt: new Date(2025, 8, 15, 11, 0),
    status: STATUS_MAP.event,
  },
  
  // Back-to-back (Sep 15)
  {
    id: '17',
    name: 'Lunch Break',
    startAt: new Date(2025, 8, 15, 11, 0),
    endAt: new Date(2025, 8, 15, 12, 0),
    status: STATUS_MAP.event,
  },
  {
    id: '18',
    name: 'Project Review',
    startAt: new Date(2025, 8, 15, 12, 0),
    endAt: new Date(2025, 8, 15, 13, 0),
    status: STATUS_MAP.training,
    location: 'Conference Room',
    currentAttendees: 8,
    maxAttendees: 10,
  },

  // Short Event (Sep 15)
  {
    id: '19',
    name: 'Quick Standup',
    startAt: new Date(2025, 8, 15, 14, 0),
    endAt: new Date(2025, 8, 15, 14, 15),
    status: STATUS_MAP.event,
  },

  // Late Night (Sep 15)
  {
    id: '20',
    name: 'Server Maintenance',
    startAt: new Date(2025, 8, 15, 22, 0),
    endAt: new Date(2025, 8, 15, 23, 30),
    status: STATUS_MAP.training,
  },

  // Early Morning (Sep 16)
  {
    id: '21',
    name: 'Early Bird Yoga',
    startAt: new Date(2025, 8, 16, 6, 0),
    endAt: new Date(2025, 8, 16, 7, 0),
    status: STATUS_MAP.event,
    location: 'Gym',
    currentAttendees: 15,
    maxAttendees: 20,
  },

  // Long Event (Sep 19)
  {
    id: '22',
    name: 'All Day Workshop',
    startAt: new Date(2025, 8, 19, 8, 0),
    endAt: new Date(2025, 8, 19, 18, 0),
    status: STATUS_MAP.training,
    location: 'Auditorium',
    currentAttendees: 45,
    maxAttendees: 100,
  },
]

export const CALENDAR_FILTERS: Array<{ id: CalendarCategory; label: string }> = [
  { id: 'event', label: 'Events' },
  { id: 'training', label: 'Trainings' },
]

export const INITIAL_DATE = new Date(2025, 8, 17)

export const INITIAL_MONTH = INITIAL_DATE.getMonth() as CalendarState['month']

export const INITIAL_YEAR = INITIAL_DATE.getFullYear()
