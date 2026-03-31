import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, CloudUpload, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { EventPostData, EventTrainerAssignment } from '@/types/events'
import type { Volunteer } from '@/types/volunteers'
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
import { useCreateEvent } from '@/operations/events'
import { useGetVolunteers } from '@/operations/volunteers'
import {
  getVolunteerTrainerId,
  isVolunteerSelected,
} from '@/utils/volunteerTrainer'

type EventCreateFormData = {
  name: string
  description: string
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  venue: string
  trainers: Array<{
    id: string
  }>
}

async function fileToDataUrl(file: File): Promise<string> {
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

export default function CreateEvent() {
  const navigate = useNavigate()
  const createEvent = useCreateEvent()
  const { data: volunteers } = useGetVolunteers()

  const [coverImage, setCoverImage] = useState<Array<File> | undefined>(
    undefined,
  )
  const [showVolunteerPicker, setShowVolunteerPicker] = useState(false)
  const [volunteerSearch, setVolunteerSearch] = useState('')
  const [selectedVolunteers, setSelectedVolunteers] = useState<
    Array<Volunteer>
  >([])

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    control,
  } = useForm<EventCreateFormData>({
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
    },
  })

  const errorMessages = Object.values(errors)
    .map((e: any) => e?.message)
    .filter((msg): msg is string => typeof msg === 'string')

  const [showExitDialog, setShowExitDialog] = useState(false)

  const filteredVolunteers = useMemo(() => {
    const volunteerList = volunteers ?? []
    const searchTerm = volunteerSearch.trim().toLowerCase()

    if (!searchTerm) {
      return volunteerList
    }

    return volunteerList.filter((volunteer) =>
      volunteer.name.toLowerCase().includes(searchTerm),
    )
  }, [volunteers, volunteerSearch])

  const addVolunteerCoordinator = (volunteer: Volunteer) => {
    const volunteerTrainerId = getVolunteerTrainerId(volunteer)
    if (!volunteerTrainerId) return

    setSelectedVolunteers((current) => {
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

  const removeVolunteerCoordinator = (trainerId: string) => {
    setSelectedVolunteers((current) =>
      current.filter((entry) => getVolunteerTrainerId(entry) !== trainerId),
    )
  }

  // TODO: Update Save & Publish button handler
  const onSubmit: SubmitHandler<EventCreateFormData> = async (data) => {
    try {
      const eventPayload: EventPostData = {
        name: data.name,
        description: data.description,
        startDate: combineDateAndTime(data.startDate, data.startTime),
        endDate: combineDateAndTime(data.endDate, data.endTime),
        venue: data.venue,
        postalCode: 0,
        coverImage: coverImage?.[0]
          ? await fileToDataUrl(coverImage[0])
          : undefined,
        trainers: selectedVolunteers
          .map((volunteer) => {
            const id = getVolunteerTrainerId(volunteer)
            return id ? { id, role: 'public' } : null
          })
          .filter((entry): entry is EventTrainerAssignment => entry !== null),
      }

      await createEvent.mutateAsync(eventPayload)
      navigate({ to: '/events/create-success' })
    } catch (err) {
      console.error(err)
      // handle error, maybe setError state
    }
  }

  return (
    <div className="mx-auto flex w-screen max-w-[1662px] flex-col gap-6 px-10 py-14">
      {/* Header row */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" className="size-10" 
            onClick={() => {
              if (isDirty) {
                setShowExitDialog(true)
              } else {
                navigate({ to: '/events' })
              }
            }}>
              <ChevronLeft className="size-8" />
            </Button>

          <div className="flex flex-col gap-2">
            <h1>
              Create New Event
            </h1>
            <p className="text-xl leading-7 text-muted-foreground">
              Ensure all details are filled
            </p>
          </div>
        </div>

        <div className="flex gap-[10px] pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-8 rounded-md !border-slate-600 text-base font-semibold text-slate-600"
            onClick={() => {
              if (isDirty) {
                setShowExitDialog(true)
              } else {
                navigate({ to: '/events' })
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-event-form"
            className="h-10 px-8 rounded-md bg-slate-600 text-base font-semibold"
          >
            Save &amp; Publish
          </Button>
        </div>
      </div>

      <form
        id="create-event-form"
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

        {/* Event Details Section */}
        <Card className="rounded-xl border border-slate-300 p-0 gap-0">
          {/* green section header */}
          <div className="h-16 rounded-t-xl bg-[rgba(101,163,13,0.43)] px-8 flex items-center">
            <h3>
              Event Details
            </h3>
          </div>

          <CardContent className="px-8 py-6">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              {/* Event Name */}
              <div className="col-span-2 space-y-2">
                <Label
                  htmlFor="eventName"
                  className="text-sm text-slate-600"
                >
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

              {/* Location */}
              <div className="col-span-2 space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm text-slate-600"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  {...register('venue', { required: 'Location is required' })}
                  className="h-12 rounded-md border-slate-500"
                />
              </div>

              {/* Start Date & Time */}
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm text-slate-600"
                >
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

              {/* End Date & Time */}
              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-sm text-slate-600"
                >
                  End Date &amp; Time
                </Label>
                <div className="grid grid-cols-[1fr_140px] gap-3">
                  <Controller
                    {...register('endDate', { required: 'End date is required' })}
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
                    })}
                    className="h-12 rounded-md border-slate-500"
                  />
                </div>
              </div>

              {/* Event Description */}
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

              {/* Upload Cover Image */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-600">
                  Upload Cover Image
                </Label>
                <Dropzone
                  accept={{ 'image/*': [] }}
                  maxFiles={1}
                  src={coverImage}
                  onDrop={(acceptedFiles) =>
                    setCoverImage(acceptedFiles.length ? acceptedFiles : undefined)
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
                      {coverImage?.[0]?.name ?? 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-white/70">Click to replace</p>
                  </DropzoneContent>
                </Dropzone>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Coordinators Section */}
        <Card className="gap-0 rounded-xl border border-slate-300 p-0">
          <div className="flex h-16 items-center justify-between rounded-t-xl bg-[rgba(101,163,13,0.43)] px-8">
            <h3>
              Volunteer Coordinators
            </h3>
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
                  No volunteer coordinators selected yet.
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
                        removeVolunteerCoordinator(getVolunteerTrainerId(volunteer))
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

      <Dialog open={showVolunteerPicker} onOpenChange={setShowVolunteerPicker}>
        <DialogContent className="max-w-2xl border-slate-300">
          <DialogHeader className="text-left">
            <h2>Select Volunteer Coordinators</h2>
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
                    onClick={() => addVolunteerCoordinator(volunteer)}
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

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="bg-[#BDD797] border-slate-600">
          <DialogHeader className="text-center sm:text-center">
            <h2>Are you sure?</h2>
            <p>
              You have unsaved changes. Are you sure you want to leave?
            </p>
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
