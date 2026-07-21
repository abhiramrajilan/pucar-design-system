"use client"

import * as React from "react"
import {
  ArrowLeftRightIcon,
  FileTextIcon,
  FlagIcon,
  RectangleHorizontalIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { PopoverAnchor } from "@/components/ui/popover"

import { DOC_CONTENT, DOCS } from "./data"
import { EvidenceProvider } from "./field-span"
import { EvidenceRect, fieldById, Flag, ScrutinyState } from "./use-scrutiny"

function AnnotationRect({
  rect,
  label,
  faded,
  pulse,
  onClick,
}: {
  rect: EvidenceRect
  label?: string
  faded?: boolean
  pulse?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute rounded-[3px] border-2 border-destructive bg-destructive/10 transition-opacity",
        onClick && "cursor-pointer",
        faded && "opacity-45 hover:opacity-100",
        pulse && "animate-[pulse-annotation_1.1s_ease-out_2]"
      )}
      style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%` }}
    >
      {label && (
        <span className="absolute -top-6 -left-0.5 inline-flex items-center gap-1 rounded-md bg-destructive px-2 py-0.5 text-caption font-medium whitespace-nowrap text-destructive-foreground shadow-raised">
          <FlagIcon className="size-3" />
          {label}
        </span>
      )}
    </div>
  )
}

export function DocumentViewer({ s }: { s: ScrutinyState }) {
  const doc = DOCS.find((d) => d.id === s.openDocId)!
  const DocContent = DOC_CONTENT[s.openDocId]
  const pageRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const tempRectRef = React.useRef<HTMLDivElement>(null)
  const drawingRef = React.useRef<{ x: number; y: number; box: { x: number; y: number; w: number; h: number } | null } | null>(null)
  const lastEvidRef = React.useRef<string | null>(null)

  const highlightedField = s.ai && s.selected ? s.selected : null

  // Auto-scroll the evidence span for the selected field into view.
  React.useEffect(() => {
    if (!highlightedField || !canvasRef.current) return
    const key = highlightedField + ":" + s.openDocId
    if (lastEvidRef.current === key) return
    const el = canvasRef.current.querySelector(`[data-field-id="${highlightedField}"]`)
    if (el) {
      lastEvidRef.current = key
      el.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [highlightedField, s.openDocId])

  function handlePointerDown(e: React.PointerEvent) {
    if (!s.rectTool || e.button !== 0 || !pageRef.current) return
    const r = pageRef.current.getBoundingClientRect()
    drawingRef.current = {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      box: null,
    }
    e.preventDefault()
  }

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = drawingRef.current
      if (!d || !pageRef.current || !tempRectRef.current) return
      const r = pageRef.current.getBoundingClientRect()
      const cx = ((e.clientX - r.left) / r.width) * 100
      const cy = ((e.clientY - r.top) / r.height) * 100
      const x = Math.min(d.x, cx)
      const y = Math.min(d.y, cy)
      const w = Math.abs(cx - d.x)
      const h = Math.abs(cy - d.y)
      d.box = { x, y, w, h }
      Object.assign(tempRectRef.current.style, {
        display: "block",
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
      })
    }
    function onUp() {
      const d = drawingRef.current
      drawingRef.current = null
      if (tempRectRef.current) tempRectRef.current.style.display = "none"
      if (d?.box) s.commitDrawnRect(d.box)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [s])

  const annosForDoc: { rect: EvidenceRect; flag: Flag }[] = []
  s.flags.forEach((fl) => {
    fl.evidence
      .filter((e) => e.docId === s.openDocId)
      .forEach((rect) => annosForDoc.push({ rect, flag: fl }))
  })
  const draftEvidenceForDoc = s.draft ? s.draft.evidence.filter((e) => e.docId === s.openDocId) : []
  const draftAnchorHere = Boolean(s.draft && s.draft.fieldId === null)

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted/30">
      {/* toolbar */}
      <div className="flex h-[50px] shrink-0 items-center gap-1.5 border-b bg-background px-3">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <FileTextIcon className="size-4" />
          <span className="truncate text-body-compact font-medium text-foreground">{doc.name}</span>
          <span className="text-caption text-muted-foreground">1 / {doc.pages}</span>
        </div>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={() => s.setZoom(s.zoom - 0.25)}
        >
          <ZoomOutIcon />
        </Button>
        <span className="w-10 text-center font-mono text-caption text-muted-foreground">
          {Math.round(s.zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={() => s.setZoom(s.zoom + 0.25)}
        >
          <ZoomInIcon />
        </Button>
        <div className="mx-1.5 h-5 w-px bg-border" />
        <Toggle
          pressed={s.rectTool}
          onPressedChange={(on) => s.armRectTool(on)}
          size="sm"
          className="gap-1.5 px-3 data-[state=on]:bg-accent data-[state=on]:text-primary"
          title="Draw a rectangle to mark evidence on the document"
        >
          <RectangleHorizontalIcon className="size-4" />
          Rectangle
        </Toggle>
        <div className="mx-1.5 h-5 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Move documents to the other side"
          title="Move documents to the other side"
          onClick={s.toggleSwap}
        >
          <ArrowLeftRightIcon />
        </Button>
      </div>

      {/* draw hint */}
      <div className="relative flex-1 min-h-0">
        {s.drawHint && (
          <div className="absolute top-3.5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-3.5 py-1.5 text-caption font-medium whitespace-nowrap text-background shadow-overlay">
            <RectangleHorizontalIcon className="size-3.5" />
            {s.drawHint}
          </div>
        )}
        <div
          ref={canvasRef}
          className={cn("flex h-full items-start justify-center overflow-auto p-8", s.rectTool && "cursor-crosshair")}
        >
          {(() => {
            const pageEl = (
              <div
                ref={pageRef}
                onPointerDown={handlePointerDown}
                style={{ transform: `scale(${s.zoom})`, transformOrigin: "top center" }}
                className="relative min-h-[840px] w-[640px] shrink-0 select-none rounded-sm bg-card p-12 shadow-[0_1px_2px_rgb(28_32_36/0.06),0_8px_24px_-8px_rgb(28_32_36/0.14)] ring-1 ring-border"
              >
                <EvidenceProvider highlightedField={highlightedField}>
                  <DocContent />
                </EvidenceProvider>

                {annosForDoc.map(({ rect, flag }, i) => (
                  <AnnotationRect
                    key={flag.id + i}
                    rect={rect}
                    label={flag.fieldId ? fieldById(flag.fieldId).label : "Document note"}
                    faded={Boolean(s.selected && flag.fieldId !== s.selected)}
                    pulse={s.pulseFlagId === flag.id}
                    onClick={() => s.openFlag(flag.id)}
                  />
                ))}
                {draftEvidenceForDoc.map((rect, i) => (
                  <AnnotationRect key={"draft" + i} rect={rect} />
                ))}
                <div
                  ref={tempRectRef}
                  className="pointer-events-none absolute hidden rounded-[3px] border-2 border-destructive bg-destructive/10"
                />
              </div>
            )
            return draftAnchorHere ? <PopoverAnchor asChild>{pageEl}</PopoverAnchor> : pageEl
          })()}
        </div>
      </div>
    </div>
  )
}
