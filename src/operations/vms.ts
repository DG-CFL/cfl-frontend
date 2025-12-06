import {
  deleteVolunteers,
  getVolunteer,
  getVolunteerCertifications,
  getVolunteerHistory,
  getVolunteers,
} from '@/api/vms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
export function useGetVolunteer(volunteerId: number) {
  return useQuery({
    queryKey: ['volunteers', volunteerId],
    queryFn: () => getVolunteer(volunteerId),
  })
}

/**
 * Returns the list of the volunteer's certifications
 */
export function useGetVolunteerCertifications(volunteerId: number) {
  return useQuery({
    queryKey: ['volunteers', volunteerId, 'certifications'],
    queryFn: () => getVolunteerCertifications(volunteerId),
  })
}

/**
 * Returns the list of events attended by the volunteer
 */
export function useGetVolunteerHistory(volunteerId: number) {
  return useQuery({
    queryKey: ['volunteers', volunteerId, 'history'],
    queryFn: () => getVolunteerHistory(volunteerId),
  })
}

/**
 * Deletes all volunteers specified by the list of volunteerIds
 */
export function useDeleteVolunteers(volunteerIds: number[]) {
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
