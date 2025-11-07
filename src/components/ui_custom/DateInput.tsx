import { useState } from 'react'
import { format, isValid, parse } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export type DateInputProps = {
  id?: string
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export function DateInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'MM/DD/YYYY',
  className,
  required,
}: DateInputProps) {
  const [dateInput, setDateInput] = useState(
    value ? format(value, 'MM/dd/yyyy') : ''
  )

  // Format date input with auto-inserted slashes
  const formatDateInput = (inputValue: string): string => {
    // Remove all non-digit characters
    const digits = inputValue.replace(/\D/g, '')

    // Add slashes automatically: MM/DD/YYYY
    // Slash appears after 2nd character (MM/) and after 4th character (DD/)
    if (digits.length <= 2) {
      return digits
    } else if (digits.length === 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    } else if (digits.length === 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    } else if (digits.length === 5) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value)
    setDateInput(formattedValue)

    // Try to parse complete date (MM/dd/yyyy format)
    if (formattedValue.length === 10) {
      const parsed = parse(formattedValue, 'MM/dd/yyyy', new Date())
      if (isValid(parsed)) {
        onChange?.(parsed)
      } else {
        onChange?.(undefined)
      }
    } else {
      // Clear date if input is incomplete
      onChange?.(undefined)
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    onChange?.(date)
    setDateInput(date ? format(date, 'MM/dd/yyyy') : '')
  }

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className="text-base text-[#545F71]">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={dateInput}
          onChange={handleDateChange}
          placeholder={placeholder}
          maxLength={10}
          className="h-12 rounded-md border border-muted-foreground/30 p-3 pr-10"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2 hover:bg-transparent"
              type="button"
            >
              <CalendarDays className="size-5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={value} onSelect={handleCalendarSelect} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
