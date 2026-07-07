"use client"

import * as React from "react"
import {
  FlagIcon,
  MicIcon,
  PlayIcon,
  RectangleHorizontalIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { DOCS, SECTIONS } from "./data"
import { fieldById, ScrutinyState } from "./use-scrutiny"

export function FlagComposer({ s }: { s: ScrutinyState }) {
  const draft = s.draft
  if (!draft) return null

  const context = draft.fieldId
    ? {
        title: `Flag on: ${fieldById(draft.fieldId).label}`,
        sub: SECTIONS.find((sec) => sec.id === fieldById(draft.fieldId!).section)!.label,
      }
    : {
        title: "Note on document",
        sub: DOCS.find((d) => d.id === (draft.docId ?? s.openDocId))!.name,
      }

  return (
    <div className="-m-2.5 flex w-80 flex-col overflow-hidden rounded-lg">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-3.5 py-3">
        <FlagIcon className="size-4 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-caption font-semibold">{context.title}</div>
          <div className="truncate text-caption text-muted-foreground">{context.sub}</div>
        </div>
        <Button size="icon-xs" variant="ghost" aria-label="Close" onClick={s.closeComposer}>
          <XIcon />
        </Button>
      </div>

      <div className="flex flex-col gap-2.5 p-3.5">
        {draft.evidence.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {draft.evidence.map((e, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1.5">
                <RectangleHorizontalIcon className="size-3.5 shrink-0 text-destructive" />
                <span className="min-w-0 flex-1 truncate text-body-compact font-medium">
                  Evidence on {DOCS.find((d) => d.id === e.docId)!.name}
                </span>
                <button
                  aria-label="Remove evidence"
                  className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => s.removeDraftEvidence(i)}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Textarea
          value={draft.text}
          onChange={(e) => s.updateDraftText(e.target.value)}
          placeholder="Describe what needs to change…"
          aria-label="Flag note — describe what needs to change"
          className="min-h-19 text-body-compact"
        />

        <div className="flex items-center gap-2">
          {s.recording ? (
            <>
              <span className="size-2.5 shrink-0 animate-pulse rounded-full bg-destructive" aria-hidden />
              <span className="font-mono text-caption">0:{String(s.recSec).padStart(2, "0")}</span>
              <Button size="sm" variant="destructive-solid" className="ml-auto" onClick={s.stopRecording}>
                <SquareIcon className="size-3" />
                Stop
              </Button>
            </>
          ) : draft.audio ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-caption font-medium text-muted-foreground">
                <PlayIcon className="size-2.5" />
                0:{String(draft.dur).padStart(2, "0")}
              </span>
              <Button size="sm" variant="outline" onClick={s.startRecording}>
                <MicIcon />
                Record instead
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={s.startRecording}>
              <MicIcon />
              Record instead
            </Button>
          )}
        </div>
        {draft.audio && (
          <span className="text-caption text-muted-foreground">Transcript — review before sending</span>
        )}

        <div>
          <Button size="sm" variant="outline" onClick={s.markOnDoc}>
            <RectangleHorizontalIcon />
            Mark on document
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t px-3.5 py-3">
        {draft.flagId && (
          <Button size="sm" variant="destructive-ghost" onClick={s.removeDraftFlag}>
            Remove flag
          </Button>
        )}
        <div className="flex-1" />
        <Button size="sm" variant="ghost" onClick={s.closeComposer}>
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={s.saveDraft}>
          Save flag
        </Button>
      </div>
    </div>
  )
}
