import { api } from './baseApi'
import type { Volunteer, VolunteerCertification, VolunteerEvent } from '@/types/volunteers'

const baseUrl = '/v1/admin/vms'

// Returns a list of volunteers
// TODO: Accept params for filtering, sorting and pagination
export async function getVolunteers(): Promise<Array<Volunteer>> {
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
export async function deleteVolunteers(volunteerIds: Array<number>) {
  await api.delete(`${baseUrl}/volunteers`, {
    data: { ids: volunteerIds },
  })
}

export type UpdateVolunteerParams = {
  certificate?: string
  certificationDate?: string
}

/**
 * PUT /v1/admin/vms/volunteers/update/{volunteer_id}
 * Query params are converted to snake_case by the API client (e.g. certificationDate → certification_date).
 */
export async function updateVolunteer(
  volunteerId: string,
  params: UpdateVolunteerParams,
): Promise<Volunteer> {
  const res = await api.put(
    `${baseUrl}/volunteers/update/${encodeURIComponent(volunteerId)}`,
    null,
    { params },
  )
  return res.data
}
