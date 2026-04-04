import { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import axios from 'axios'
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  MapPin,
  SquarePen,
} from 'lucide-react'

import type { EventParticipantEntry } from '@/types/events'
import type { Volunteer } from '@/types/volunteers'

import { getVolunteer } from '@/api/volunteers'
import { useCurrentUser } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import {
  useGetEvent,
  useRegisterEventCoordinator,
  useRegisterEventVolunteer,
} from '@/operations/events'
import LoadingSkeleton from '@/pages/LoadingSkeleton'
import { VolunteerProfileModal } from '@/pages/vms/events/VolunteerProfileModal'

export default function ViewEvent() {
  const { eventId } = useParams({ strict: false })
  const eventIdNum = Number(eventId!)

  const { data, isLoading, isError } = useGetEvent(eventIdNum)
  const registerCoordinator = useRegisterEventCoordinator(eventIdNum)
  const registerVolunteer = useRegisterEventVolunteer(eventIdNum)
  const currentUser = useCurrentUser()
  const [signupSucceeded, setSignupSucceeded] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const canOpenVolunteerProfile =
    currentUser != null && currentUser.role !== 'public'

  const coordinatorIds = useMemo(
    () => collectFirebaseIds(data?.volunteerCoordinators),
    [data?.volunteerCoordinators],
  )
  const participantIds = useMemo(
    () => collectFirebaseIds(data?.volunteers),
    [data?.volunteers],
  )

  const uniqueIds = useMemo(() => {
    return [...new Set([...coordinatorIds, ...participantIds])]
  }, [coordinatorIds, participantIds])

  const volunteerQueries = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: ['volunteers', id] as const,
      queryFn: () => getVolunteer(id),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const volunteerById = useMemo(() => {
    const map = new Map<string, Volunteer>()
    uniqueIds.forEach((id, index) => {
      const result = volunteerQueries[index]?.data
      if (result) map.set(id, result)
    })
    return map
  }, [uniqueIds, volunteerQueries])

  const [profileVolunteerId, setProfileVolunteerId] = useState<string | null>(
    null,
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !data) {
    return <ErrorAlert />
  }

  const signupPending =
    registerCoordinator.isPending || registerVolunteer.isPending

  const handleCoordinatorSignup = async () => {
    setSignupError(null)
    if (!currentUser?.userId) {
      setSignupError('Please sign in to sign up.')
      return
    }
    try {
      await registerCoordinator.mutateAsync({
        coordinatorId: currentUser.userId,
      })
      setSignupSucceeded(true)
    } catch (err) {
      setSignupError(apiErrorMessage(err))
    }
  }

  const handleVolunteerSignup = async () => {
    setSignupError(null)
    if (!currentUser?.userId) {
      setSignupError('Please sign in to sign up.')
      return
    }
    try {
      await registerVolunteer.mutateAsync({
        volunteerId: currentUser.userId,
      })
      setSignupSucceeded(true)
    } catch (err) {
      setSignupError(apiErrorMessage(err))
    }
  }

  if (signupSucceeded) {
    return (
      <div className="px-10 py-14">
        <div className="mx-auto flex max-w-[950px] flex-col items-center gap-6 rounded-[10px] border border-muted-foreground/30 bg-white px-8 py-20 text-center">
          <CheckCircle2 className="h-20 w-20 text-[#76B043]" />
          <h1 className="text-5xl font-semibold text-[#0F172A]">
            You have successfully signed up!
          </h1>
          <p className="text-xl text-muted-foreground">
            Please check your inbox for the confirmation email.
          </p>
          <Button
            variant="link"
            className="text-base text-[#545F71]"
            onClick={() => setSignupSucceeded(false)}
          >
            Back to Event Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[1662px] flex-col gap-9 px-10 py-14">
      <div className="flex items-center gap-6">
        <h1>{data.name}</h1>
        {currentUser?.role === 'admin' && (
          <Link to="/events/$eventId/edit" params={{ eventId: eventId! }}>
            <Button className="h-11 gap-2 rounded-lg bg-[#545F71] px-5 text-base font-semibold">
              <SquarePen className="size-5" aria-hidden="true" />
              Edit Event Details
            </Button>
          </Link>
        )}
        {currentUser?.role === 'public' && (
          <div className="flex flex-wrap justify-end gap-3 sm:justify-center">
            <Button
              type="button"
              className="h-11 gap-2 rounded-lg bg-[#545F71] px-5 text-base font-semibold"
              disabled={signupPending}
              onClick={handleCoordinatorSignup}
            >
              Sign up as Trainer!
            </Button>
            <Button
              type="button"
              className="h-11 gap-2 rounded-lg bg-[#545F71] px-5 text-base font-semibold"
              disabled={signupPending}
              onClick={handleVolunteerSignup}
            >
              Sign up as Volunteer!
            </Button>
          </div>
        )}
      </div>

      {currentUser?.role === 'public' && signupError ? (
        <ErrorAlert message={signupError} />
      ) : null}

      <Card className="h-[455px] gap-0 rounded-[10px] border-muted-foreground/30 py-0">
        <CardHeader className="px-8 pb-6 pt-8">
          <CardTitle>
            <h2>Event Information</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto px-8 pb-8 pt-0">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <h4>{data.startDate.toLocaleString()}</h4>
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
                  <h4>{data.endDate.toLocaleString()}</h4>
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
            <div className="space-y-3">
              {data.volunteerCoordinators.length === 0 ? (
                <p className="text-sm text-muted-foreground">None listed.</p>
              ) : (
                data.volunteerCoordinators.map((entry, index) => (
                  <PersonListItem
                    key={`coord-${typeof entry === 'string' ? entry : entry.name}-${index}`}
                    entry={entry}
                    defaultRole="Volunteer Coordinator"
                    volunteerById={volunteerById}
                    queryLoading={volunteerQueries.some((q) => q.isLoading)}
                    interactive={canOpenVolunteerProfile}
                    onOpenProfile={(id) => setProfileVolunteerId(id)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2>Volunteers</h2>
            <div className="space-y-3">
              {data.volunteers.length === 0 ? (
                <p className="text-sm text-muted-foreground">None listed.</p>
              ) : (
                data.volunteers.map((entry, index) => (
                  <PersonListItem
                    key={`vol-${typeof entry === 'string' ? entry : entry.name}-${index}`}
                    entry={entry}
                    defaultRole="Volunteer"
                    volunteerById={volunteerById}
                    queryLoading={volunteerQueries.some((q) => q.isLoading)}
                    interactive={canOpenVolunteerProfile}
                    onOpenProfile={(id) => setProfileVolunteerId(id)}
                  />
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {canOpenVolunteerProfile && (
        <VolunteerProfileModal
          volunteerId={profileVolunteerId}
          open={profileVolunteerId !== null}
          onOpenChange={(open) => {
            if (!open) setProfileVolunteerId(null)
          }}
        />
      )}
    </div>
  )
}

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { detail?: unknown } | undefined
    if (typeof data?.detail === 'string') {
      return data.detail
    }
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item) =>
          typeof item === 'object' &&
          item !== null &&
          'msg' in item &&
          typeof (item as { msg: unknown }).msg === 'string'
            ? (item as { msg: string }).msg
            : JSON.stringify(item),
        )
        .join(' ')
    }
  }
  if (err instanceof Error) {
    return err.message
  }
  return 'Something went wrong'
}

function collectFirebaseIds(
  entries: Array<EventParticipantEntry> | undefined,
): Array<string> {
  if (!entries?.length) return []
  return entries.filter((e): e is string => typeof e === 'string')
}

function PersonListItem({
  entry,
  defaultRole,
  volunteerById,
  queryLoading,
  interactive,
  onOpenProfile,
}: {
  entry: EventParticipantEntry
  defaultRole: string
  volunteerById: Map<string, Volunteer>
  queryLoading: boolean
  interactive: boolean
  onOpenProfile: (volunteerId: string) => void
}) {
  if (typeof entry === 'string') {
    const resolved = volunteerById.get(entry)
    const displayName =
      resolved?.name ?? (queryLoading ? 'Loading…' : entry)

    const body = (
      <>
        <div className="flex items-center gap-4">
          <div
            className="size-12 shrink-0 rounded-full bg-gradient-to-br from-[#545F71] to-[#6b7280] ring-2 ring-white shadow"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <h3 className="text-lg font-semibold text-slate-900">{displayName}</h3>
            <p className="text-base text-muted-foreground">{defaultRole}</p>
          </div>
        </div>
        {interactive ? (
          <ChevronRight
            className="size-5 shrink-0 text-slate-400 transition group-hover:text-[#545F71]"
            aria-hidden
          />
        ) : null}
      </>
    )

    if (!interactive) {
      return (
        <div className="flex w-full items-center gap-4 rounded-xl px-3 py-2">
          {body}
        </div>
      )
    }

    return (
      <button
        type="button"
        onClick={() => onOpenProfile(entry)}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#545F71]"
      >
        {body}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-xl px-3 py-2">
      <div className="size-12 rounded-full bg-muted" aria-hidden="true" />
      <div className="space-y-1">
        <h3>{entry.name}</h3>
        <p className="text-base leading-7 text-muted-foreground">
          {entry.role || defaultRole}
        </p>
      </div>
    </div>
  )
}
