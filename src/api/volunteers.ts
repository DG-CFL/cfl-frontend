import type { Volunteer, VolunteerCertification, VolunteerEvent } from '@/types/volunteers'
import { api } from './baseApi'

const baseUrl = '/v1/admin/vms'

// Returns a list of volunteers
// TODO: Accept params for filtering, sorting and pagination
export async function getVolunteers(): Promise<Volunteer[]> {
  const res = await api.get(`${baseUrl}/volunteers`)
  return res.data
}

/** `volunteerId` is the Firebase UID (path: `volunteer_id` in OpenAPI). */
export async function getVolunteer(volunteerId: string): Promise<Volunteer> {
  const res = await api.get(
    `${baseUrl}/volunteers/${encodeURIComponent(volunteerId)}`,
  )
  return res.data
}

export async function getVolunteerCertifications(
  volunteerId: string,
): Promise<VolunteerCertification> {
  const res = await api.get(
    `${baseUrl}/volunteers/${encodeURIComponent(volunteerId)}/certifications`,
  )
  return res.data
}

export async function getVolunteerHistory(
  volunteerId: string,
): Promise<VolunteerEvent> {
  const res = await api.get(
    `${baseUrl}/volunteers/${encodeURIComponent(volunteerId)}/history`,
  )
  return res.data
}

// Deletes all volunteers specified by the list of volunteerIds
export async function deleteVolunteers(volunteerIds: number[]) {
  await api.delete(`${baseUrl}/volunteers`, {
    data: { ids: volunteerIds },
  })
}
