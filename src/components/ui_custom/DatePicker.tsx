'use client'

import { CalendarDays } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  id: string
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    setOpen(false)
    if (onChange) onChange(selectedDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className="w-48 justify-between font-normal bg-input border-none shadow-md text-xl"
        >
          {date ? date.toLocaleDateString() : placeholder}
          <CalendarDays />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          required
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
