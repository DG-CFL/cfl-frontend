import AppLayout from '@/pages/AppLayout'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '.'
import Home from '@/pages/Home'

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
