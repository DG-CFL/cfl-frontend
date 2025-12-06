export type Person = {
  name: string
  role: string
}

export type Event = {
  id: string
  eventName: string
  status: string
  location: string
  coverImage: string
  startDate: string
  endDate: string
  description: string
  coordinators: Array<Person>
  volunteers: Array<Person>
}
