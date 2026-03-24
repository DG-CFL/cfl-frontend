import { useEffect, useMemo, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { CheckCircle2, X } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { EventRegistrationPostData } from '@/types/events'
import { useCurrentUser } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { useGetEvent, useRegisterEventParticipant } from '@/operations/events'
import LoadingSkeleton from '@/pages/LoadingSkeleton'

/**
 * Page for a user to register for an event
 */
export default function RegisterEvent() {
  const { eventId } = useParams({ strict: false })
  const { data: event, isLoading, isError } = useGetEvent(Number(eventId!))
  const registerEvent = useRegisterEventParticipant(Number(eventId))
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  type RegistrationFormData = {
    firstName: string
    lastName: string
    birthMonth: string
    birthDay: string
    birthYear: string
    email: string
    phone: string
  }

  const defaultValues: RegistrationFormData = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      birthMonth: '',
      birthDay: '',
      birthYear: '',
      email: '',
      phone: '',
    }),
    [],
  )

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues,
  })

  const draftStorageKey = useMemo(
    () => `event-registration-draft-${eventId}`,
    [eventId],
  )

  useEffect(() => {
    const draft = localStorage.getItem(draftStorageKey)
    if (!draft) {
      return
    }
    try {
      const parsedDraft = JSON.parse(draft) as RegistrationFormData
      reset(parsedDraft)
    } catch {
      localStorage.removeItem(draftStorageKey)
    }
  }, [draftStorageKey, reset])

  useEffect(() => {
    const authUser = getAuth().currentUser
    const fullName = currentUser?.name.trim() || authUser?.displayName?.trim() || ''
    const [firstName = '', ...lastNameParts] = fullName.length > 0 ? fullName.split(/\s+/) : []
    const lastName = lastNameParts.join(' ')
    const email = authUser?.email?.trim() || ''
    const phone = authUser?.phoneNumber?.trim() || ''

    const currentValues = getValues()
    const hydratedValues: RegistrationFormData = {
      ...currentValues,
      firstName: currentValues.firstName || firstName,
      lastName: currentValues.lastName || lastName,
      email: currentValues.email || email,
      phone: currentValues.phone || phone,
    }

    reset(hydratedValues, { keepDirty: true })
  }, [currentUser, getValues, reset])

  const onSubmit: SubmitHandler<RegistrationFormData> = async () => {
    try {
      setError(null)
      if (!currentUser?.userId) {
        setError('Please sign in to register for this event.')
        return
      }
      const payload: EventRegistrationPostData = {
        volunteerId: currentUser.userId,
      }
      await registerEvent.mutateAsync(payload)
      setIsSubmitted(true)
      localStorage.removeItem(draftStorageKey)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const handleBackToDetails = () => {
    navigate({
      to: '/events/$eventId/view',
      params: { eventId: eventId! },
    })
  }

  const handleCloseAttempt = () => {
    if (isDirty && !isSubmitted) {
      setShowExitDialog(true)
      return
    }
    handleBackToDetails()
  }

  const handleSaveDraft = () => {
    const currentValues = getValues()
    localStorage.setItem(draftStorageKey, JSON.stringify(currentValues))
    reset(currentValues)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !event) {
    return <ErrorAlert />
  }

  if (isSubmitted) {
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
            onClick={handleBackToDetails}
          >
            Back to Event Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative px-10 py-14">
      <Button
        type="button"
        variant="ghost"
        className="absolute right-10 top-12 text-muted-foreground hover:text-foreground"
        onClick={handleCloseAttempt}
      >
        <X className="h-8 w-8" />
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[1200px] space-y-8">
        <h1 className="inline-block rounded-[6px] bg-[#FFE74C] px-2 py-1 text-5xl font-semibold">
          {event.name}
        </h1>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-base text-[#545F71]">
              First name
            </Label>
            <Input
              id="first-name"
              className="h-12"
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && <ErrorAlert message={errors.firstName.message} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-base text-[#545F71]">
              Last name
            </Label>
            <Input
              id="last-name"
              className="h-12"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && <ErrorAlert message={errors.lastName.message} />}
          </div>

          <div className="col-span-2 space-y-2">
            <Label className="text-base text-[#545F71]">Date of birth</Label>
            <div className="grid grid-cols-3 gap-4">
              <select
                className="h-12 rounded-md border border-input bg-background px-3 text-sm"
                {...register('birthMonth', { required: 'Month is required' })}
              >
                <option value="">Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <Input
                placeholder="Day"
                className="h-12"
                {...register('birthDay', {
                  required: 'Day is required',
                  pattern: { value: /^(0?[1-9]|[12][0-9]|3[01])$/, message: 'Enter a valid day' },
                })}
              />
              <Input
                placeholder="Year"
                className="h-12"
                {...register('birthYear', {
                  required: 'Year is required',
                  pattern: { value: /^\d{4}$/, message: 'Enter a 4-digit year' },
                })}
              />
            </div>
            {(errors.birthMonth || errors.birthDay || errors.birthYear) && (
              <ErrorAlert
                message={
                  errors.birthMonth?.message ??
                  errors.birthDay?.message ??
                  errors.birthYear?.message
                }
              />
            )}
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="email" className="text-base text-[#545F71]">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              className="h-12"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && <ErrorAlert message={errors.email.message} />}
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="phone" className="text-base text-[#545F71]">
              Phone number
            </Label>
            <Input
              id="phone"
              className="h-12"
              {...register('phone', { required: 'Phone number is required' })}
            />
            {errors.phone && <ErrorAlert message={errors.phone.message} />}
          </div>

        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex justify-end gap-[10px] pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-[42px] w-[154px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
            onClick={handleCloseAttempt}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-[42px] w-[154px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
            onClick={handleSaveDraft}
          >
            Save
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[42px] w-[154px] rounded-md bg-[#545F71] px-4 py-3 text-base font-semibold"
          >
            Submit
          </Button>
        </div>
      </form>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-[520px] rounded-xl border border-[#D1D5DB] bg-white">
          <DialogHeader className="text-center sm:text-center">
            <h2>Are you sure?</h2>
            <p>
              You still have unsaved changes. If you leave now, you may lose all
              your registration progress.
            </p>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-[10px]">
            <Button
              className="h-[42px] w-[120px] rounded-md bg-[#545F71] px-4 py-3 text-base font-semibold text-white"
              onClick={() => {
                setShowExitDialog(false)
                handleBackToDetails()
              }}
            >
              OK
            </Button>
            <Button
              variant="outline"
              className="h-[42px] w-[120px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
              onClick={() => setShowExitDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
