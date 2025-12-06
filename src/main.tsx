import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import * as z from 'zod'

import './styles.css'

import Home from './pages/Home.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import AuthLayout from './pages/auth/AuthLayout.tsx'
import AuthSplitLayout from './pages/auth/AuthSplitLayout.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import Login from './pages/auth/Login.tsx'
import ResetPassword from './pages/auth/ResetPassword.tsx'
import ResetPasswordEmail from './pages/auth/ResetPasswordEmail.tsx'
import ResetPasswordSuccess from './pages/auth/ResetPasswordSuccess.tsx'
import SignUp from './pages/auth/SignUp.tsx'
import SignUpSuccess from './pages/auth/SignUpSuccess.tsx'
import CreateEvent from './pages/events/CreateEvent.tsx'
import CreateEventSuccess from './pages/events/CreateEventSuccess.tsx'
import EditEvent from './pages/events/EditEvent.tsx'
import EditEventSuccess from './pages/events/EditEventSuccess.tsx'
import EventsLayout from './pages/events/EventsLayout.tsx'
import ManageEvents from './pages/events/ManageEvents.tsx'
import ViewEvent from './pages/events/ViewEvent.tsx'
import VolunteerPage from './pages/vms/VolunteerPage.tsx'
import AppLayout from './pages/AppLayout.tsx'

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})

// Base layout for main app pages, i.e. non auth pages
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
})

const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: Home,
})

// Base layout for auth pages
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
  validateSearch: z.object({
    oobCode: z.string()
  })
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
  getParentRoute: () => appLayoutRoute,
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

const volunteerPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'volunteers',
  component: VolunteerPage,
})

export const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    homeRoute,
    eventsLayoutRoute.addChildren([
      manageEventsRoute,
      viewEventRoute,
      createEventRoute,
      editEventRoute,
      createEventSuccessRoute,
      editEventSuccessRoute,
    ]),
    volunteerPageRoute,
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

const queryClient = new QueryClient()

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>,
  )
}
