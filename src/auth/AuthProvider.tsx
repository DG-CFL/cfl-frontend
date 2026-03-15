import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { UserAccount, UserRole } from '@/types/auth'

type AuthContextValue = {
  currentUser: UserAccount | null
  authLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({ 
  currentUser: null,
  authLoading: true, })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  useEffect(() => {
    const auth = getAuth()
    return onAuthStateChanged(auth, async (user) => {
      console.log(user)

      if (user) {
        const token = await user.getIdTokenResult()
        const role = (token.claims.role ?? 'public') as UserRole

        setCurrentUser({
          userId: user.uid,
          role,
          name: user.displayName ?? ''
        })
      } else {
        setCurrentUser(null)
      }

      setAuthLoading(false)
    }) 
  }, [])

  const authValue: AuthContextValue = { currentUser, authLoading }

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
