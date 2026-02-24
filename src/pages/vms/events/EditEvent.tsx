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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui_custom/DatePicker'
import { useEditEvent, useGetEvent } from '@/operations/events'
import LoadingSkeleton from '@/pages/LoadingSkeleton'
import type { EventPostData, EventPutData } from '@/types/events'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, CloudUpload, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form'

const EVENT_STATUSES = [
  { label: 'Active', value: 'Active', color: 'bg-green-500' },
  { label: 'Inactive', value: 'Inactive', color: 'bg-red-500' },
]

export default function EditEvent() {
  const navigate = useNavigate()
  const { eventId } = useParams({ strict: false })
  const editEvent = useEditEvent(Number(eventId!))
  const { data: eventData, isLoading } = useGetEvent(Number(eventId!))

  const [showExitDialog, setShowExitDialog] = useState(false)
  const [coverImage, setCoverImage] = useState<Array<File> | undefined>(
    undefined,
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
    control,
  } = useForm<EventPostData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      venue: '',
      startDate: new Date(),
      endDate: new Date(),
      description: '',
      trainers: [{ name: '', role: '' }],
    },
  })

  // Field Array Coordinators
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trainers',
  })

  const errorMessages = Object.values(errors)
    .map((e: any) => e?.message)
    .filter((msg): msg is string => typeof msg === 'string')

  
  useEffect(() => {
    if (eventData) {
      reset({
        name: eventData.name,
        venue: eventData.location,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        description: eventData.description,
        trainers: eventData.coordinators.length > 0 
          ? eventData.coordinators 
          : [{ name: '', role: '' }],
      })
    }
  }, [eventData, reset])

  
  const onSubmit: SubmitHandler<EventPutData> = async (data) => {
    try {
      await editEvent.mutateAsync(data)
      navigate({ to: '/events/edit-success' })
    } catch (err) {
      console.error(err)
      // handle error
    }
  }

  if (isLoading) {
      return <LoadingSkeleton />
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
              Edit Event Details
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

              {/* Start Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm text-slate-600"
                >
                  Start Date
                </Label>
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
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-sm text-slate-600"
                >
                  End Date
                </Label>
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
              </div>

              {/* Project Description */}
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
              onClick={() => append({ name: '', role: '' })}
            >
              + Add Volunteer
            </Button>
          </div>

          <CardContent className="px-8 py-6">
            <div className="flex flex-col gap-6">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-x-10">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`trainers.${index}.name`}
                      className="text-sm text-slate-600"
                    >
                      Name of Volunteer Coordinator
                    </Label>
                    <Input
                      id={`trainers.${index}.name`}
                      {...register(`trainers.${index}.name` as const)}
                      className="h-12 rounded-md border-slate-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="w-full space-y-2">
                      <Label
                        htmlFor={`trainers.${index}.role`}
                        className="text-sm text-slate-600"
                      >
                        Role
                      </Label>
                      <Input
                        id={`trainers.${index}.role`}
                        {...register(`trainers.${index}.role` as const)}
                        className="h-12 rounded-md border-slate-500"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mb-1 size-10 text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </form>

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
