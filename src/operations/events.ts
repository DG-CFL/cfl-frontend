import { createEvent, editEvent, getEvent, getEvents } from '@/api/events'
import type { EventPostData, EventPutData } from '@/types/events'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Returns the list of all events
 */
export function useGetEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
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
export function useCreateEvent(eventData: EventPostData) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => createEvent(eventData),
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
    },
  })
}
