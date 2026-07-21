import * as React from "react"

import { cn } from "@/lib/utils"

// Case progress as a vertical timeline (screen-craft §5): past = muted dot,
// current = brand dot, future = hollow dot. For the chronology of ONE matter —
// not a feed, not an activity log with actions (that's a list screen).
// Status at each step is words + dot, never colour alone.
function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function TimelineItem({
  className,
  status = "future",
  children,
  ...props
}: React.ComponentProps<"li"> & {
  /** past = done · current = where the case is now · future = not yet reached */
  status?: "past" | "current" | "future"
}) {
  return (
    <li
      data-slot="timeline-item"
      data-status={status}
      className={cn("group/timeline-item relative flex gap-4 pb-8 last:pb-0", className)}
      {...props}
    >
      {/* Rail: dot + connector. The connector is structural, not interactive → border colour. */}
      <div aria-hidden="true" className="flex flex-col items-center">
        <div
          data-slot="timeline-dot"
          className={cn(
            "mt-1 size-3 shrink-0 rounded-full",
            status === "past" && "bg-muted-foreground",
            status === "current" && "bg-primary ring-3 ring-brand-muted",
            status === "future" && "border-2 border-border bg-background"
          )}
        />
        <div className="mt-1 w-px flex-1 bg-border group-last/timeline-item:hidden" />
      </div>
      <div className="min-w-0 flex-1 pb-1">{children}</div>
    </li>
  )
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-title"
      className={cn(
        "text-body font-medium group-data-[status=future]/timeline-item:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-meta"
      className={cn("mt-0.5 text-caption text-muted-foreground", className)}
      {...props}
    />
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("mt-2 text-body-compact text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Timeline, TimelineItem, TimelineTitle, TimelineMeta, TimelineContent }
