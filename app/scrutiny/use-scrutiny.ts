"use client"

import * as React from "react"

import {
  CANNED_TRANSCRIPT,
  DocId,
  FIELDS,
  FieldDef,
  SECTIONS,
  SectionId,
} from "./data"

export type EvidenceRect = { docId: DocId; x: number; y: number; w: number; h: number }

export type Flag = {
  id: string
  fieldId: string | null
  docId: DocId | null
  text: string
  audio: boolean
  dur: number
  evidence: EvidenceRect[]
}

export type Draft = {
  flagId: string | null
  fieldId: string | null
  docId: DocId | null
  text: string
  audio: boolean
  dur: number
  evidence: EvidenceRect[]
}

type Resolution = "kept" | "edited" | "accepted" | null
type Correction = { old: string; new: string } | null

type FieldOfficerState = {
  resolution: Resolution
  correction: Correction
  prevState: { correction: Correction; resolution: Resolution } | null
}

export type CardState =
  | "corrected"
  | "flagged"
  | "aiflag"
  | "lowconf"
  | "kept"
  | "verified"
  | "nodoc"
  | "default"

export const fieldById = (id: string): FieldDef =>
  FIELDS.find((f) => f.id === id) as FieldDef

function initialOfs(): Record<string, FieldOfficerState> {
  const o: Record<string, FieldOfficerState> = {}
  FIELDS.forEach((f) => {
    o[f.id] = { resolution: null, correction: null, prevState: null }
  })
  return o
}

export function cardStateFor(
  f: FieldDef,
  o: FieldOfficerState,
  aiOn: boolean,
  fieldFlags: Flag[]
): CardState {
  if (o.correction) return "corrected"
  if (fieldFlags.length) return "flagged"
  if (aiOn && f.ai && !o.resolution) return f.ai.kind === "lowconf" ? "lowconf" : "aiflag"
  if (o.resolution === "kept") return "kept"
  if (aiOn && f.verified) return "verified"
  if (f.nodoc) return "nodoc"
  return "default"
}

export type CorrectionSummaryItem = {
  fieldId: string
  title: string
  sectionLabel: string
  old: string
  new: string
}
export type FlagSummaryItem = {
  flagId: string
  fieldId: string | null
  title: string
  text: string
  audio: boolean
  dur: number
  evidenceCount: number
}
export type UnreviewedSummaryItem = {
  fieldId: string
  title: string
  sectionLabel: string
  note: string
}

export function useScrutiny() {
  const [ai, setAiState] = React.useState(true)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [activeSection, setActiveSection] = React.useState<SectionId>("complainant")
  const [openDocId, setOpenDocId] = React.useState<DocId>("aadhaar")
  const [pulseFlagId, setPulseFlagId] = React.useState<string | null>(null)
  const [zoom, setZoomState] = React.useState(1)
  const [rectTool, setRectToolState] = React.useState(false)
  const [drawHint, setDrawHint] = React.useState<string | null>(null)
  const [marking, setMarking] = React.useState(false)
  const [draft, setDraft] = React.useState<Draft | null>(null)
  const [editing, setEditing] = React.useState<string | null>(null)
  const [issuesOnly, setIssuesOnly] = React.useState(false)
  const [swapped, setSwapped] = React.useState(false)
  const [panelWidth, setPanelWidthState] = React.useState(408)
  const [ofs, setOfs] = React.useState<Record<string, FieldOfficerState>>(initialOfs)
  const [flags, setFlags] = React.useState<Flag[]>([])
  const [summaryOpen, setSummaryOpen] = React.useState(false)
  const [decision, setDecision] = React.useState<"send" | "approve" | null>(null)
  const [recording, setRecording] = React.useState(false)
  const [recSec, setRecSec] = React.useState(0)

  const nextFlagId = React.useRef(1)
  const recTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // ── persisted layout prefs ──
  // One-time sync from an external system (localStorage) on mount. Deliberately
  // not a lazy useState initializer — that would read localStorage during SSR
  // render too and risk a hydration mismatch against the server-rendered markup.
  React.useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem("scrutiny.layout.swap") === "1") setSwapped(true)
      const w = parseInt(localStorage.getItem("scrutiny.layout.panelWidth") || "", 10)
      if (w >= 320 && w <= 560) setPanelWidthState(w)
    } catch {
      // localStorage unavailable — fall back to defaults
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (recTimerRef.current) clearInterval(recTimerRef.current)
    }
  }, [])

  // ── derived lookups ──
  const flagsForField = (fid: string) => flags.filter((fl) => fl.fieldId === fid)
  const flagsTouchingDoc = (did: DocId) =>
    flags.filter((fl) => fl.evidence.some((e) => e.docId === did) || (!fl.fieldId && fl.docId === did))
  const getCardState = (f: FieldDef): CardState =>
    cardStateFor(f, ofs[f.id], ai, flagsForField(f.id))
  const isIssue = (f: FieldDef) => {
    const st = getCardState(f)
    return st === "aiflag" || st === "lowconf" || st === "flagged"
  }
  const openIssuesInSection = (sec: SectionId) =>
    FIELDS.filter((f) => f.section === sec).reduce((n, f) => n + (isIssue(f) ? 1 : 0), 0)
  const totalIssues = FIELDS.filter(isIssue).length

  // ── navigation ──
  function openDoc(id: DocId, pulse?: string | null) {
    setOpenDocId(id)
    setPulseFlagId(pulse ?? null)
  }

  function selectField(fid: string) {
    const next = selected === fid ? null : fid
    setSelected(next)
    if (next) {
      const f = fieldById(next)
      if (ai && f.docIds.length && !f.docIds.includes(openDocId)) {
        openDoc(f.docIds[0])
      }
    }
  }

  function setActiveSectionId(sec: SectionId) {
    setActiveSection(sec)
  }

  function setAi(on: boolean) {
    setAiState(on)
  }

  // ── viewer ──
  function setZoom(z: number) {
    setZoomState(Math.min(1.5, Math.max(0.75, z)))
  }

  function armRectTool(on: boolean, hint?: string) {
    setRectToolState(on)
    setDrawHint(on && hint ? hint : null)
  }

  function commitDrawnRect(box: { x: number; y: number; w: number; h: number }) {
    if (box.w < 1.5 || box.h < 1) return
    const ev: EvidenceRect = { docId: openDocId, ...box }
    if (marking && draft) {
      setDraft({ ...draft, evidence: [...draft.evidence, ev] })
      setMarking(false)
      armRectTool(false)
      return
    }
    startDraft(selected ? { fieldId: selected } : { fieldId: null, docId: openDocId }, [ev])
  }

  // ── field row actions ──
  function startEdit(fid: string) {
    setEditing(fid)
  }
  function cancelEdit() {
    setEditing(null)
  }
  function saveEdit(fid: string, value: string) {
    const v = value.trim()
    const f = fieldById(fid)
    setEditing(null)
    setOfs((prev) => {
      const cur = prev[fid]
      const currentValue = cur.correction ? cur.correction.new : f.value
      if (!v || v === currentValue) return prev
      return {
        ...prev,
        [fid]: {
          ...cur,
          prevState: { correction: cur.correction, resolution: cur.resolution },
          correction: { old: f.value, new: v },
          resolution: "edited",
        },
      }
    })
  }
  function acceptSuggestion(fid: string) {
    const f = fieldById(fid)
    if (!f.ai) return
    setOfs((prev) => {
      const cur = prev[fid]
      return {
        ...prev,
        [fid]: {
          ...cur,
          prevState: { correction: cur.correction, resolution: cur.resolution },
          correction: { old: f.value, new: f.ai!.extracted },
          resolution: "accepted",
        },
      }
    })
  }
  function keepFiled(fid: string) {
    setOfs((prev) => ({ ...prev, [fid]: { ...prev[fid], resolution: "kept" } }))
  }
  function unkeep(fid: string) {
    setOfs((prev) => ({ ...prev, [fid]: { ...prev[fid], resolution: null } }))
  }
  function undoField(fid: string) {
    setOfs((prev) => {
      const cur = prev[fid]
      return {
        ...prev,
        [fid]: {
          resolution: cur.prevState?.resolution ?? null,
          correction: cur.prevState?.correction ?? null,
          prevState: null,
        },
      }
    })
  }
  function flagField(fid: string) {
    if (selected !== fid) setSelected(fid)
    startDraft({ fieldId: fid }, [])
  }

  // ── composer / draft ──
  function startDraft(ctx: { fieldId: string | null; docId?: DocId | null }, evidence: EvidenceRect[]) {
    setDraft({
      flagId: null,
      fieldId: ctx.fieldId ?? null,
      docId: ctx.docId ?? null,
      text: "",
      audio: false,
      dur: 0,
      evidence,
    })
    armRectTool(false)
  }

  function openFlag(id: string, armMark?: boolean) {
    const fl = flags.find((x) => x.id === id)
    if (!fl) return
    setDraft({
      flagId: fl.id,
      fieldId: fl.fieldId,
      docId: fl.docId,
      text: fl.text,
      audio: fl.audio,
      dur: fl.dur,
      evidence: fl.evidence.slice(),
    })
    if (fl.fieldId) {
      const f = fieldById(fl.fieldId)
      setActiveSection(f.section)
      setSelected(fl.fieldId)
    }
    if (armMark) markOnDocFor(fl.fieldId)
  }

  function viewEvidence(flagId: string, evidenceIndex: number) {
    const fl = flags.find((f) => f.id === flagId)
    const e = fl?.evidence[evidenceIndex]
    if (e) openDoc(e.docId, flagId)
  }

  function openSourceDoc(fid: string) {
    const f = fieldById(fid)
    if (selected !== fid) setSelected(fid)
    if (f.ai) openDoc(f.ai.srcDoc)
  }

  function markOnDocFor(fieldId: string | null) {
    setMarking(true)
    if (fieldId) {
      const f = fieldById(fieldId)
      if (f.docIds.length && !f.docIds.includes(openDocId)) openDoc(f.docIds[0])
    }
    armRectTool(
      true,
      `Draw a rectangle to attach evidence to "${fieldId ? fieldById(fieldId).label : "this note"}"`
    )
  }
  function markOnDoc() {
    if (!draft) return
    markOnDocFor(draft.fieldId)
  }

  function updateDraftText(text: string) {
    setDraft((d) => (d ? { ...d, text } : d))
  }
  function removeDraftEvidence(i: number) {
    setDraft((d) => (d ? { ...d, evidence: d.evidence.filter((_, idx) => idx !== i) } : d))
  }

  function startRecording() {
    if (recTimerRef.current) return
    setRecording(true)
    setRecSec(0)
    recTimerRef.current = setInterval(() => setRecSec((s) => s + 1), 1000)
  }
  function stopRecording() {
    if (recTimerRef.current) {
      clearInterval(recTimerRef.current)
      recTimerRef.current = null
    }
    const dur = Math.max(recSec, 1)
    setRecording(false)
    setDraft((d) => (d ? { ...d, audio: true, dur, text: d.text.trim() ? d.text : CANNED_TRANSCRIPT } : d))
  }

  function closeComposer() {
    if (recTimerRef.current) {
      clearInterval(recTimerRef.current)
      recTimerRef.current = null
    }
    setRecording(false)
    setDraft(null)
    setMarking(false)
    armRectTool(false)
  }

  function saveDraft(): boolean {
    if (!draft) return false
    const text = draft.text.trim()
    if (!text && !draft.audio && !draft.evidence.length) return false
    if (draft.flagId) {
      const flagId = draft.flagId
      setFlags((fl) =>
        fl.map((f) =>
          f.id === flagId
            ? { ...f, text, audio: draft.audio, dur: draft.dur, evidence: draft.evidence }
            : f
        )
      )
    } else {
      const id = "f" + nextFlagId.current++
      setFlags((fl) => [
        ...fl,
        { id, fieldId: draft.fieldId, docId: draft.docId, text, audio: draft.audio, dur: draft.dur, evidence: draft.evidence },
      ])
    }
    setDraft(null)
    setMarking(false)
    armRectTool(false)
    return true
  }

  function removeDraftFlag() {
    if (!draft || !draft.flagId) return
    const flagId = draft.flagId
    setFlags((fl) => fl.filter((f) => f.id !== flagId))
    closeComposer()
  }

  // ── layout ──
  function toggleSwap() {
    setSwapped((s) => {
      const next = !s
      try {
        localStorage.setItem("scrutiny.layout.swap", next ? "1" : "0")
      } catch {
        // ignore
      }
      return next
    })
  }
  function setPanelWidth(w: number) {
    setPanelWidthState(Math.min(560, Math.max(320, w)))
  }
  function commitPanelWidth(w: number) {
    try {
      localStorage.setItem("scrutiny.layout.panelWidth", String(w))
    } catch {
      // ignore
    }
  }
  function resetPanelWidth() {
    setPanelWidthState(408)
    try {
      localStorage.setItem("scrutiny.layout.panelWidth", "408")
    } catch {
      // ignore
    }
  }

  // ── review summary ──
  function openSummary() {
    closeComposer()
    setDecision(null)
    setSummaryOpen(true)
  }
  function closeSummary() {
    setSummaryOpen(false)
  }
  function backToQueue() {
    setSummaryOpen(false)
    setDecision(null)
  }
  function decide(kind: "send" | "approve") {
    setDecision(kind)
  }
  function jumpToField(fid: string) {
    setSummaryOpen(false)
    const f = fieldById(fid)
    setActiveSection(f.section)
    setSelected(fid)
    if (ai && f.docIds.length) openDoc(f.docIds[0])
  }
  function jumpToFlag(flagId: string) {
    setSummaryOpen(false)
    openFlag(flagId)
  }

  function buildSummary() {
    const corrections: CorrectionSummaryItem[] = []
    const unreviewed: UnreviewedSummaryItem[] = []
    FIELDS.forEach((f) => {
      const o = ofs[f.id]
      const sectionLabel = SECTIONS.find((s) => s.id === f.section)!.label
      if (o.correction) {
        corrections.push({
          fieldId: f.id,
          title: `${f.label} — ${sectionLabel}`,
          sectionLabel,
          old: o.correction.old,
          new: o.correction.new,
        })
      }
      const st = getCardState(f)
      if ((st === "aiflag" || st === "lowconf") && f.ai) {
        unreviewed.push({
          fieldId: f.id,
          title: `${f.label} — ${sectionLabel}`,
          sectionLabel,
          note: f.ai.note,
        })
      }
    })
    const flagItems: FlagSummaryItem[] = flags.map((fl) => {
      const sectionLabel = fl.fieldId ? SECTIONS.find((s) => s.id === fieldById(fl.fieldId!).section)!.label : ""
      const title = fl.fieldId
        ? `${fieldById(fl.fieldId).label} — ${sectionLabel}`
        : `Document note`
      return {
        flagId: fl.id,
        fieldId: fl.fieldId,
        title,
        text: fl.text,
        audio: fl.audio,
        dur: fl.dur,
        evidenceCount: fl.evidence.length,
      }
    })
    return { corrections, flags: flagItems, unreviewed }
  }

  // ── global escape cascade (marking > draft > editing > rectTool > selection) ──
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return
      if (marking) {
        setMarking(false)
        armRectTool(false)
      } else if (draft) {
        closeComposer()
      } else if (editing) {
        setEditing(null)
      } else if (rectTool) {
        armRectTool(false)
      } else if (selected) {
        setSelected(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    // closeComposer is a plain (non-memoized) function recreated each render,
    // so this effect already re-subscribes every render regardless.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marking, draft, editing, rectTool, selected])

  return {
    // state
    ai,
    selected,
    activeSection,
    openDocId,
    pulseFlagId,
    zoom,
    rectTool,
    drawHint,
    marking,
    draft,
    editing,
    issuesOnly,
    swapped,
    panelWidth,
    ofs,
    flags,
    summaryOpen,
    decision,
    recording,
    recSec,
    totalIssues,
    // derived
    flagsForField,
    flagsTouchingDoc,
    getCardState,
    isIssue,
    openIssuesInSection,
    // actions
    openDoc,
    selectField,
    setActiveSectionId,
    setAi,
    setZoom,
    armRectTool,
    commitDrawnRect,
    startEdit,
    cancelEdit,
    saveEdit,
    acceptSuggestion,
    keepFiled,
    unkeep,
    undoField,
    flagField,
    startDraft,
    openFlag,
    viewEvidence,
    openSourceDoc,
    markOnDoc,
    updateDraftText,
    removeDraftEvidence,
    startRecording,
    stopRecording,
    closeComposer,
    saveDraft,
    removeDraftFlag,
    setIssuesOnly,
    toggleSwap,
    setPanelWidth,
    commitPanelWidth,
    resetPanelWidth,
    openSummary,
    closeSummary,
    backToQueue,
    decide,
    jumpToField,
    jumpToFlag,
    buildSummary,
  }
}

export type ScrutinyState = ReturnType<typeof useScrutiny>
