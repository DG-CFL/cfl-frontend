export type Person = {
  name: string
  role: string
}

export type Event = {
  id: number
  name: string
  status: string
  location: string
  coverImage?: string
  startDate: string
  endDate: string
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
