export type Role = "admin" | "volunteer" | "public"

export type SignUpData = {
  email: string
  password: string
  name: string
  gender: string
  dateOfBirth: string
  contactNumber: string
  emailOptIn: boolean
}
