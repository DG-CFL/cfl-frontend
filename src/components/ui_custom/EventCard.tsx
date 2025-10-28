import { Calendar, MapPin } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export type EventCardProps = {
  id: string
  name: string
  location: string
  dateRange: string
  imageUrl?: string
  onViewEdit?: (id: string) => void
}

export function EventCard({
  id,
  name,
  location,
  dateRange,
  imageUrl,
  onViewEdit,
}: EventCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex h-[425px] w-full max-w-[403px] flex-col overflow-hidden rounded-2xl border border-muted-foreground/20 p-0 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="h-[172.27px] w-full bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 100 100"
              className="size-full text-muted-foreground/30"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="10"
                y1="10"
                x2="90"
                y2="90"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="90"
                y1="10"
                x2="10"
                y2="90"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          )}
        </div>
      </CardHeader>

      <div className="flex h-[calc(425px-172.27px)] flex-col px-6 pb-6 pt-1">
        <CardTitle className="text-[24px] font-semibold leading-8 tracking-[-0.006em]">
          {name}
        </CardTitle>

        <div className="mt-auto flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" aria-hidden="true" />
            <span>{dateRange}</span>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            className="h-11 w-full rounded-lg border border-muted-foreground/30 px-4 text-sm font-medium hover:bg-muted/50"
            onClick={() => 
              navigate({
                to: '/events/view-event',
              })
            }
          >
            View/Edit Details
          </Button>
        </div>
      </div>
    </Card>
  )
}
