import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { app } from './config'

const auth = getAuth(app)

export async function signUp(email: string, password: string) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.log('Sign up failed: ', err)
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.log('Sign in failed: ', err)
  }
}
