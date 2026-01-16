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
import { useCreateEvent } from '@/operations/events'
import type { EventPostData } from '@/types/events'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, ChevronLeft, CloudUpload, Trash2 } from 'lucide-react'
import { useState } from 'react'
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

export default function CreateEvent() {
  const navigate = useNavigate()
  const createEvent = useCreateEvent()

  const [coverImage, setCoverImage] = useState<Array<File> | undefined>(
    undefined,
  )

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    control,
  } = useForm<EventPostData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      eventName: '',
      eventStatus: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      eventDescription: '',
      coordinators: [{ name: '', role: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'coordinators',
  })

  const errorMessages = Object.values(errors)
    .map((e: any) => e?.message)
    .filter((msg): msg is string => typeof msg === 'string')

  const [showExitDialog, setShowExitDialog] = useState(false)

  // TODO: Update Save & Publish button handler
  const onSubmit: SubmitHandler<EventPostData> = async (data) => {
    try {
      await createEvent.mutateAsync(data)
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
            className="h-[42px] w-[136px] rounded-[6px] !border-[#545f71] text-[16px] font-semibold text-[#475569]"
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
            className="h-[42px] w-[138px] rounded-[6px] bg-[#545f71] text-[16px] font-semibold"
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
        <Card className="rounded-[10px] border border-[#bfbfbf] p-0 gap-0">
          {/* green section header */}
          <div className="h-[61px] rounded-t-[10px] bg-[rgba(101,163,13,0.43)] px-8 flex items-center">
            <h3 className="leading-[32px] tracking-[-0.144px]">
              Event Details
            </h3>
          </div>

          <CardContent className="px-8 py-6">
            <div className="grid grid-cols-2 gap-x-[40px] gap-y-[20px]">
              {/* Event Name */}
              <div className="col-span-2 space-y-2">
                <Label
                  htmlFor="eventName"
                  className="text-[14px] leading-[19px] text-[#545f71]"
                >
                  Event Name
                </Label>
                <Input
                  id="eventName"
                  {...register('eventName', {
                    required: 'Project name is required',
                  })}
                  className="h-[48px] rounded-[6px] border-[#545f71]"
                />
              </div>

              {/* Event Status */}
              <div className="space-y-2">
                <Label
                  htmlFor="eventStatus"
                  className="text-[14px] leading-[19px] text-[#545f71]"
                >
                  Event Status
                </Label>
                <Controller
                  control={control}
                  name="eventStatus"
                  rules={{ required: 'Event status is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="items-center !h-[48px] !w-full rounded-[6px] border-[#545f71] text-base md:text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_STATUSES.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                            className="h-[48px] text-md"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-2 rounded-full ${status.color}`}
                              />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-[14px] leading-[19px] text-[#545f71]"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  {...register('location', { required: 'Location is required' })}
                  className="h-[48px] rounded-[6px] border-[#545f71]"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-[14px] leading-[19px] text-[#545f71]"
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
                  className="text-[14px] leading-[19px] text-[#545f71]"
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
                  className="text-[14px] leading-[19px] text-[#545f71]"
                >
                  Event Description
                </Label>
                <Textarea
                  id="eventDescription"
                  {...register('eventDescription', {
                    required: 'Description is required',
                  })}
                  className="h-[160px] resize-none rounded-[6px] border-[#545f71]"
                />
              </div>

              {/* Upload Cover Image */}
              <div className="space-y-2">
                <Label className="text-[14px] leading-[19px] text-[#545f71]">
                  Upload Cover Image
                </Label>
                <Dropzone
                  accept={{ 'image/*': [] }}
                  maxFiles={1}
                  src={coverImage}
                  onDrop={(acceptedFiles) =>
                    setCoverImage(acceptedFiles.length ? acceptedFiles : undefined)
                  }
                  className="h-[160px] rounded-[6px] border-[3px] border-transparent !bg-[#969696]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23BFBFBF' stroke-width='3' stroke-dasharray='16%2c 16' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                  }}
                >
                  <DropzoneEmptyState className="gap-2">
                    <CloudUpload className="size-10 text-white/80" />
                    <p className="text-[14px] leading-[24px] text-[#f4f4f4]">
                      Click to upload or drag and drop
                    </p>
                  </DropzoneEmptyState>
                  <DropzoneContent className="gap-2">
                    <CloudUpload className="size-10 text-white/80" />
                    <p className="truncate text-[14px] leading-[24px] text-[#f4f4f4]">
                      {coverImage?.[0]?.name ?? 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-[12px] text-white/70">Click to replace</p>
                  </DropzoneContent>
                </Dropzone>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Coordinators Section */}
        <Card className="gap-0 rounded-[10px] border border-[#bfbfbf] p-0">
          <div className="flex h-[61px] items-center justify-between rounded-t-[10px] bg-[rgba(101,163,13,0.43)] px-8">
            <h3 className="leading-[32px] tracking-[-0.144px]">
              Volunteer Coordinators
            </h3>
            <Button
              type="button"
              className="h-[34px] w-[163px] rounded-[6px] bg-[#5f733c] px-4 py-3 text-[16px] font-semibold hover:bg-[#4d5e30]"
              onClick={() => append({ name: '', role: '' })}
            >
              + Add Volunteer
            </Button>
          </div>

          <CardContent className="px-8 py-6">
            <div className="flex flex-col gap-6">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-x-[40px]">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`coordinators.${index}.name`}
                      className="text-[14px] leading-[19px] text-[#545f71]"
                    >
                      Name of Volunteer Coordinator
                    </Label>
                    <Input
                      id={`coordinators.${index}.name`}
                      {...register(`coordinators.${index}.name` as const)}
                      className="h-[48px] rounded-[6px] border-[#545f71]"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="w-full space-y-2">
                      <Label
                        htmlFor={`coordinators.${index}.role`}
                        className="text-[14px] leading-[19px] text-[#545f71]"
                      >
                        Role
                      </Label>
                      <Input
                        id={`coordinators.${index}.role`}
                        {...register(`coordinators.${index}.role` as const)}
                        className="h-[48px] rounded-[6px] border-[#545f71]"
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
        <DialogContent className="bg-[#BDD797] border-[#545f71]">
          <DialogHeader className="text-center sm:text-center">
            <h2>Are you sure?</h2>
            <p>
              You have unsaved changes. Are you sure you want to leave?
            </p>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-[10px]">
            <Button
              className="h-[42px] w-[136px] rounded-[6px] bg-[#5f733c] text-[16px] font-semibold text-white hover:bg-[#4d5e30]"
              onClick={() => setShowExitDialog(false)}
            >
              Stay
            </Button>
            <Button
              variant="outline"
              className="h-[42px] w-[136px] rounded-[6px] border border-[#5f733c] bg-transparent text-[16px] font-semibold text-[#5f733c] hover:bg-[#5f733c]/10"
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
