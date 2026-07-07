import * as React from "react"

import { cn } from "@/lib/utils"

type Tone = "ready" | "waiting" | "urgent" | "info" | "neutral"

const styles: Record<Tone, string> = {
  ready: "bg-success-muted text-success-muted-foreground",
  waiting: "bg-warning-muted text-warning-muted-foreground",
  urgent: "bg-destructive/10 text-destructive",
  info: "bg-info-muted text-info-muted-foreground",
  neutral: "bg-secondary text-secondary-foreground",
}

/**
 * Rounded-full status chip. AA-safe (muted-foreground = step-12). Sentence case.
 * Pair tone with the label so meaning never rides on colour alone.
 */
export function StatusPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium",
        styles[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
