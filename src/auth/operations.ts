import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { app } from './firebase'
import type { SignUpData } from '@/types/auth'

// Temp dummy credentials
const ADMIN_CRENDENTIALS = { email: 'admin@cfl.com', password: '123' }
const VOLUNTEER_CREDENTIALS = { email: 'volunteer@cfl.com', password: '123' }

export const auth = getAuth(app)

export async function signUp(signUpData: SignUpData) {
  try {
    // const userCred = await createUserWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.log('Sign up failed: ', err)
  }
}

export async function signIn(
  email: string,
  password: string,
  rememberMe?: boolean,
) {
  // TODO: const userCred = await signInWithEmailAndPassword(auth, email, password)

  let user = null

  // Temp login logic
  if (
    email === ADMIN_CRENDENTIALS.email &&
    password === ADMIN_CRENDENTIALS.password
  ) {
    user = { email, role: 'admin' }
  } else if (
    email === VOLUNTEER_CREDENTIALS.email &&
    password === VOLUNTEER_CREDENTIALS.password
  ) {
    user = { email, role: 'volunteer' }
  } else {
    throw new Error('Invalid login credentials')
  }

  sessionStorage.setItem('user', JSON.stringify(user))
  return user
}

/**
 * Send password reset email to the email address
 */
export async function sendPasswordResetEmail(email: string) {
  // TODO:
}

/**
 * Reset password to the new password
 */
export async function resetPassword(newPassword: string) {
  // TODO:
}
