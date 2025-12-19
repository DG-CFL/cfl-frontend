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
import { useCreateEvent } from '@/operations/events'
import type { EventPostData } from '@/types/events'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, Upload } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

export default function CreateEvent() {
  const navigate = useNavigate()
  const createEvent = useCreateEvent()

  const [coverImage, setCoverImage] = useState<Array<File> | undefined>(
    undefined,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EventPostData>()

  const [error, setError] = useState<string | null>(null)

  const onSubmit: SubmitHandler<EventPostData> = async (data) => {
    try {
      await createEvent.mutateAsync(data)
      navigate({ to: '/events/create-success' })
    } catch (err) {
      setError("Error creating event: " + error)
    }
  }

  return (
    <div className="mx-auto flex w-screen max-w-[1662px] flex-col gap-6 px-10 py-14">
      {/* Header with Back Button */}
      <div className="flex items-start gap-4">
        <Link to="/events">
          <Button variant="ghost" size="icon" className="size-10">
            <ChevronLeft className="size-8" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h1>Create New Event</h1>
          <p className="text-xl leading-7 text-muted-foreground">
            Fill in the details below to define a volunteer project
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} >
        <Card className=" gap-0 rounded-[10px] border border-muted-foreground/30">
          <CardContent className="w-full flex flex-col space-y-4 px-8 py-8">
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
                className="h-[222px] gap-3 rounded-lg border border-input bg-[#99999a] shadow-md transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 hover:border-ring/50"
              >
                <DropzoneEmptyState className="gap-3">
                  <Upload className="size-12 text-[#545F71]" />
                  <p className="text-base text-[#545F71]">
                    Drag & Drop Files Here
                  </p>
                </DropzoneEmptyState>
                <DropzoneContent className="gap-3">
                  <Upload className="size-12 text-[#545F71]" />
                  <p className="truncate text-base text-[#545F71]">
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
                className="h-12"
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
                className="h-[114px] resize-none"
              />
              {errors.description && (
                <ErrorAlert message={errors.description.message} />
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="flex gap-3">
              <div className=" flex-1 space-y-2">
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

              <div className="flex-1 space-y-2">
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
            <div className="flex gap-3">
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
            <div className="flex justify-end gap-[10px] pt-2">
              <Button
                variant="outline"
                className="h-[42px] w-[154px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
                onClick={() => navigate({ to: '/events' })}
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
