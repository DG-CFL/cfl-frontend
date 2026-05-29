export type Person = {
  name: string
  role: string
}

export type EventCategory = 'event' | 'training'

export type EventParticipantEntry = Person | string

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
  volunteerCoordinators: Array<EventParticipantEntry>
  volunteers: Array<EventParticipantEntry>
  isCurrentUserInvolved?: boolean
}

/** Matches backend `TrainerAssignment`: Firebase UID + role (see SessionCreateUpdate). */
export type EventTrainerAssignment = {
  id: string
  role: string
}

export type EventPostData = {
  name: string
  description: string
  startDate: string
  endDate: string
  venue: string
  postalCode?: number
  coverImage?: string
  trainers: Array<EventTrainerAssignment>
}

export type EventPutData = EventPostData 

export type EventRegistrationPostData = {
  volunteerId: string
}

export type EventCoordinatorRegistrationPostData = {
  coordinatorId: string
}
