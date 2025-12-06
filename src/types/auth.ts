export type Role = "admin" | "volunteer" | "public"

export type SignUpData = {
  email: string
  password: string
  name: string
  gender: string
  dateOfBirth: Date
  contactNumber: string
  emailOptIn: boolean
}
