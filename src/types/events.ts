export type Person = {
  name: string
  role: string
}

export type EventCategory = 'event' | 'training'

export type Event = {
  id: number
  name: string
  status: string
  category: EventCategory
  location: string
  coverImage?: string
  startDate: Date
  endDate: Date
  description: string
  coordinators: Array<Person>
  volunteers: Array<Person>
}

export type EventPostData = {
  name: string
  description: string
  startDate: Date
  endDate: Date
  venue: string
  postalCode: string
  coverImage?: string
}

export type EventPutData = EventPostData 

export type EventRegistrationPostData = {
  volunteerId: number
  eventId: number
  numberOfAttendees: number
}
