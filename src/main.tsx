import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import './styles.css'

import App from './App.tsx'
import AuthLayout from './pages/auth/AuthLayout.tsx'
import Login from './pages/auth/Login.tsx'
import SignUp from './pages/auth/SignUp.tsx'
import ResetPassword from './pages/auth/ResetPassword.tsx'
import SignUpSuccess from './pages/auth/SignUpSuccess.tsx'
import ResetPasswordSuccess from './pages/auth/ResetPasswordSuccess.tsx'
import ResetPasswordEmail from './pages/auth/ResetPasswordEmail.tsx'
import AuthSplitLayout from './pages/auth/AuthSplitLayout.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import EventsLayout from './pages/events/EventsLayout.tsx'
import ManageEvents from './pages/events/ManageEvents.tsx'
import ViewEvent from './pages/events/ViewEvent.tsx'
import CreateEvent from './pages/events/CreateEvent.tsx'
import EditEvent from './pages/events/EditEvent.tsx'
import CreateEventSuccess from './pages/events/CreateEventSuccess.tsx'
import EditEventSuccess from './pages/events/EditEventSuccess.tsx'
import VolunteerPage from './pages/vms/VolunteerPage.tsx'
import CalendarPage from './pages/calendar/CalendarPage.tsx'
import Sidebar from './components/Sidebar.tsx'

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
})


const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-up',
  component: SignUp,
})

const signUpSuccessRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-up-success',
  component: SignUpSuccess,
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'reset-password',
  component: ResetPassword,
})

const resetPasswordSuccessRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'reset-password-success',
  component: ResetPasswordSuccess,
})

const resetPasswordEmailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'reset-password-email',
  component: ResetPasswordEmail,
})

const authSplitLayoutRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  id: 'auth-split-layout',
  component: AuthSplitLayout,
})

const loginRoute = createRoute({
  getParentRoute: () => authSplitLayoutRoute,
  path: 'login',
  component: Login,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authSplitLayoutRoute,
  path: '/forgot-password',
  component: ForgotPassword,
})

const eventsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'events',
  component: EventsLayout,
})

const manageEventsRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'manage-events',
  component: ManageEvents,
})

const viewEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'view-event/$eventId',
  component: ViewEvent,
})

const createEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'create-event',
  component: CreateEvent,
})

const editEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'edit-event/$eventId',
  component: EditEvent,
})

const createEventSuccessRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'create-event-success',
  component: CreateEventSuccess,
})

const editEventSuccessRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'edit-event-success',
  component: EditEventSuccess,
})

const calendarPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'calendar',
  component: CalendarPage,
})

const volunteerPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'volunteers',
  component: VolunteerPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsLayoutRoute.addChildren([
    manageEventsRoute,
    viewEventRoute,
    createEventRoute,
    editEventRoute,
    createEventSuccessRoute,
    editEventSuccessRoute,
  ]),
  calendarPageRoute,
  volunteerPageRoute,
  authLayoutRoute.addChildren([
    signUpRoute,
    signUpSuccessRoute,
    resetPasswordRoute,
    resetPasswordSuccessRoute,
    resetPasswordEmailRoute,
    authSplitLayoutRoute.addChildren([loginRoute, forgotPasswordRoute]),
  ]),
])

const router = createRouter({
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

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
