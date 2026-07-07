"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// The standardized form pattern (design-guidelines §5, screen-craft §2):
// label ABOVE field (gap-2), hint and error in `caption` under the field,
// error = destructive colour PLUS text (never colour alone). Forms are
// single-column at citizen widths; fields within a group sit at gap-4…6.
// Use this instead of hand-wiring Label + <p> per screen — it carries the
// aria wiring (aria-invalid, role="alert") that hand-wiring forgets.

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

const fieldLegendVariants = cva("mb-3 font-medium", {
  variants: {
    variant: {
      legend: "text-body",
      label: "text-sm",
    },
  },
  defaultVariants: {
    variant: "legend",
  },
})

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & VariantProps<typeof fieldLegendVariants>) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(fieldLegendVariants({ variant }), className)}
      {...props}
    />
  )
}

// Section of fields — the `space-y-6` field rhythm from screen-craft §2, as a component.
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group flex w-full flex-col gap-6 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-2 data-[invalid=true]:text-destructive", {
  variants: {
    orientation: {
      // Default: label above field — the Pucar form law.
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      // Horizontal is for checkbox/switch rows only (control + label on one line).
      horizontal:
        "flex-row items-center [&>[data-slot=field-label]]:flex-auto [&>[data-slot=field-content]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio],[role=switch]]:mt-0.5",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

// Label + description column beside a control (horizontal orientation).
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-1.5 leading-snug", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "w-fit leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn("flex w-fit items-center gap-2 text-sm font-medium leading-snug", className)}
      {...props}
    />
  )
}

// Hint text — `caption`, muted, under the field (or under the label in horizontal rows).
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-caption font-normal text-muted-foreground group-data-[disabled=true]/field:opacity-50 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn("relative -my-2 h-5 text-sm", className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto flex w-fit items-center bg-background px-2 text-muted-foreground"
        >
          {children}
        </span>
      )}
    </div>
  )
}

// Error — destructive PLUS text, never colour alone (design law §Colour).
// Accepts react-hook-form/zod-shaped errors or plain children.
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = React.useMemo(() => {
    if (children) return children
    if (!errors?.length) return null
    const unique = [...new Map(errors.filter(Boolean).map((e) => [e!.message, e])).values()]
    if (unique.length === 1 && unique[0]?.message) return unique[0].message
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {unique.map((e, i) => e?.message && <li key={i}>{e.message}</li>)}
      </ul>
    )
  }, [children, errors])

  if (!content) return null

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-caption font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
