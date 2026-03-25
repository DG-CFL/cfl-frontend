import AppLayout from '@/pages/AppLayout'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '.'
import Home from '@/pages/Home'
import ProfilePage from '@/pages/profile/ProfilePage'
import SettingsPage from '@/pages/settings/SettingsPage'

/**
 * Base layout for main app pages, i.e. non auth pages
 */
export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
})

export const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: Home,
})

export const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/profile',
  component: ProfilePage,
})

export const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})
