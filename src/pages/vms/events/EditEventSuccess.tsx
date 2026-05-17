import checkIcon from '@/assets/check-icon.svg'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function EditEventSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({ to: '/' })
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <img src={checkIcon} alt="Success" />
      <h1>Your event has been successfully updated</h1>
      <p className="text-center text-xl font-normal leading-7">
        It might take a few minutes for the changes to reflect on the main page
      </p>
    </div>
  )
}
