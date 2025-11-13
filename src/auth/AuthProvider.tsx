import { onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './auth'
import type { User } from '@/types/auth'

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
