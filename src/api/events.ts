import type { Event, EventPostData, EventPutData, EventRegistrationPostData } from '@/types/events'
import { api } from './baseApi'

const baseUrl = '/v1'

/**
 * Returns the list of all events
 */
export async function getEvents(): Promise<Event[]> {
  const res = await api.get(`${baseUrl}/events`)
  return res.data
}

/**
 * Returns an event
 */
export async function getEvent(eventId: number): Promise<Event> {
  const res = await api.get(`${baseUrl}/events/${eventId}`)
  return res.data
}

/**
 * Creates a new event
 */
export async function createEvent(eventData: EventPostData): Promise<Event> {
  const res = await api.post(`${baseUrl}/events`, eventData)
  return res.data
}

/**
 * Edits an event by replacing with the new eventData
 */
export async function editEvent(
  eventId: number,
  eventData: EventPutData,
): Promise<Event> {
  const res = await api.put(`${baseUrl}/events/${eventId}`, eventData)
  return res.data
}

/**
 * Registers a volunteer as a participant of an event
 */
export async function registerEventParticipant(
  eventId: number,
  registrationData: EventRegistrationPostData,
): Promise<void> {
  const res = await api.post(`${baseUrl}/events/${eventId}/register`, registrationData)
  return res.data
}
