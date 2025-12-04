import type { Volunteer } from '@/types/vms'
import { api } from './baseApi'

// Returns the list of all volunteers
// TODO: Allow filtering by passing in search filters as an object
export async function getVolunteers(): Promise<Volunteer[]> {
  const res = await api.get('/volunteers')
  return res.data
}

// Returns a volunteer specified by the volunteerId
export async function getVolunteer(volunteerId: number): Promise<Volunteer> {
  const res = await api.get(`/volunteers/${volunteerId}`)
  return res.data
}

// Deletes a volunteer specified by the volunteerId
export async function deleteVolunteer(volunteerId: number) {
  await api.delete(`/volunteers/${volunteerId}`)
}

// Deletes all volunteers specified by the list of volunteerIds
export async function deleteVolunteers(volunteerIds: number[]) {
  await api.delete('/volunteers', {
    data: { ids: volunteerIds },
  })
}
