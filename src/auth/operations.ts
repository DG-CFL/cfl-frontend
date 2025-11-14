import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)

export async function signUp(email: string, password: string) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.log('Sign up failed: ', err)
  }
}

export async function signIn(email: string, password: string, rememberMe?: boolean) {
  try {
    // TODO: const userCred = await signInWithEmailAndPassword(auth, email, password)

    let user = null

    // Temp login logic
    if (
      email === ADMIN_CRENDENTIALS.email &&
      password === ADMIN_CRENDENTIALS.password
    ) {
      user = { email, role: 'admin' }
    }

    if (
      email === VOLUNTEER_CREDENTIALS.email &&
      password === VOLUNTEER_CREDENTIALS.password
    ) {
      user = { email, role: 'volunteer' }
    }

    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
  } catch (err) {
    console.log('Sign in failed: ', err)
    return null;
  }
}

// Temp dummy credentials
const ADMIN_CRENDENTIALS = { email: 'admin@cfl.com', password: '123' }
const VOLUNTEER_CREDENTIALS = { email: 'volunteer@cfl.com', password: '123' }
