import { CalendarDays, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Sheet } from '@/components/ui/sheet'

const cards = [
  {
    to: '/volunteers',
    title: 'Manage Volunteers',
    description:
      'Oversee your volunteer base, manage profiles, and track engagement',
    Icon: Users,
    iconLabel: 'Volunteers',
  },
  {
    to: '/events',
    title: 'Manage Events',
    description:
      'Organise and schedule events, assign tasks, and track participation',
    Icon: CalendarDays,
    iconLabel: 'Events',
  },
] as const

export default function VmsLandingPage() {
  return (
    <div className="mx-auto w-full space-y-12 px-10 py-14">
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <h1>Welcome to the Volunteer Management System!</h1>
        <p className="m-4">
          Select an action to get started and manage your initiatives
        </p>

        <div className="flex w-3/4 flex-row items-center justify-around p-10">
          {cards.map(({ to, title, description, Icon, iconLabel }) => (
            <Link key={to} to={to}>
              <Sheet>
                <div className="flex h-80 w-90 flex-col items-center justify-center rounded-md bg-[#DADBDD]">
                  <div
                    className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-slate-400/35"
                    role="img"
                    aria-label={iconLabel}
                  >
                    <Icon
                      className="size-12 text-[#545F71]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <h3 className="m-5">{title}</h3>
                  <p className="max-w-xs px-4">{description}</p>
                </div>
              </Sheet>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
