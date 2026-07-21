"use client"

import * as React from "react"
import {
  CheckIcon,
  FlagIcon,
  InfoIcon,
  PencilIcon,
  PlayIcon,
  RectangleHorizontalIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PopoverAnchor } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { Badge } from "@/components/ui/badge"

import { DOCS, FieldDef, FIELDS, SECTIONS, SectionId } from "./data"
import { ScrutinyState } from "./use-scrutiny"

export function FieldsPanel({ s }: { s: ScrutinyState }) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = React.useState(false)

  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setNarrow(entries[0].contentRect.width < 400)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const rows = FIELDS.filter((f) => f.section === s.activeSection).filter(
    (f) => !s.issuesOnly || s.isIssue(f) || s.flagsForField(f.id).length > 0
  )

  return (
    <div
      ref={rootRef}
      style={{ width: s.panelWidth }}
      className={cn(
        "flex min-h-0 min-w-0 shrink-0 flex-col bg-background",
        s.swapped ? "border-r" : "border-l"
      )}
    >
      <div className="shrink-0 px-4.5 pt-3.5">
        {narrow ? (
          <Select
            value={s.activeSection}
            onValueChange={(v) => s.setActiveSectionId(v as SectionId)}
          >
            <SelectTrigger className="mb-2 w-full" aria-label="Section">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTIONS.map((sec) => {
                const n = s.openIssuesInSection(sec.id)
                return (
                  <SelectItem key={sec.id} value={sec.id}>
                    {sec.label}
                    {n > 0 ? ` (${n})` : ""}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        ) : (
          <Tabs value={s.activeSection} onValueChange={(v) => s.setActiveSectionId(v as SectionId)}>
            <TabsList variant="line" className="h-auto w-full justify-start rounded-none border-b p-0">
              {SECTIONS.map((sec) => {
                const n = s.openIssuesInSection(sec.id)
                return (
                  <TabsTrigger key={sec.id} value={sec.id} className="gap-1.5 rounded-none pb-2.5">
                    {sec.label}
                    {n > 0 && (
                      <Badge variant="warning">
                        {n}
                      </Badge>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        )}

        <div className="flex min-h-9.5 items-center gap-2.5 py-2.5">
          <SummaryLine s={s} />
          <Toggle
            pressed={s.issuesOnly}
            onPressedChange={s.setIssuesOnly}
            size="sm"
            className="ml-auto shrink-0 gap-1.5 rounded-full border px-3 text-caption font-medium text-muted-foreground data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
          >
            Issues only
          </Toggle>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-8">
        {rows.length ? (
          rows.map((f) => <FieldRow key={f.id} f={f} s={s} />)
        ) : (
          <div className="px-4.5 py-4 text-body-compact text-muted-foreground">
            {s.issuesOnly ? "No issues in this section." : "No fields in this section."}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryLine({ s }: { s: ScrutinyState }) {
  const n = s.totalIssues
  if (n > 0) {
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-body-compact font-medium">
        <TriangleAlertIcon className="size-3.5 shrink-0 text-warning-muted-foreground" />
        <span className="truncate text-warning-muted-foreground">
          {n} field{n > 1 ? "s" : ""} need{n > 1 ? "" : "s"} attention
        </span>
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-body-compact font-medium text-muted-foreground">
      <CheckIcon className="size-3.5" />
      All fields reviewed
    </span>
  )
}

function FieldEditRow({
  f,
  s,
  initialValue,
  stop,
}: {
  f: FieldDef
  s: ScrutinyState
  initialValue: string
  stop: (e: React.SyntheticEvent) => void
}) {
  // Mounts fresh each time editing starts (see FieldRow's ternary), so this
  // local draft naturally resets without needing an effect.
  const [value, setValue] = React.useState(initialValue)
  return (
    <>
      <div className="text-caption font-medium text-muted-foreground">{f.label}</div>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={stop}
        onKeyDown={(e) => {
          if (e.key === "Enter") s.saveEdit(f.id, value)
        }}
        aria-label={`Edit ${f.label}`}
        className="mt-1.5 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-body outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="mt-2.5 flex gap-1.5">
        <Button size="sm" variant="secondary" onClick={(e) => { stop(e); s.saveEdit(f.id, value) }}>
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={(e) => { stop(e); s.cancelEdit() }}>
          Cancel
        </Button>
      </div>
    </>
  )
}

function FieldRow({ f, s }: { f: FieldDef; s: ScrutinyState }) {
  const state = s.getCardState(f)
  const selected = s.selected === f.id
  const editing = s.editing === f.id
  const currentValue = s.ofs[f.id].correction ? s.ofs[f.id].correction!.new : f.value

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  const body = editing ? (
    <FieldEditRow f={f} s={s} initialValue={currentValue} stop={stop} />
  ) : (
    <>
      <div className="text-caption font-medium text-muted-foreground">{f.label}</div>
      {state === "corrected" && (
        <div className="text-caption text-muted-foreground/60 line-through">
          {s.ofs[f.id].correction!.old}
        </div>
      )}
      <div className="mt-0.5 flex items-center gap-2">
        <span className="min-w-0 truncate text-body">{currentValue}</span>
        {state === "verified" && (
          <span
            title={`Matches ${DOCS.find((d) => d.id === f.verified)!.name}`}
            className="shrink-0 text-success-ink"
          >
            <CheckIcon className="size-3.5" />
          </span>
        )}
        <Button
          size="icon-xs"
          variant="ghost"
          className={cn(
            "ml-auto shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
            selected && "opacity-100"
          )}
          aria-label="Edit value"
          onClick={(e) => { stop(e); s.startEdit(f.id) }}
        >
          <PencilIcon className="size-3.5" />
        </Button>
      </div>

      {state === "nodoc" && (
        <div className="mt-1 text-caption text-muted-foreground">No document to verify against</div>
      )}
      {state === "kept" && (
        <div className="mt-1 flex items-center gap-2 text-caption">
          <span className="flex items-center gap-1 text-muted-foreground">
            <CheckIcon className="size-3" />
            You kept the filed value
          </span>
          <button className="font-medium text-primary underline underline-offset-2" onClick={(e) => { stop(e); s.unkeep(f.id) }}>
            Undo
          </button>
        </div>
      )}
      {state === "corrected" && (
        <div className="mt-1 flex items-center gap-1.5 text-caption text-muted-foreground">
          <InfoIcon className="size-3 shrink-0" />
          Edited by you — sent to the advocate for consent
          <button className="font-medium text-primary underline underline-offset-2" onClick={(e) => { stop(e); s.undoField(f.id) }}>
            Undo
          </button>
        </div>
      )}

      {(state === "aiflag" || state === "lowconf") && f.ai && <AiCallout f={f} s={s} stop={stop} />}

      <FlagCallouts f={f} s={s} stop={stop} />
    </>
  )

  const row = (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !editing && s.selectField(f.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !editing) s.selectField(f.id)
      }}
      className={cn(
        "group relative cursor-pointer border-b px-4.5 py-3.5 transition-colors hover:bg-muted/50",
        selected && "bg-brand-muted"
      )}
    >
      {selected && <span className="absolute inset-y-2.5 left-0 w-[2.5px] rounded-full bg-primary" aria-hidden />}
      {body}
    </div>
  )

  return s.draft && s.draft.fieldId === f.id ? <PopoverAnchor asChild>{row}</PopoverAnchor> : row
}

function AiCallout({ f, s, stop }: { f: FieldDef; s: ScrutinyState; stop: (e: React.SyntheticEvent) => void }) {
  const ai = f.ai!
  const src = DOCS.find((d) => d.id === ai.srcDoc)!
  return (
    <div className="mt-2.5 rounded-md border-l-[3px] border-warning bg-warning-muted/50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-caption font-semibold text-warning-muted-foreground">
        <SparklesIcon className="size-3" />
        {ai.kind === "lowconf" ? "AI could not read this clearly" : "AI found a mismatch"}
      </div>
      <div className="mt-1 text-body-compact font-medium">{ai.extracted}</div>
      <div className="mt-0.5 text-caption text-muted-foreground">
        In{" "}
        <button
          className="font-medium text-primary underline underline-offset-2"
          onClick={(e) => { stop(e); s.openSourceDoc(f.id) }}
        >
          {src.name}
        </button>{" "}
        · {ai.note}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {ai.kind === "mismatch" && (
          <Button size="sm" variant="secondary" onClick={(e) => { stop(e); s.acceptSuggestion(f.id) }}>
            <CheckIcon />
            Accept suggestion
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={(e) => { stop(e); s.keepFiled(f.id) }}>
          Keep filed value
        </Button>
        <Button size="sm" variant="destructive-ghost" onClick={(e) => { stop(e); s.flagField(f.id) }}>
          <FlagIcon />
          Flag
        </Button>
      </div>
    </div>
  )
}

function FlagCallouts({ f, s, stop }: { f: FieldDef; s: ScrutinyState; stop: (e: React.SyntheticEvent) => void }) {
  const flags = s.flagsForField(f.id)
  if (!flags.length) return null
  return (
    <>
      {flags.map((fl) => (
        <div key={fl.id} className="mt-2.5 rounded-md border-l-[3px] border-destructive bg-destructive/4 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-caption font-semibold text-destructive-ink">
            <FlagIcon className="size-3" />
            Your flag
            {fl.audio && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground">
                <PlayIcon className="size-2.5" />
                0:{String(fl.dur).padStart(2, "0")}
              </span>
            )}
          </div>
          <button
            className="mt-1 text-left text-body-compact hover:underline"
            title="Edit flag"
            onClick={(e) => { stop(e); s.openFlag(fl.id) }}
          >
            {fl.text ? (
              fl.text.slice(0, 90) + (fl.text.length > 90 ? "…" : "")
            ) : (
              <i className="text-muted-foreground">No comment</i>
            )}
          </button>
          {fl.evidence.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {fl.evidence.map((e, i) => (
                <button
                  key={i}
                  onClick={(ev) => { stop(ev); s.viewEvidence(fl.id, i) }}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-caption font-medium transition-colors hover:bg-muted"
                >
                  <RectangleHorizontalIcon className="size-3 text-destructive-ink" />
                  {DOCS.find((d) => d.id === e.docId)!.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-1.5">
              <button
                className="text-caption font-medium text-primary underline underline-offset-2"
                onClick={(e) => { stop(e); s.openFlag(fl.id, true) }}
              >
                Attach evidence from the document?
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
