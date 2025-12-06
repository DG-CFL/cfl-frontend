import type { Volunteer, VolunteerCertification, VolunteerEvent } from '@/types/vms'
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

// Returns the list of the specified volunteer's certifications
export async function getVolunteerCertifications(volunteerId: number): Promise<VolunteerCertification> {
  const res = await api.get(`/volunteers/${volunteerId}/certifications`)
  return res.data
}

// Returns the list of events attended by the specified volunteer
export async function getVolunteerEvents(volunteerId: number): Promise<VolunteerEvent> {
  const res = await api.get(`/volunteers/${volunteerId}/history`)
  return res.data
}

// Deletes all volunteers specified by the list of volunteerIds
export async function deleteVolunteers(volunteerIds: number[]) {
  await api.delete('/volunteers', {
    data: { ids: volunteerIds },
  })
}
