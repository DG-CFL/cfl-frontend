import { Outlet } from '@tanstack/react-router'

export function VolunteerLayout() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
