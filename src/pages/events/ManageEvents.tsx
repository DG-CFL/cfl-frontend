import { PlusCircle } from 'lucide-react'
import { PLACEHOLDER_EVENTS } from './placeholderEvents'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/ui_custom/EventCard'

export default function ManageEvents() {
  return (
    <div className="mx-auto w-full space-y-12 px-10 py-14 md:max-w-[calc(403px*2+24px)] xl:max-w-[calc(403px*3+24px*2)]">
      <div className="flex items-center justify-between">
        <h1>Manage events</h1>
        <Button
          variant="default"
          className="h-[42px] w-[190px] gap-2.5 rounded-md bg-[#545F71] px-4 py-3 text-base font-medium"
        >
          <PlusCircle className="size-5" aria-hidden="true" />
          Create New Event
        </Button>
      </div>

      <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
        {PLACEHOLDER_EVENTS.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.eventName}
            location={event.location}
            dateRange={`${event.startDate} – ${event.endDate}`}
          />
        ))}
      </div>
    </div>
  )
}
