import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type {
  EventCoordinatorRegistrationPostData,
  EventPostData,
  EventPutData,
  EventRegistrationPostData,
} from '@/types/events'
import {
  createEvent,
  deleteEvent,
  editEvent,
  getEvent,
  getEvents,
  registerEventCoordinator,
  registerEventVolunteer,
} from '@/api/events'

/**
 * Returns the list of all events
 */
export function useGetEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * Returns an event
 */
export function useGetEvent(eventId: number) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEvent(eventId),
  })
}

/**
 * Creates a new event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventData: EventPostData) => createEvent(eventData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['events'],
      })
    },
  })
}

/**
 * Edits an event by replacing with the new eventData
 */
export function useEditEvent(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventData: EventPutData) => editEvent(eventId, eventData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['events', eventId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['events'],
      })
    },
  })
}

/**
 * Deletes an event.
 */
export function useDeleteEvent(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: async () => {
      await queryClient.removeQueries({ queryKey: ['events', eventId] })
      await queryClient.invalidateQueries({
        queryKey: ['events'],
      })
    },
  })
}

async function invalidateEventQueries(
  queryClient: QueryClient,
  eventId: number,
) {
  await queryClient.invalidateQueries({ queryKey: ['events', eventId] })
  await queryClient.invalidateQueries({ queryKey: ['events'] })
}

/**
 * Register as volunteer coordinator (trainer) for an event.
 */
export function useRegisterEventCoordinator(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: EventCoordinatorRegistrationPostData) =>
      registerEventCoordinator(eventId, body),
    onSuccess: async () => {
      await invalidateEventQueries(queryClient, eventId)
    },
  })
}

/**
 * Register as volunteer for an event.
 */
export function useRegisterEventVolunteer(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: EventRegistrationPostData) =>
      registerEventVolunteer(eventId, body),
    onSuccess: async () => {
      await invalidateEventQueries(queryClient, eventId)
    },
  })
}
