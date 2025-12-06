export type Volunteer = {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female'
  language: string[]
  activities: number
  trainings: number
  optin: boolean
  certifications: string[]
  volunteerHistory: string
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
