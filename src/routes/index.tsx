import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { appLayoutRoute, homeRoute, profileRoute, settingsRoute } from './app'
import {
  createEventRoute,
  createEventSuccessRoute,
  editEventRoute,
  editEventSuccessRoute,
  eventsLayoutRoute,
  manageEventsRoute,
  viewEventRoute,
} from './vms/events'
import { 
  createEmailRoute,
  volunteersLayoutRoute,
  volunteerPageRoute
} from './vms/volunteers'
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
import { analyticsPageRoute, analyticsPdfPreviewRoute } from './analytics'
import { createCustomReportRoute } from './createCustomReport'
import { landingPageRoute } from './vms/index'

export const rootRoute = createRootRoute({
  component: () => (
    <div className="flex-1">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    homeRoute,
    profileRoute,
    settingsRoute,
    eventsLayoutRoute.addChildren([
      manageEventsRoute,
      viewEventRoute,
      createEventRoute,
      editEventRoute,
      createEventSuccessRoute,
      editEventSuccessRoute,
    ]),
    calendarPageRoute,
    landingPageRoute,
    volunteersLayoutRoute.addChildren([
      volunteerPageRoute,
      createEmailRoute
    ]),
    analyticsPageRoute,
    analyticsPdfPreviewRoute,
    createCustomReportRoute,
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
