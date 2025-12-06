import { onAuthStateChanged, type User } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './operations'
import type { Role } from '@/types/auth'

type AuthContextValue = {
  currentUser: User | null
}

const AuthContext = createContext<AuthContextValue>({ currentUser: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  const authValue: AuthContextValue = { currentUser }

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const useCurrentUser = () => {
  // Temp logic
  const value = sessionStorage.getItem("user")
  if (!value) return null
  return JSON.parse(value)
  
  // TODO: return useAuth().currentUser
}

export function getUserRole(user: User): Role {
  // Temp logic
  const value = sessionStorage.getItem("user")
  if (!value) return "public"
  return JSON.parse(value).role as Role

  // TODO: Actual logic here:
  // const jwt = await user.getIdTokenResult()
  // const role = jwt.claims.role as Role
  // return role === 'admin'
}
