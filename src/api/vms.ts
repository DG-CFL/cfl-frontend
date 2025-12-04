import type { Volunteer } from "@/types/vms";
import { api } from "./baseApi";

// Returns the list of all volunteers
// TODO: Allow filtering by passing in a FilterOptions object
export async function getVolunteers(): Promise<Volunteer[]> {
  const res = await api.get("/volunteers")
  return res.data
}

// Returns a volunteer specified by the volunteerId
export async function getVolunteer(volunteerId: number): Promise<Volunteer> {
  const res = await api.get(`/volunteers/${volunteerId}`)
  return res.data
}
