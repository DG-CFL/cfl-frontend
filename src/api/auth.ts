import type { SignUpPostData, UserAccount } from '@/types/auth'
import { api } from './baseApi'

/**
 * Signs up a new user
 */
export async function signUpUser(signUpData: SignUpPostData): Promise<UserAccount> {
  const res = await api.post('/auth/signup', signUpData)
  return res.data
}
