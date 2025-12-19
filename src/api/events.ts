import type { Event, EventPostData, EventPutData } from "@/types/events";
import { api } from "./baseApi";
import { eventData, eventListData } from "@/data/events";

/**
 * Returns the list of all events
 */
export async function getEvents(): Promise<Event[]> {
  // const res = await api.get("/events")
  // return res.data
  return eventListData
}

/**
 * Returns an event
 */
export async function getEvent(eventId: number): Promise<Event> {
  // const res = await api.get(`/events/${eventId}`)
  // return res.data
  return eventData
}

/**
 * Creates a new event
 */
export async function createEvent(eventData: EventPostData): Promise<Event> {
  const res = await api.post('/events', eventData)
  return res.data
}

/**
 * Edits an event by replacing with the new eventData
 */
export async function editEvent(eventId: number, eventData: EventPutData): Promise<Event> {
  const res = await api.put(`/events/${eventId}`, eventData)
  return res.data
}

