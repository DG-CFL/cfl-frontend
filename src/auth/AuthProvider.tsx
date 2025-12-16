import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { UserAccount, UserRole } from '@/types/auth'

type AuthContextValue = {
  currentUser: UserAccount | null
}

const AuthContext = createContext<AuthContextValue>({ currentUser: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  
  useEffect(() => {
    const auth = getAuth()
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult()
        const role = (token.claims.role ?? 'public') as UserRole // If no role assigned, default to public
        setCurrentUser({
          userId: user.uid,
          role,
        })
      } else {
        setCurrentUser(null)
      }
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
  return useAuth().currentUser
}
