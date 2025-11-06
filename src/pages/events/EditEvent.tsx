import { useState } from 'react'
import { format, isValid, parse } from 'date-fns'
import { CalendarDays, ChevronLeft, Upload } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

export default function EditEvent() {
  const [dragActive, setDragActive] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startDateInput, setStartDateInput] = useState('')
  const [endDateInput, setEndDateInput] = useState('')

  const navigate = useNavigate()

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStartDateInput(value)

    // Try to parse the date as MM/dd/yyyy or MM / dd / yyyy
    const parsed = parse(value.replace(/\s/g, ''), 'MM/dd/yyyy', new Date())
    if (isValid(parsed)) {
      setStartDate(parsed)
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEndDateInput(value)

    // Try to parse the date as MM/dd/yyyy or MM / dd / yyyy
    const parsed = parse(value.replace(/\s/g, ''), 'MM/dd/yyyy', new Date())
    if (isValid(parsed)) {
      setEndDate(parsed)
    }
  }

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
              className="h-[114px] w-[1254px] resize-none rounded-md border border-muted-foreground/30"
            />
          </div>
          {/* Start Date & End Date */}
          <div className="flex w-[1254px] gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date" className="text-base text-[#545F71]">
                Start Date
              </Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="text"
                  value={
                    startDate
                      ? format(startDate, 'MM / dd / yyyy')
                      : startDateInput
                  }
                  onChange={handleStartDateChange}
                  placeholder="MM / DD / YYYY"
                  className="h-12 rounded-md border border-muted-foreground/30 p-3 pr-10"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 size-8 -translate-y-1/2 hover:bg-transparent"
                    >
                      <CalendarDays className="size-5 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setStartDateInput('')
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date" className="text-base text-[#545F71]">
                End Date
              </Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="text"
                  value={
                    endDate ? format(endDate, 'MM / dd / yyyy') : endDateInput
                  }
                  onChange={handleEndDateChange}
                  placeholder="MM / DD / YYYY"
                  className="h-12 rounded-md border border-muted-foreground/30 p-3 pr-10"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 size-8 -translate-y-1/2 hover:bg-transparent"
                    >
                      <CalendarDays className="size-5 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setEndDateInput('')
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
                type="text"
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
