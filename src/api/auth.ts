import type { SignUpPostData, UserAccount } from '@/types/auth'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

/**
 * Signs up a new user
 */
export async function signUpUser(
  signUpData: SignUpPostData,
): Promise<UserAccount> {
  const res = await axios.post(`${BASE_URL}/api/auth/signup`, signUpData)
  return res.data
}
