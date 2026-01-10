import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { useGetEvent, useRegisterEventParticipant } from '@/operations/events'
import LoadingSkeleton from '@/pages/LoadingSkeleton'
import type { EventRegistrationPostData } from '@/types/events'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

/**
 * Page for a user to register for an event
 */
export default function RegisterEvent() {
  const { eventId } = useParams({ strict: false })

  const { data: event, isLoading, isError } = useGetEvent(Number(eventId!))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventRegistrationPostData>()

  const registerEvent = useRegisterEventParticipant(Number(eventId))
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const onSubmit: SubmitHandler<EventRegistrationPostData> = async (data) => {
    try {
      await registerEvent.mutateAsync(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !event) {
    return <ErrorAlert />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-10 py-14 flex flex-col gap-8"
    >
      <h1>Registration</h1>
      <h2>{event.name}</h2>

      <div className="space-y-2">
        <Label htmlFor="number-of-attendees" className="text-base text-[#545F71]">
          Number of Attendees
        </Label>
        <Input
          id="number-of-attendees"
          type='number'
          {...register('numberOfAttendees')}
          className="h-12 w-[1254px]"
        />
        {errors.numberOfAttendees && <ErrorAlert message={errors.numberOfAttendees.message} />}
      </div>

      {/* Server errors (if any) */}
      {error && <ErrorAlert message={error} />}

      {/* Action Buttons */}
      <div className="flex justify-end gap-[10px] pt-2">
        <Button
          type="button"
          variant="outline"
          className="h-[42px] w-[154px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
          onClick={() =>
            navigate({
              to: '/events/$eventId/view',
              params: { eventId: eventId! },
            })
          }
        >
          Cancel
        </Button>
        <Button className="h-[42px] w-[154px] rounded-md bg-[#545F71] px-4 py-3 text-base font-semibold">
          Register
        </Button>
      </div>
    </form>
  )
}
