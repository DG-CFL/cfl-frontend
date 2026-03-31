export type Volunteer = {
  id: string
  firebaseId?: string
  firebaseID?: string
  firebaseUid?: string
  uid?: string
  userId?: string
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
