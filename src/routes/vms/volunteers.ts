import VolunteerPage from '@/pages/vms/volunteers/VolunteerPage'
import { createRoute } from '@tanstack/react-router'
import { appLayoutRoute } from '../app'
import EmailPage from '@/pages/vms/volunteers/EmailPage'
import { VolunteerLayout } from '@/pages/vms/volunteers/VolunteerLayout'
import z from 'zod'

export const volunteersLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'volunteers',
  component: VolunteerLayout,
})
export const volunteerPageRoute = createRoute({
  getParentRoute: () => volunteersLayoutRoute,
  path: '/',
  component: VolunteerPage,
})
export const createEmailRoute = createRoute({
  getParentRoute: () => volunteersLayoutRoute,
  path: '/email',
  component: EmailPage,
  validateSearch: z.object({
    ids: z.string().optional(),
  }),
})
