import CreateEvent from '@/pages/events/CreateEvent'
import CreateEventSuccess from '@/pages/events/CreateEventSuccess'
import EditEvent from '@/pages/events/EditEvent'
import EditEventSuccess from '@/pages/events/EditEventSuccess'
import EventsLayout from '@/pages/events/EventsLayout'
import ManageEvents from '@/pages/events/ManageEvents'
import ViewEvent from '@/pages/events/ViewEvent'
import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from './app'

/**
 * BAse layout for events pages
 */
export const eventsLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'events',
  component: EventsLayout,
})

export const manageEventsRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'manage-events',
  component: ManageEvents,
})

export const viewEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'view-event/$eventId',
  component: ViewEvent,
})

export const createEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'create-event',
  component: CreateEvent,
})

export const editEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'edit-event/$eventId',
  component: EditEvent,
})

export const createEventSuccessRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'create-event-success',
  component: CreateEventSuccess,
})

export const editEventSuccessRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'edit-event-success',
  component: EditEventSuccess,
})
