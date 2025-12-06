import type { SignUpData, User } from '@/types/auth'
import { api } from './baseApi'

/**
 * Registers a new user
 */
export async function registerUser(signUpData: SignUpData): Promise<User> {
  const res = await api.post('/auth/sign-up', signUpData)
  return res.data
}
