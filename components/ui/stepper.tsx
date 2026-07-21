import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Progress indicator for MULTI-STEP flows (screen-craft §7: every citizen
// multi-step flow shows one). Steps are ordered — for parallel views of one
// object use tabs instead. The current step carries aria-current="step";
// complete steps show a check (state is icon + label, never colour alone).
function Stepper({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="stepper"
      className={cn("flex items-start gap-2", className)}
      {...props}
    />
  )
}

function StepperItem({
  className,
  status = "upcoming",
  step,
  label,
  ...props
}: React.ComponentProps<"li"> & {
  /** complete = done · current = the step in progress · upcoming = not yet */
  status?: "complete" | "current" | "upcoming"
  /** 1-based step number, shown until the step completes */
  step: number
  label: string
}) {
  return (
    <li
      data-slot="stepper-item"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn("group/step flex flex-1 flex-col items-center gap-2", className)}
      {...props}
    >
      <div className="flex w-full items-center">
        {/* leading connector — hidden on the first step */}
        <div className="h-0.5 flex-1 bg-border group-first/step:invisible group-data-[status=complete]/step:bg-primary group-data-[status=current]/step:bg-primary" />
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-caption font-semibold",
            status === "complete" && "bg-primary text-primary-foreground",
            status === "current" && "bg-brand-muted text-brand-muted-foreground ring-2 ring-primary",
            status === "upcoming" && "border-2 border-border bg-background text-muted-foreground"
          )}
        >
          {status === "complete" ? <CheckIcon className="size-4" /> : step}
        </div>
        {/* trailing connector — hidden on the last step */}
        <div className="h-0.5 flex-1 bg-border group-last/step:invisible" />
      </div>
      <div
        className={cn(
          "max-w-24 text-center text-caption",
          status === "current" ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
    </li>
  )
}

export { Stepper, StepperItem }
