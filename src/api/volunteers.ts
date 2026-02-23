import type { Volunteer, VolunteerCertification, VolunteerEvent } from '@/types/volunteers'
import { api } from './baseApi'

const baseUrl = '/v1/vms'

// Returns a list of volunteers
// TODO: Accept params for filtering, sorting and pagination
export async function getVolunteers(): Promise<Volunteer[]> {
  const res = await api.get(`${baseUrl}/volunteers`)
  return res.data
}

// Returns a volunteer specified by the volunteerId
export async function getVolunteer(volunteerId: number): Promise<Volunteer> {
  const res = await api.get(`${baseUrl}/volunteers/${volunteerId}`)
  return res.data
}

// Returns the list of the specified volunteer's certifications
export async function getVolunteerCertifications(volunteerId: number): Promise<VolunteerCertification> {
  const res = await api.get(`${baseUrl}/volunteers/${volunteerId}/certifications`)
  return res.data
}

// Returns the list of events attended by the specified volunteer
export async function getVolunteerHistory(volunteerId: number): Promise<VolunteerEvent> {
  const res = await api.get(`${baseUrl}/volunteers/${volunteerId}/history`)
  return res.data
}

// Deletes all volunteers specified by the list of volunteerIds
export async function deleteVolunteers(volunteerIds: number[]) {
  await api.delete(`${baseUrl}/volunteers`, {
    data: { ids: volunteerIds },
  })
}
