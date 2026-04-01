import { Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'

import { useCurrentUser } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/ui_custom/EventCard'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { useGetEvents } from '@/operations/events'
import LoadingSkeleton from '@/pages/LoadingSkeleton'

export default function ManageEvents() {
  const { data: events, isLoading, isError } = useGetEvents()
  const currentUser = useCurrentUser()
  const showCreateEvent =
    currentUser != null && currentUser.role !== 'public'

  return (
    <div className="mx-auto w-full space-y-12 px-10 py-14 md:max-w-[calc(403px*2+24px)] xl:max-w-[calc(403px*3+24px*2)]">
      <div className="flex items-center justify-between">
        <h1>Manage events</h1>
        {showCreateEvent && (
          <Link to="/events/create">
            <Button
              variant="default"
              className="h-[42px] w-[190px] gap-2.5 rounded-md bg-[#545F71] px-4 py-3 text-base font-medium"
            >
              <PlusCircle className="size-5" aria-hidden="true" />
              Create New Event
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        {isError ? (
          <div className="col-span-full">
            <ErrorAlert />
          </div>
        ) : isLoading ? (
          <div className="col-span-full">
            <LoadingSkeleton variant="inline" className="min-h-[320px]" />
          </div>
        ) : (
          events?.map((event) => (
            <EventCard
              key={event.eventId}
              id={event.eventId}
              name={event.name}
              location={event.location}
              dateRange={`${event.startDate} – ${event.endDate}`}
            />
          ))
        )}
      </div>
    </div>
  )
}
