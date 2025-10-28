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

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
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
  path: '/manage-events',
  component: ManageEvents,
})

const viewEventRoute = createRoute({
  getParentRoute: () => eventsLayoutRoute,
  path: 'view-event',
  component: ViewEvent,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsLayoutRoute.addChildren([manageEventsRoute, viewEventRoute]),
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
