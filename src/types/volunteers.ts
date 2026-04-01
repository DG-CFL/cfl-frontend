/** Certificate from GET /volunteers/{volunteer_id} detail response */
export type VolunteerCertificate = {
  link: string
  date: string
}
export type Volunteer = {
  volunteerId?: string
  id?: string
  name: string
  age: number
  gender: string
  emailOptIn?: boolean
  eventsAttended?: number
  trainingSessionsAttended?: number
  certificate?: VolunteerCertificate | null
  /** Legacy / mock-only fields */
  language?: string[]
  activities?: number
  trainings?: number
  optin?: boolean
  certifications?: string[]
  volunteerHistory?: string
}

export type VolunteerEvent = {
  event: string
  role: string
  hours: number
  time: number
  date: Date
}

export type VolunteerCertification = {
  name: string
}
