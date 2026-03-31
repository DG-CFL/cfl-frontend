export type Person = {
  name: string
  role: string
}

export type EventCategory = 'event' | 'training'

export type Event = {
  eventId: number
  name: string
  status: string
  category: EventCategory
  location: string
  coverImage?: string
  startDate: Date
  endDate: Date
  description: string
  volunteerCoordinators: Array<Person>
  volunteers: Array<Person>
}

export type EventPostData = {
  name: string
  description: string
  startDate: string
  endDate: string
  venue: string
  postalCode?: number
  coverImage?: string
  trainers: Array<string>
}

export type EventPutData = EventPostData 

export type EventRegistrationPostData = {
  volunteerId: string
}
