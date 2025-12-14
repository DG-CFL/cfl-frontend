export type Role = "cfl" | "admin" | "volunteer" | "public"

export type SignUpData = {
  email: string
  password: string

  fullName: string
  gender: string
  dateOfBirth: Date
  contactNumber: string
  marketingEmailPref: boolean
}

export type UserAccount = {
  userId: string
  role: Role
}
