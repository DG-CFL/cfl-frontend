import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { appLayoutRoute, homeRoute } from './app'
import {
  createEventRoute,
  createEventSuccessRoute,
  editEventRoute,
  editEventSuccessRoute,
  eventsLayoutRoute,
  manageEventsRoute,
  registerEventRoute,
  viewEventRoute,
} from './events'
import { volunteerPageRoute } from './vms'
import {
  authLayoutRoute,
  signUpRoute,
  signUpSuccessRoute,
  resetPasswordRoute,
  resetPasswordSuccessRoute,
  resetPasswordEmailRoute,
  authSplitLayoutRoute,
  loginRoute,
  forgotPasswordRoute,
} from './auth'
import { calendarPageRoute } from './calendar'
import { analyticsPageRoute } from './analytics'

export const rootRoute = createRootRoute({
  component: () => (
    <div className="flex">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    homeRoute,
    eventsLayoutRoute.addChildren([
      manageEventsRoute,
      viewEventRoute,
      createEventRoute,
      editEventRoute,
      createEventSuccessRoute,
      editEventSuccessRoute,
      registerEventRoute,
    ]),
    calendarPageRoute,
    volunteerPageRoute,
    analyticsPageRoute,
  ]),
  authLayoutRoute.addChildren([
    signUpRoute,
    signUpSuccessRoute,
    resetPasswordRoute,
    resetPasswordSuccessRoute,
    resetPasswordEmailRoute,
    authSplitLayoutRoute.addChildren([loginRoute, forgotPasswordRoute]),
  ]),
])

export const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
