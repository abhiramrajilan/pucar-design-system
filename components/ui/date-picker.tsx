"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Field-shaped date choice: a 40px trigger echoing the chosen date, opening
// the calendar in a popover. For dates where week context matters (hearings,
// adjournments). Known dates the user can type faster (DOB) want segmented
// text inputs instead — GOV.UK memorable-dates pattern.
function DatePicker({
  value,
  onValueChange,
  placeholder = "Pick a date",
  disabled,
  id,
  className,
}: {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-slot="date-picker-trigger"
          className={cn(
            "w-full justify-start border-input font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="text-muted-foreground" />
          {value ? format(value, "d MMMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onValueChange?.(d)
            setOpen(false)
          }}
          captionLayout="dropdown"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// Range variant — adjournment windows, cause-list spans. Same anatomy.
function DateRangePicker({
  value,
  onValueChange,
  placeholder = "Pick a date range",
  disabled,
  id,
  className,
}: {
  value?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-slot="date-range-picker-trigger"
          className={cn(
            "w-full justify-start border-input font-normal",
            !value?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="text-muted-foreground" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "d MMM yyyy")} – {format(value.to, "d MMM yyyy")}
              </>
            ) : (
              format(value.from, "d MMM yyyy")
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onValueChange}
          numberOfMonths={2}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, DateRangePicker }
