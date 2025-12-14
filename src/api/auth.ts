import type { SignUpData, UserAccount } from '@/types/auth'
import { api } from './baseApi'

/**
 * Signs up a new user
 */
export async function signUpUser(signUpData: SignUpData): Promise<UserAccount> {
  const res = await api.post('/auth/signup', signUpData)
  return res.data
}
