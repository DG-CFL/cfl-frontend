import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateVolunteerParams } from '@/api/volunteers'
import {
  deleteVolunteers,
  getVolunteer,
  getVolunteerCertifications,
  getVolunteerHistory,
  getVolunteers,
  updateVolunteer,
} from '@/api/volunteers'

/**
 * Returns a list of volunteers
 * TODO: Accept params for filtering, sorting and pagination
 */
export function useGetVolunteers() {
  return useQuery({
    queryKey: ['volunteers'],
    queryFn: getVolunteers,
  })
}

/**
 * Returns a volunteer
 */
export function useGetVolunteer(
  volunteerId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['volunteers', volunteerId],
    queryFn: () => getVolunteer(volunteerId),
    enabled:
      options?.enabled !== false && Boolean(volunteerId && volunteerId.length > 0),
  })
}

export function useUpdateVolunteer(volunteerId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateVolunteerParams) =>
      updateVolunteer(volunteerId, params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['volunteers', volunteerId] })
      await queryClient.invalidateQueries({ queryKey: ['volunteers'] })
    },
  })
}

/**
 * Returns the list of the volunteer's certifications
 */
export function useGetVolunteerCertifications(volunteerId: string) {
  return useQuery({
    queryKey: ['volunteers', volunteerId, 'certifications'],
    queryFn: () => getVolunteerCertifications(volunteerId),
  })
}

/**
 * Returns the list of events attended by the volunteer
 */
export function useGetVolunteerHistory(volunteerId: string) {
  return useQuery({
    queryKey: ['volunteers', volunteerId, 'history'],
    queryFn: () => getVolunteerHistory(volunteerId),
  })
}

/**
 * Deletes all volunteers specified by the list of volunteerIds
 */
export function useDeleteVolunteers(volunteerIds: Array<number>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteVolunteers(volunteerIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['volunteers'],
      })
    },
  })
}
