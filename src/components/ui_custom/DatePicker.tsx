'use client'

import { format, isValid, parse } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DatePickerProps {
  id: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select date',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(value)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (value) {
      setDate(value)
      setInputValue(format(value, 'MM/dd/yyyy'))
    } else {
      setDate(undefined)
      setInputValue('')
    }
  }, [value])

  const formatDateInput = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, '').slice(0, 8)

    if (digits.length === 0) {
      return ''
    }

    if (digits.length <= 2) {
      return digits + (digits.length === 2 ? '/' : '')
    }

    if (digits.length <= 4) {
      const segment = `${digits.slice(0, 2)}/${digits.slice(2)}`
      return segment + (digits.length === 4 ? '/' : '')
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }

  const updateDateState = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onChange) {
      onChange(newDate)
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(event.target.value)
    setInputValue(formatted)

    if (formatted.length === 10) {
      const parsed = parse(formatted, 'MM/dd/yyyy', new Date())
      if (isValid(parsed)) {
        updateDateState(parsed)
        return
      }
    }

    if (formatted.length < 10) {
      updateDateState(undefined)
    }
  }

  const handleBlur = () => {
    if (inputValue.length === 10) {
      const parsed = parse(inputValue, 'MM/dd/yyyy', new Date())
      if (isValid(parsed)) {
        updateDateState(parsed)
        setInputValue(format(parsed, 'MM/dd/yyyy'))
        return
      }
    }

    if (inputValue.trim() === '') {
      updateDateState(undefined)
    }
  }

  const handleSelect = (selectedDate?: Date) => {
    const nextDate = selectedDate ?? undefined
    updateDateState(nextDate)
    if (nextDate) {
      setInputValue(format(nextDate, 'MM/dd/yyyy'))
    } else {
      setInputValue('')
    }
    setOpen(false)
  }

  return (
    <div className="relative w-48">
      <Input
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={10}
        inputMode="numeric"
        className="h-12 pr-12 text-base"
        aria-label="Date input"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-9 -translate-y-1/2"
            aria-label="Open calendar"
          >
            <CalendarDays className="size-5" />
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
    </div>
  )
}
