import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, CloudUpload, Trash2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { EventPutData } from '@/types/events'
import type { Volunteer } from '@/types/volunteers'
import {
  getVolunteerTrainerId,
  isVolunteerSelected,
} from '@/utils/volunteerTrainer'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/dropzone'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui_custom/DatePicker'
import { useDeleteEvent, useEditEvent, useGetEvent } from '@/operations/events'
import { useGetVolunteers } from '@/operations/volunteers'
import LoadingSkeleton from '@/pages/LoadingSkeleton'

type EventEditFormData = {
  name: string
  description: string
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  venue: string
  trainers: Array<{ id: string }>
  volunteers: Array<string>
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read cover image'))
    reader.readAsDataURL(file)
  })
}

function combineDateAndTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setHours(hours || 0, minutes || 0, 0, 0)
  return combined.toISOString()
}

function toTimeValue(date: Date): string {
  return format(date, 'HH:mm')
}

function extractStaffIds(eventData: any): Array<string> {
  const raw =
    eventData?.trainers ??
    eventData?.volunteer_coordinators ??
    eventData?.volunteerCoordinators ??
    []
  if (!Array.isArray(raw)) return []
  if (typeof raw[0] === 'string') return raw
  return raw
    .map((x) => x?.volunteerId ?? x?.volunteer_id ?? x?.id ?? x?.trainer)
    .filter((v): v is string => typeof v === 'string')
}

function extractVolunteerIds(eventData: any): Array<string> {
  const raw = eventData?.volunteers ?? []
  if (!Array.isArray(raw)) return []
  if (typeof raw[0] === 'string') return raw
  return raw
    .map((x) => x?.volunteerId ?? x?.volunteer_id ?? x?.id)
    .filter((v): v is string => typeof v === 'string')
}

export default function EditEvent() {
  const navigate = useNavigate()
  const { eventId } = useParams({ strict: false })
  const eventIdNum = Number(eventId!)

  const editEvent = useEditEvent(eventIdNum)
  const deleteEvent = useDeleteEvent(eventIdNum)
  const { data: eventData, isLoading } = useGetEvent(eventIdNum)
  const { data: volunteers } = useGetVolunteers()

  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [coverImage, setCoverImage] = useState<Array<File> | undefined>(
    undefined,
  )
  const [existingCoverImage, setExistingCoverImage] = useState<
    string | undefined
  >(undefined)

  const [showStaffPicker, setShowStaffPicker] = useState(false)
  const [showVolunteerPicker, setShowVolunteerPicker] = useState(false)
  const [staffSearch, setStaffSearch] = useState('')
  const [volunteerSearch, setVolunteerSearch] = useState('')
  const [selectedStaffIC, setSelectedStaffIC] = useState<Array<Volunteer>>([])
  const [selectedVolunteers, setSelectedVolunteers] = useState<
    Array<Volunteer>
  >([])

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isDirty, errors },
  } = useForm<EventEditFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      venue: '',
      startDate: new Date(),
      startTime: '09:00',
      endDate: new Date(),
      endTime: '17:00',
      description: '',
      trainers: [],
      volunteers: [],
    },
  })

  const startDate = watch('startDate')
  const startTime = watch('startTime')

  const errorMessages = Object.values(errors)
    .map((e: any) => e?.message)
    .filter((msg): msg is string => typeof msg === 'string')

  const filteredStaff = useMemo(() => {
    const list = volunteers ?? []
    const searchTerm = staffSearch.trim().toLowerCase()
    if (!searchTerm) return list
    return list.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm),
    )
  }, [volunteers, staffSearch])

  const filteredVolunteers = useMemo(() => {
    const list = volunteers ?? []
    const searchTerm = volunteerSearch.trim().toLowerCase()
    if (!searchTerm) return list
    return list.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm),
    )
  }, [volunteers, volunteerSearch])

  const addStaffIC = (volunteer: Volunteer) => {
    const volunteerTrainerId = getVolunteerTrainerId(volunteer)
    if (!volunteerTrainerId) return

    setSelectedStaffIC((current) => {
      if (
        current.some(
          (entry) => getVolunteerTrainerId(entry) === volunteerTrainerId,
        )
      ) {
        return current
      }
      return [...current, volunteer]
    })
  }

  const removeStaffIC = (trainerId: string) => {
    setSelectedStaffIC((current) =>
      current.filter((entry) => getVolunteerTrainerId(entry) !== trainerId),
    )
  }

  const addVolunteer = (volunteer: Volunteer) => {
    const volunteerId = getVolunteerTrainerId(volunteer)
    if (!volunteerId) return

    setSelectedVolunteers((current) => {
      if (
        current.some((entry) => getVolunteerTrainerId(entry) === volunteerId)
      ) {
        return current
      }
      return [...current, volunteer]
    })
  }

  const removeVolunteer = (volunteerId: string) => {
    setSelectedVolunteers((current) =>
      current.filter((entry) => getVolunteerTrainerId(entry) !== volunteerId),
    )
  }

  useEffect(() => {
    if (!eventData) return

    const start = new Date(eventData.startDate)
    const end = new Date(eventData.endDate)
    const eventDataWithVenue = eventData as {
      venue?: string
      coverImage?: string
    }
    const venueValue = eventDataWithVenue.venue || eventData.location

    reset({
      name: eventData.name,
      venue: venueValue,
      startDate: start,
      startTime: toTimeValue(start),
      endDate: end,
      endTime: toTimeValue(end),
      description: eventData.description,
      trainers: [],
      volunteers: [],
    })

    setExistingCoverImage(eventDataWithVenue.coverImage)
  }, [eventData, reset])

  useEffect(() => {
    if (!eventData || !volunteers) return
    const staffIds = extractStaffIds(eventData)
    setSelectedStaffIC(
      volunteers.filter((v) => staffIds.includes(getVolunteerTrainerId(v))),
    )
  }, [eventData, volunteers])

  useEffect(() => {
    if (!eventData || !volunteers) return
    const volunteerIds = extractVolunteerIds(eventData)
    setSelectedVolunteers(
      volunteers.filter((v) => volunteerIds.includes(getVolunteerTrainerId(v))),
    )
  }, [eventData, volunteers])

  const onSubmit: SubmitHandler<EventEditFormData> = async (data) => {
    try {
      const payload: EventPutData = {
        name: data.name,
        description: data.description,
        startDate: combineDateAndTime(data.startDate, data.startTime),
        endDate: combineDateAndTime(data.endDate, data.endTime),
        venue: data.venue,
        postalCode: 0,
        coverImage: coverImage?.[0]
          ? await fileToDataUrl(coverImage[0])
          : existingCoverImage,
        trainers: selectedStaffIC
          .map((volunteer) => getVolunteerTrainerId(volunteer))
          .filter((id): id is string => id.length > 0),
        volunteers: selectedVolunteers
          .map((volunteer) => getVolunteerTrainerId(volunteer))
          .filter((id): id is string => id.length > 0),
      }

      await editEvent.mutateAsync(payload)
      navigate({ to: '/events/edit-success' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent.mutateAsync()
      navigate({ to: '/events' })
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="mx-auto flex w-screen max-w-[1662px] flex-col gap-6 px-10 py-14">
      {/* Header row */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-10"
            onClick={() => {
              if (isDirty) setShowExitDialog(true)
              else navigate({ to: '/events' })
            }}
          >
            <ChevronLeft className="size-8" />
          </Button>

          <div className="flex flex-col gap-2">
            <h1>Edit Event Details</h1>
            <p className="text-xl leading-7 text-muted-foreground">
              Ensure all details are filled
            </p>
          </div>
        </div>

        <div className="flex gap-[10px] pt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 rounded-md !border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
            disabled={deleteEvent.isPending}
            aria-label="Delete event"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="size-5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 px-8 rounded-md !border-slate-600 text-base font-semibold text-slate-600"
            onClick={() => {
              if (isDirty) setShowExitDialog(true)
              else navigate({ to: '/events' })
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-event-form"
            className="h-10 px-8 rounded-md bg-slate-600 text-base font-semibold"
          >
            Save &amp; Publish
          </Button>
        </div>
      </div>

      <form
        id="edit-event-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 ml-[56px] space-y-6"
      >
        {errorMessages.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Please resolve the following errors:</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {errorMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="rounded-xl border border-slate-300 p-0 gap-0">
          <div className="h-16 rounded-t-xl bg-[rgba(101,163,13,0.43)] px-8 flex items-center">
            <h3>Event Details</h3>
          </div>

          <CardContent className="px-8 py-6">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="eventName" className="text-sm text-slate-600">
                  Event Name
                </Label>
                <Input
                  id="eventName"
                  {...register('name', {
                    required: 'Event name is required',
                  })}
                  className="h-12 rounded-md border-slate-500"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="location" className="text-sm text-slate-600">
                  Location
                </Label>
                <Input
                  id="location"
                  {...register('venue', { required: 'Location is required' })}
                  className="h-12 rounded-md border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm text-slate-600">
                  Start Date &amp; Time
                </Label>
                <div className="grid grid-cols-[1fr_140px] gap-3">
                  <Controller
                    {...register('startDate', {
                      required: 'Start date is required',
                    })}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="startDate"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime', {
                      required: 'Start time is required',
                    })}
                    className="h-12 rounded-md border-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm text-slate-600">
                  End Date &amp; Time
                </Label>
                <div className="grid grid-cols-[1fr_140px] gap-3">
                  <Controller
                    {...register('endDate', {
                      required: 'End date is required',
                      validate: (val) => {
                        const startDay = new Date(startDate)
                        startDay.setHours(0, 0, 0, 0)
                        const endDay = new Date(val)
                        endDay.setHours(0, 0, 0, 0)
                        return (
                          endDay >= startDay ||
                          'End date must be on or after start date'
                        )
                      },
                    })}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="endDate"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime', {
                      required: 'End time is required',
                      validate: (val) => {
                        const start = combineDateAndTime(startDate, startTime)
                        const end = combineDateAndTime(watch('endDate'), val)
                        return (
                          new Date(end) >= new Date(start) ||
                          'End date/time must be after start date/time'
                        )
                      },
                    })}
                    className="h-12 rounded-md border-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="eventDescription"
                  className="text-sm text-slate-600"
                >
                  Event Description
                </Label>
                <Textarea
                  id="eventDescription"
                  {...register('description', {
                    required: 'Description is required',
                  })}
                  className="h-40 resize-none rounded-md border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-600">
                  Upload Cover Image
                </Label>
                <Dropzone
                  accept={{ 'image/*': [] }}
                  maxFiles={1}
                  src={coverImage}
                  onDrop={(acceptedFiles) =>
                    setCoverImage(
                      acceptedFiles.length ? acceptedFiles : undefined,
                    )
                  }
                  className="h-40 rounded-md border-[3px] border-transparent !bg-[#969696]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23BFBFBF' stroke-width='3' stroke-dasharray='16%2c 16' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                  }}
                >
                  <DropzoneEmptyState className="gap-2">
                    <CloudUpload className="size-10 text-white/80" />
                    <p className="text-sm leading-6 text-slate-50">
                      Click to upload or drag and drop
                    </p>
                  </DropzoneEmptyState>
                  <DropzoneContent className="gap-2">
                    <CloudUpload className="size-10 text-white/80" />
                    <p className="truncate text-sm leading-6 text-slate-50">
                      {coverImage?.[0]?.name ??
                        'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-white/70">Click to replace</p>
                  </DropzoneContent>
                </Dropzone>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border border-slate-300 p-0">
          <div className="flex h-16 items-center justify-between rounded-t-xl bg-[rgba(101,163,13,0.43)] px-8">
            <h3>Staff IC</h3>
            <Button
              type="button"
              className="h-9 w-auto rounded-md bg-[#5f733c] px-4 py-3 text-base font-semibold hover:bg-[#4d5e30]"
              onClick={() => setShowStaffPicker(true)}
            >
              + Add Volunteer
            </Button>
          </div>

          <CardContent className="px-8 py-6">
            <div className="flex flex-col gap-6">
              {selectedStaffIC.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No Staff IC selected yet.
                </p>
              ) : (
                selectedStaffIC.map((volunteer) => (
                  <div
                    key={getVolunteerTrainerId(volunteer) || volunteer.name}
                    className="flex items-center justify-between rounded-md border border-slate-300 px-4 py-3"
                  >
                    <p className="text-base text-slate-700">{volunteer.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-10 text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        removeStaffIC(getVolunteerTrainerId(volunteer))
                      }
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-xl border border-slate-300 p-0">
          <div className="flex h-16 items-center justify-between rounded-t-xl bg-[rgba(101,163,13,0.43)] px-8">
            <h3>Volunteers</h3>
            <Button
              type="button"
              className="h-9 w-auto rounded-md bg-[#5f733c] px-4 py-3 text-base font-semibold hover:bg-[#4d5e30]"
              onClick={() => setShowVolunteerPicker(true)}
            >
              + Add Volunteer
            </Button>
          </div>

          <CardContent className="px-8 py-6">
            <div className="flex flex-col gap-6">
              {selectedVolunteers.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No volunteers selected yet.
                </p>
              ) : (
                selectedVolunteers.map((volunteer) => (
                  <div
                    key={getVolunteerTrainerId(volunteer) || volunteer.name}
                    className="flex items-center justify-between rounded-md border border-slate-300 px-4 py-3"
                  >
                    <p className="text-base text-slate-700">{volunteer.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-10 text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        removeVolunteer(getVolunteerTrainerId(volunteer))
                      }
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </form>

      <Dialog open={showStaffPicker} onOpenChange={setShowStaffPicker}>
        <DialogContent className="max-w-2xl border-slate-300">
          <DialogHeader className="text-left">
            <h2>Select Staff IC</h2>
            <p>Search by name and click a volunteer to add.</p>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search volunteers"
              value={staffSearch}
              onChange={(event) => setStaffSearch(event.target.value)}
            />

            <div className="max-h-80 overflow-y-auto rounded-md border border-slate-300">
              {filteredStaff.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">
                  No volunteers found.
                </p>
              ) : (
                filteredStaff.map((volunteer) => (
                  <button
                    key={getVolunteerTrainerId(volunteer) || volunteer.name}
                    type="button"
                    className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                    onClick={() => addStaffIC(volunteer)}
                  >
                    <span>{volunteer.name}</span>
                    {isVolunteerSelected(volunteer, selectedStaffIC) && (
                      <span className="text-xs font-semibold text-slate-500">
                        Added
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setShowStaffPicker(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVolunteerPicker} onOpenChange={setShowVolunteerPicker}>
        <DialogContent className="max-w-2xl border-slate-300">
          <DialogHeader className="text-left">
            <h2>Select Volunteers</h2>
            <p>Search by name and click a volunteer to add.</p>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search volunteers"
              value={volunteerSearch}
              onChange={(event) => setVolunteerSearch(event.target.value)}
            />

            <div className="max-h-80 overflow-y-auto rounded-md border border-slate-300">
              {filteredVolunteers.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">
                  No volunteers found.
                </p>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <button
                    key={getVolunteerTrainerId(volunteer) || volunteer.name}
                    type="button"
                    className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                    onClick={() => addVolunteer(volunteer)}
                  >
                    <span>{volunteer.name}</span>
                    {isVolunteerSelected(volunteer, selectedVolunteers) && (
                      <span className="text-xs font-semibold text-slate-500">
                        Added
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setShowVolunteerPicker(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-red-200 bg-white">
          <DialogHeader className="text-center sm:text-center">
            <h2>Delete event?</h2>
            <p>
              This will remove the event and all associated trainers,
              participants, and venue data if unused.
            </p>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-[10px]">
            <Button
              variant="outline"
              className="h-10 w-34 rounded-md border border-slate-500 bg-transparent text-base font-semibold text-slate-600 hover:bg-slate-100"
              disabled={deleteEvent.isPending}
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-10 w-34 rounded-md bg-red-600 text-base font-semibold text-white hover:bg-red-700"
              disabled={deleteEvent.isPending}
              onClick={handleDeleteEvent}
            >
              {deleteEvent.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="bg-[#BDD797] border-slate-600">
          <DialogHeader className="text-center sm:text-center">
            <h2>Are you sure?</h2>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-[10px]">
            <Button
              className="h-10 w-34 rounded-md bg-[#5f733c] text-base font-semibold text-white hover:bg-[#4d5e30]"
              onClick={() => setShowExitDialog(false)}
            >
              Stay
            </Button>
            <Button
              variant="outline"
              className="h-10 w-34 rounded-md border border-[#5f733c] bg-transparent text-base font-semibold text-[#5f733c] hover:bg-[#5f733c]/10"
              onClick={() => {
                setShowExitDialog(false)
                navigate({ to: '/events' })
              }}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
