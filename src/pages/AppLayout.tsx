import Sidebar from "@/components/Sidebar";
import { Outlet,useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react'
import { useAuth } from '@/auth/AuthProvider'

export default function AppLayout() {
  const { currentUser, authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate({ to: '/login' })
    }
  }, [authLoading, currentUser, navigate])

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null
  }
  
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  )
}
