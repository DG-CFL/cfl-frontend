import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { eventData } from '@/data/events'
import type { Person } from '@/types/events'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CalendarDays, ImageIcon, MapPin, SquarePen } from 'lucide-react'



export default function ViewEvent() {
  const { eventId } = useParams({ strict: false })
  const navigate = useNavigate()

  const data = eventData

  return (
    <div className="mx-auto flex w-full max-w-[1662px] flex-col gap-9 px-10 py-14">
      <div className="flex items-center gap-6">
        <h1>{data.name}</h1>
        <Button
          className="h-11 gap-2 rounded-lg bg-[#545F71] px-5 text-base font-semibold"
          onClick={() => {
            if (data.id) {
              navigate({ to: `/events/edit-event/${data.id}` })
            }
          }}
        >
          <SquarePen className="size-5" aria-hidden="true" />
          Edit Event Details
        </Button>
      </div>

      <Card className="h-[455px] gap-0 rounded-[10px] border-muted-foreground/30 py-0">
        <CardHeader className="px-8 pb-6 pt-8">
          <CardTitle>
            <h2>Event Information</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto px-8 pb-8 pt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Row 1: Status, Location, Cover Image */}
            <div className="space-y-3">
              <p className="text-xl leading-7 text-muted-foreground">Status</p>
              <Button
                size="sm"
                className="pointer-events-none rounded-full bg-[#545F71] px-4 text-base text-primary-foreground"
              >
                {data.status}
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-xl leading-7 text-muted-foreground">
                Location
              </p>
              <div className="flex items-center gap-2">
                <MapPin
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <h4>{data.location}</h4>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xl leading-7 text-muted-foreground">
                Cover Image
              </p>
              <div className="flex items-center gap-2">
                <ImageIcon
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <h4>{data.coverImage}</h4>
              </div>
            </div>

            {/* Row 2: Start Date & End Date (left) | Description (right, spanning 2 cols) */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xl leading-7 text-muted-foreground">
                  Start Date
                </p>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <h4>{data.startDate}</h4>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xl leading-7 text-muted-foreground">
                  End Date
                </p>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <h4>{data.endDate}</h4>
                </div>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <p className="text-xl leading-7 text-muted-foreground">
                Description
              </p>
              <h4>{data.description}</h4>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 rounded-[10px] border-muted-foreground/30">
        <CardContent className="grid max-h-[600px] gap-10 overflow-y-auto px-8 py-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h2>Volunteer Coordinators</h2>
            <div className="space-y-5">
              {data.coordinators.map((person) => (
                <PersonListItem key={person.role} person={person} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2>Volunteers</h2>
            <div className="space-y-5">
              {data.volunteers.map((person, index) => (
                <PersonListItem
                  key={`${person.name}-${index}`}
                  person={person}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PersonListItem({ person }: { person: Person }) {
  return (
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-full bg-muted" aria-hidden="true" />
      <div className="space-y-1">
        <h3>{person.name}</h3>
        <p className="text-base leading-7 text-muted-foreground">
          {person.role}
        </p>
      </div>
    </div>
  )
}
