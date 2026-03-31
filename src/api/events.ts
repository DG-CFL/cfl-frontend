import { api } from './baseApi'
import type {
  Event,
  EventPostData,
  EventPutData,
  EventRegistrationPostData,
} from '@/types/events'

const baseUrl = '/v1'

function absoluteUri(path: string): string {
  const base = api.defaults.baseURL ?? ''
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function sanitizeEventBodyForLog(
  body: EventPostData | EventPutData,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...body }
  const cover = out.coverImage
  if (typeof cover === 'string' && cover.length > 160) {
    out.coverImage = `[truncated data URL / base64, length=${cover.length}]`
  }
  return out
}

function logEventRequest(
  method: string,
  path: string,
  body: EventPostData | EventPutData,
): void {
  console.log(
    JSON.stringify(
      {
        method,
        uri: absoluteUri(path),
        body: sanitizeEventBodyForLog(body),
      },
      null,
      2,
    ),
  )
}

/**
 * Returns the list of all events
 */
export async function getEvents(): Promise<Array<Event>> {
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
  const path = `${baseUrl}/events`
  logEventRequest('POST', path, eventData)
  const res = await api.post(path, eventData)
  return res.data
}

/**
 * Edits an event by replacing with the new eventData
 */
export async function editEvent(
  eventId: number,
  eventData: EventPutData,
): Promise<Event> {
  const path = `${baseUrl}/sessions/events/${eventId}`
  logEventRequest('PUT', path, eventData)
  const res = await api.put(path, eventData)
  return res.data
}

/**
 * Registers a volunteer as a participant of an event
 */
export async function registerEventParticipant(
  eventId: number,
  registrationData: EventRegistrationPostData,
): Promise<void> {
  const res = await api.post(
    `${baseUrl}/sessions/events/${eventId}/register`,
    registrationData,
  )
  return res.data
}
