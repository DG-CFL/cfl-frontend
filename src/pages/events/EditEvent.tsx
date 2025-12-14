import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/dropzone'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui_custom/DatePicker'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { useEditEvent, useGetEvent } from '@/operations/events'
import type { Event, EventPutData } from '@/types/events'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ChevronLeft, Upload } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

type EventEditFormData = EventPutData

/**
 * Initializes form data default values to the current values of the event
 */
const initializeEventEditFormData = (eventData: Event): EventEditFormData => {
  return {
    name: eventData.name,
    description: eventData.description,
    startDate: new Date(eventData.startDate),
    endDate: new Date(eventData.endDate),
    venue: eventData.location.split(',')[0] || '',
    postalCode: eventData.location.split(',').pop()?.trim() || '',
    coverImage: undefined,
  }
}

export default function EditEvent() {
  const { eventId } = useParams({ strict: false })
  const navigate = useNavigate()

  const { data } = useGetEvent(Number(eventId!))
  const editEvent = useEditEvent(Number(eventId!))

  const [coverImage, setCoverImage] = useState<Array<File> | undefined>(
    undefined,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EventEditFormData>({
    defaultValues: data && initializeEventEditFormData(data),
  })

  const [error, setError] = useState<string | null>(null)

  const onSubmit: SubmitHandler<EventEditFormData> = async (data) => {
    try {
      await editEvent.mutateAsync(data)
      navigate({ to: '/events/edit-success' })
    } catch (err) {
      console.log(error)
      setError(error)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1662px] flex-col gap-6 px-10 py-14">
      {/* Header with Back Button */}
      <div className="flex items-start gap-4">
        <Link to="/events/$eventId/view" params={{ eventId: eventId! }}>
          <Button variant="ghost" size="icon" className="size-10">
            <ChevronLeft className="size-8" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h1>Edit Event</h1>
          <p className="text-xl leading-7 text-muted-foreground">
            Fill in the details below to edit a volunteer project
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className=" w-[1568px] gap-0 rounded-[10px] border border-muted-foreground/30">
          <CardContent className="flex flex-col items-center space-y-4 px-8 py-8">
            {/* Upload Cover Image */}
            <div className="space-y-2">
              <Label className="text-base text-[#545F71]">
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
                className="h-[222px] w-[1254px] gap-3 rounded-lg border border-input bg-[#99999a] shadow-md transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 hover:border-ring/50"
              >
                <DropzoneEmptyState className="gap-3">
                  <Upload className="size-12 text-[#545F71]" />
                  <p className="text-base text-[#545F71]">
                    Drag & Drop Files Here
                  </p>
                </DropzoneEmptyState>
                <DropzoneContent className="gap-3">
                  <Upload className="size-12 text-[#545F71]" />
                  <p className="w-full truncate text-base text-[#545F71]">
                    {coverImage?.[0]?.name ?? 'Drag & Drop Files Here'}
                  </p>
                  <p className="text-sm text-[#545F71]">Click to replace</p>
                </DropzoneContent>
              </Dropzone>
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <Label
                htmlFor="project-name"
                className="text-base text-[#545F71]"
              >
                Project Name
              </Label>
              <Input
                id="project-name"
                {...register('name', { required: 'Project name is required' })}
                className="h-12 w-[1254px]"
              />
              {errors.name && <ErrorAlert message={errors.name.message} />}
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label
                htmlFor="project-description"
                className="text-base text-[#545F71]"
              >
                Project Description
              </Label>
              <Textarea
                id="project-description"
                {...register('description', {
                  required: 'Description is required',
                })}
                className="h-[114px] w-[1254px] resize-none"
              />
              {errors.description && (
                <ErrorAlert message={errors.description.message} />
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="flex w-[1254px] gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Controller
                  {...register('startDate', {
                    required: 'Start date is required',
                  })}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="start-date"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.startDate && (
                  <ErrorAlert message={errors.startDate.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Controller
                  {...register('endDate', { required: 'End date is required' })}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="end-date"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.endDate && (
                  <ErrorAlert message={errors.endDate.message} />
                )}
              </div>
            </div>

            {/* Venue & Postal Code */}
            <div className="flex w-[1254px] gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="venue" className="text-base text-[#545F71]">
                  Venue
                </Label>
                <Input
                  id="venue"
                  {...register('venue', { required: 'Venue is required' })}
                  className="h-12 rounded-md border border-muted-foreground/30 p-3"
                />
                {errors.venue && <ErrorAlert message={errors.venue.message} />}
              </div>

              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="postal-code"
                  className="text-base text-[#545F71]"
                >
                  Postal Code
                </Label>
                <Input
                  id="postal-code"
                  {...register('postalCode', {
                    required: 'Postal code is required',
                  })}
                  className="h-12 rounded-md border border-muted-foreground/30 p-3"
                />
                {errors.postalCode && (
                  <ErrorAlert message={errors.postalCode.message} />
                )}
              </div>
            </div>

            {/* Server errors (if any) */}
            {error && <ErrorAlert message={error} />}

            {/* Action Buttons */}
            <div className="flex w-[1254px] justify-end gap-[10px] pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: '/events/$eventId/view',
                    params: { eventId: eventId! },
                  })
                }
                className="h-[42px] w-[154px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
              >
                Cancel
              </Button>
              <Button className="h-[42px] w-[154px] rounded-md bg-[#545F71] px-4 py-3 text-base font-semibold">
                Save & Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
