import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  EventPostData,
  EventPutData,
  EventRegistrationPostData,
} from '@/types/events'
import {
  createEvent,
  editEvent,
  getEvent,
  getEvents,
  registerEventParticipant,
} from '@/api/events'

/**
 * Returns the list of all events
 */
export function useGetEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    // Keep events data cached across route transitions.
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
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
 * Registers a volunteer as a participant of an event
 */
export function useRegisterEventParticipant(eventId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (registrationData: EventRegistrationPostData) =>
      registerEventParticipant(eventId, registrationData),
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
