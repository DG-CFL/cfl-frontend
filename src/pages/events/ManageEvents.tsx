import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/ui_custom/EventCard'

type EventSummary = {
  id: string
  name: string
  location: string
  dateRange: string
}

// Placeholder data for events
const placeholderEvents: Array<EventSummary> = [
  {
    id: 'event-1',
    name: 'Community Charity Gala',
    location: 'Harborview Conference Center · Seattle, WA',
    dateRange: 'April 12 – 14, 2025',
  },
  {
    id: 'event-2',
    name: 'Youth Leadership Summit',
    location: 'Northside Innovation Hub · Austin, TX',
    dateRange: 'May 8 – 9, 2025',
  },
  {
    id: 'event-3',
    name: 'Spring Volunteer Drive',
    location: 'Civic Green Park · Denver, CO',
    dateRange: 'April 20, 2025',
  },
  {
    id: 'event-4',
    name: 'Community Arts Festival',
    location: 'Riverside Pavilion · Portland, OR',
    dateRange: 'June 2 – 4, 2025',
  },
  {
    id: 'event-5',
    name: 'Neighborhood Cleanup Day',
    location: 'Central Plaza · Chicago, IL',
    dateRange: 'April 27, 2025',
  },
  {
    id: 'event-6',
    name: 'Annual Donor Reception',
    location: 'Skyline Terrace · New York, NY',
    dateRange: 'May 22, 2025',
  },
]

export default function ManageEvents() {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1320px] px-10 py-14 2xl:max-w-[1500px]">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-full flex items-center gap-6">
            <h1>Manage events</h1>
            <Button
              variant="default"
              className="ml-auto h-[42px] w-[190px] gap-2.5 rounded-md bg-[var(--color-primary)] px-4 py-3 text-base font-medium"
            >
              <PlusCircle className="size-5" aria-hidden="true" />
              Create New Event
            </Button>
          </div>

          {placeholderEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              location={event.location}
              dateRange={event.dateRange}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
