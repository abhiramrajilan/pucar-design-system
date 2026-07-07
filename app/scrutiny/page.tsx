"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, InfoIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { StatusPill } from "@/components/status-pill"

import { DocumentRail } from "./document-rail"
import { DocumentViewer } from "./document-viewer"
import { FieldsPanel } from "./fields-panel"
import { FlagComposer } from "./flag-composer"
import { ReviewSummaryDialog } from "./review-summary-dialog"
import { ScrutinyState, useScrutiny } from "./use-scrutiny"

function Divider({ s }: { s: ScrutinyState }) {
  const draggingRef = React.useRef(false)

  return (
    <div
      role="separator"
      aria-label="Resize panels"
      title="Drag to resize · double-click to reset"
      onPointerDown={(e) => {
        draggingRef.current = true
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return
        const w = s.swapped ? e.clientX : window.innerWidth - e.clientX
        s.setPanelWidth(w)
      }}
      onPointerUp={() => {
        if (!draggingRef.current) return
        draggingRef.current = false
        s.commitPanelWidth(s.panelWidth)
      }}
      onDoubleClick={s.resetPanelWidth}
      className="group flex w-3 shrink-0 cursor-col-resize justify-center bg-background"
    >
      <div className="my-2.5 w-1 rounded-full bg-border transition-colors group-hover:bg-muted-foreground/40" />
    </div>
  )
}

export default function ScrutinyPage() {
  const s = useScrutiny()
  const composerOpen = Boolean(s.draft) && !s.marking

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex h-16 shrink-0 items-center gap-3.5 border-b py-0 pr-4 pl-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to queue" title="Back to queue">
          <Link href="/test-ui">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex min-w-0 items-center gap-2.5">
            <h1 className="truncate text-[17px] leading-6 font-semibold">
              CMP/1043/2026 · Om Kumar v. Rakesh Sharma
            </h1>
            <StatusPill tone="waiting" className="shrink-0">
              Flag skipped at filing
            </StatusPill>
          </div>
          <p className="truncate text-caption text-muted-foreground">
            Complaint under S.138, Negotiable Instruments Act · Filed by Adv. Priya Nair
          </p>
        </div>
        <div className="flex-1" />
        <label
          className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border border-dashed px-3.5 py-1.5 text-caption font-medium text-muted-foreground select-none hover:border-muted-foreground/50"
          title="Prototype control — simulates the AI-unavailable state"
        >
          <Switch checked={!s.ai} onCheckedChange={(checked) => s.setAi(!checked)} size="sm" />
          Simulate AI unavailable
        </label>
        <Button onClick={s.openSummary}>Submit review</Button>
      </header>

      {!s.ai && (
        <div className="flex shrink-0 items-center gap-2.5 border-b bg-info-muted px-5 py-2.5 text-body-compact text-info-muted-foreground">
          <InfoIcon className="size-4 shrink-0" />
          AI assistance is unavailable for this file. All checks are manual — documents are grouped by
          filing section.
        </div>
      )}

      <Popover
        open={composerOpen}
        onOpenChange={(open) => {
          if (!open) s.closeComposer()
        }}
      >
        <div className={cn("flex min-h-0 flex-1", s.swapped && "flex-row-reverse")}>
          <div className={cn("flex min-h-0 min-w-0 flex-1", s.swapped && "flex-row-reverse")}>
            <DocumentRail s={s} />
            <DocumentViewer s={s} />
          </div>
          <Divider s={s} />
          <FieldsPanel s={s} />
        </div>
        <PopoverContent
          side="left"
          align="start"
          sideOffset={12}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="w-80 p-2.5"
        >
          <FlagComposer s={s} />
        </PopoverContent>
      </Popover>

      <ReviewSummaryDialog s={s} />
    </div>
  )
}
