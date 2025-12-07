import AuthLayout from '@/pages/auth/AuthLayout'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '.'
import SignUp from '@/pages/auth/SignUp'
import AuthSplitLayout from '@/pages/auth/AuthSplitLayout'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Login from '@/pages/auth/Login'
import ResetPassword from '@/pages/auth/ResetPassword'
import ResetPasswordEmail from '@/pages/auth/ResetPasswordEmail'
import ResetPasswordSuccess from '@/pages/auth/ResetPasswordSuccess'
import SignUpSuccess from '@/pages/auth/SignUpSuccess'
import z from 'zod'

/**
 * Base layout for auth pages
 */
export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
})

export const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-up',
  component: SignUp,
})

export const signUpSuccessRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'sign-up-success',
  component: SignUpSuccess,
})

export const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'reset-password',
  component: ResetPassword,
  validateSearch: z.object({
    oobCode: z.string(),
  }),
})

export const resetPasswordSuccessRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'reset-password-success',
  component: ResetPasswordSuccess,
})

export const resetPasswordEmailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: 'reset-password-email',
  component: ResetPasswordEmail,
})

export const authSplitLayoutRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  id: 'auth-split-layout',
  component: AuthSplitLayout,
})

export const loginRoute = createRoute({
  getParentRoute: () => authSplitLayoutRoute,
  path: 'login',
  component: Login,
})

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => authSplitLayoutRoute,
  path: '/forgot-password',
  component: ForgotPassword,
})
