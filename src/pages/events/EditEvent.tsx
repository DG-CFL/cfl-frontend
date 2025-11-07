import { useState } from 'react'
import { ChevronLeft, Upload } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { getEventById } from './placeholderEvents'
import { PLACEHOLDER_DATA } from './ViewEvent'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DateInput } from '@/components/ui_custom/DateInput'

export default function EditEvent() {
  const { eventId } = useParams({ strict: false })
  const navigate = useNavigate()

  // Get event data - this happens once during component initialization
  const data = eventId ? getEventById(eventId) || PLACEHOLDER_DATA : PLACEHOLDER_DATA

  const [dragActive, setDragActive] = useState(false)
  const [projectName, setProjectName] = useState(data.eventName)
  const [projectDescription, setProjectDescription] = useState(data.description)
  const [venue, setVenue] = useState(data.location.split(',')[0] || '')
  const [postalCode, setPostalCode] = useState(
    data.location.split(',').pop()?.trim() || ''
  )
  const [startDate, setStartDate] = useState<Date | undefined>(
    data.startDate ? new Date(data.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    data.endDate ? new Date(data.endDate) : undefined
  )

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file upload here
  }

  return (
    <div className="mx-auto flex w-full max-w-[1662px] flex-col gap-6 px-10 py-14">
      {/* Header with Back Button */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" className="size-10">
          <ChevronLeft className="size-8" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1>Edit Event</h1>
          <p className="text-xl leading-7 text-muted-foreground">
            Fill in the details below to edit a volunteer project
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="h-[854px] w-[1568px] gap-0 rounded-[10px] border border-muted-foreground/30">
        <CardContent className="flex flex-col items-center space-y-4 px-8 py-8">
          {/* Upload Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover-upload" className="text-base text-[#545F71]">
              Upload Cover Image
            </Label>
            <div
              className={`flex h-[222px] w-[1254px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 bg-[#99999A]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="size-12 text-[#F4F4F4]" />
              <p className="text-base text-[#F4F4F4]">Drag & Drop Files Here</p>
              <input
                id="cover-upload"
                type="file"
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-base text-[#545F71]">
              Project Name
            </Label>
            <Input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="h-12 w-[1254px] rounded-md border border-muted-foreground/30"
            />
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
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="h-[114px] w-[1254px] resize-none rounded-md border border-muted-foreground/30"
            />
          </div>
          {/* Start Date & End Date */}
          <div className="flex w-[1254px] gap-3">
            <DateInput
              id="start-date"
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              className="flex-1 space-y-2"
            />

            <DateInput
              id="end-date"
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              className="flex-1 space-y-2"
            />
          </div>

          {/* Venue & Postal Code */}
          <div className="flex w-[1254px] gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="venue" className="text-base text-[#545F71]">
                Venue
              </Label>
              <Input
                id="venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="h-12 rounded-md border border-muted-foreground/30 p-3"
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="postal-code" className="text-base text-[#545F71]">
                Postal Code
              </Label>
              <Input
                id="postal-code"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-12 rounded-md border border-muted-foreground/30 p-3"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-[1254px] justify-end gap-[10px] pt-2">
            <Button
              variant="outline"
              className="h-[42px] w-[154px] rounded-md border border-muted-foreground/30 px-4 py-3 text-base"
            >
              Cancel
            </Button>
            <Button
              className="h-[42px] w-[154px] rounded-md bg-[#545F71] px-4 py-3 text-base font-semibold"
              onClick={() =>
                navigate({ to: '/events/edit-event-success' })
              }
            >
              Save & Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
