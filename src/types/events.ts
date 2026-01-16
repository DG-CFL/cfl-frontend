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

// may need to change
export type EventPostData = {
  eventName: string
  eventStatus: string
  location: string
  startDate: Date
  endDate: Date
  projectDescription: string
  coverImage?: string
  coordinators: Array<Person>
}

export type EventPutData = EventPostData 

export type EventRegistrationPostData = {
  volunteerId: number
  eventId: number
  numberOfAttendees: number
}
