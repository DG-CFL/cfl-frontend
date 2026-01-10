import CreateEvent from '@/pages/vms/events/CreateEvent'
import CreateEventSuccess from '@/pages/vms/events/CreateEventSuccess'
import EditEvent from '@/pages/vms/events/EditEvent'
import EditEventSuccess from '@/pages/vms/events/EditEventSuccess'
import EventsLayout from '@/pages/vms/events/EventsLayout'
import ManageEvents from '@/pages/vms/events/ManageEvents'
import ViewEvent from '@/pages/vms/events/ViewEvent'
import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from '../app'
import RegisterEvent from '@/pages/vms/events/RegisterEvent'

/**
 * Base layout for events pages
 */
export const eventsLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'events',
  component: EventsLayout,
})

export const manageEventsRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: '/',
  component: ManageEvents,
})

export const viewEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: '$eventId/view',
  component: ViewEvent,
})

export const createEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'create',
  component: CreateEvent,
})

export const editEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: '$eventId/edit',
  component: EditEvent,
})

export const createEventSuccessRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'create-success',
  component: CreateEventSuccess,
})

export const editEventSuccessRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'edit-success',
  component: EditEventSuccess,
})

export const registerEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: '$eventId/register',
  component: RegisterEvent
})
