import type {
  Volunteer,
  VolunteerCertification,
  VolunteerEvent,
} from '@/types/vms'
import { api } from './baseApi'

import { serializeParams} from './utils'
import type { ApiCollection, QueryParams } from '@/types/api_utils'
import { volunteerListData } from '@/data/vms'

// Returns a list of volunteers
export async function getVolunteers(
  params: QueryParams = {},
): Promise<ApiCollection<Volunteer>> {
  // const res = await api.get('/volunteers', {
  //   params,
  //   paramsSerializer: serializeParams,
  // })
  // return res.data
  return {
    items: volunteerListData,
    totalCount: 5
  }
}

// Returns a volunteer specified by the volunteerId
export async function getVolunteer(volunteerId: number): Promise<Volunteer> {
  const res = await api.get(`/volunteers/${volunteerId}`)
  return res.data
}

// Returns the list of the specified volunteer's certifications
export async function getVolunteerCertifications(
  volunteerId: number,
): Promise<VolunteerCertification> {
  const res = await api.get(`/volunteers/${volunteerId}/certifications`)
  return res.data
}

// Returns the list of events attended by the specified volunteer
export async function getVolunteerHistory(
  volunteerId: number,
): Promise<VolunteerEvent> {
  const res = await api.get(`/volunteers/${volunteerId}/history`)
  return res.data
}

// Deletes all volunteers specified by the list of volunteerIds
export async function deleteVolunteers(volunteerIds: number[]) {
  await api.delete('/volunteers', {
    data: { ids: volunteerIds },
  })
}
