export type Role = 'cfl' | 'admin' | 'volunteer' | 'public'

export type SignUpFormData = {
  email: string
  password: string

  fullName: string
  gender: string
  dateOfBirth: Date
  contactNumber: string
  marketingEmailPref: boolean
  
  acknowledgedTermsOfUse: boolean // Must be true for form to be submitted
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
  role: Role
}
