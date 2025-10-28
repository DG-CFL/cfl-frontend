import { useState } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateEditEvent() {
  const [dragActive, setDragActive] = useState(false)

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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="size-10">
          <ArrowLeft className="size-6" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1>Edit/Create New Event</h1>
          <p className="text-base text-muted-foreground">
            Fill in the details below to define/edit a volunteer project
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="gap-0 rounded-[10px] border-muted-foreground/30">
        <CardContent className="space-y-6 px-8 py-8">
          {/* Upload Cover Image */}
          <div className="space-y-3">
            <Label htmlFor="cover-upload" className="text-base text-[#545F71]">
              Upload Cover Image
            </Label>
            <div
              className={`flex h-[157px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 bg-muted/20'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="size-12 text-muted-foreground" />
              <p className="text-base text-muted-foreground">Drag & Drop Files Here</p>
              <input
                id="cover-upload"
                type="file"
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-3">
            <Label htmlFor="project-name" className="text-base text-[#545F71]">
              Project Name
            </Label>
            <Input
              id="project-name"
              type="text"
              className="h-12 rounded-lg border-muted-foreground/30"
            />
          </div>

          {/* Project Description */}
          <div className="space-y-3">
            <Label htmlFor="project-description" className="text-base text-[#545F71]">
              Project Description
            </Label>
            <Textarea
              id="project-description"
              className="min-h-[100px] resize-none rounded-lg border-muted-foreground/30"
            />
          </div>

          {/* Start Date & End Date */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="start-date" className="text-base text-[#545F71]">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                className="h-12 rounded-lg border-muted-foreground/30"
                placeholder="MM / DD / YYYY"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="end-date" className="text-base text-[#545F71]">
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                className="h-12 rounded-lg border-muted-foreground/30"
                placeholder="MM / DD / YYYY"
              />
            </div>
          </div>

          {/* Venue & Postal Code */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="venue" className="text-base text-[#545F71]">
                Venue
              </Label>
              <Input
                id="venue"
                type="text"
                className="h-12 rounded-lg border-muted-foreground/30"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="postal-code" className="text-base text-[#545F71]">
                Postal Code
              </Label>
              <Input
                id="postal-code"
                type="text"
                className="h-12 rounded-lg border-muted-foreground/30"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              className="h-11 rounded-lg border-muted-foreground/30 px-8 text-base"
            >
              Cancel
            </Button>
            <Button className="h-11 rounded-lg bg-[#545F71] px-8 text-base font-semibold">
              Save & Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}