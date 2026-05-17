export type UserRole = 'CFL' | 'admin' | 'trainer' | 'public'

export type SignUpFormData = {
  email: string
  password: string

  fullName: string
  gender: string
  yearOfBirth: string
  contactNumber: string
  marketingEmailPref: boolean
}

export type SignUpPostData = {
  fullName: string
  gender: string
  dateOfBirth: string
  contactNumber: string
  marketingEmailPref: boolean
}

export type UserAccount = {
  userId: string
  role: UserRole
  name: string
}
