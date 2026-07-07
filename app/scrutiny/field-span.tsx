"use client"

import * as React from "react"
import { SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Which field (if any) the AI should show "read this" evidence for on the
 * currently open document. Set by the viewer from the selected field + AI state.
 */
const EvidenceContext = React.createContext<string | null>(null)

export function EvidenceProvider({
  highlightedField,
  children,
}: {
  highlightedField: string | null
  children: React.ReactNode
}) {
  return (
    <EvidenceContext.Provider value={highlightedField}>
      {children}
    </EvidenceContext.Provider>
  )
}

/**
 * Marks a span of mock document text as the source for a filed field value.
 * Base id (before an optional numeric suffix, e.g. "amount2") is what's matched —
 * some documents show the same value twice (words + figures).
 */
export function FieldSpan({
  id,
  className,
  children,
}: {
  id: string
  className?: string
  children: React.ReactNode
}) {
  const highlighted = React.useContext(EvidenceContext)
  const baseId = id.replace(/\d+$/, "")
  const active = highlighted === baseId

  return (
    <span
      data-field-id={baseId}
      className={cn(
        "relative rounded-[2px]",
        active && "bg-primary/15 outline-2 outline-primary",
        className
      )}
    >
      {children}
      {active && (
        <span className="absolute -top-6 -left-0.5 inline-flex items-center gap-1 rounded-md border bg-card px-2 py-0.5 text-caption font-medium whitespace-nowrap text-primary shadow-raised">
          <SparklesIcon className="size-3" />
          AI read this
        </span>
      )}
    </span>
  )
}
