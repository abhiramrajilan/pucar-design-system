"use client"

import * as React from "react"
import { FlagIcon, FolderIcon, Link2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

import { DOCS, DocMeta } from "./data"
import { fieldById, ScrutinyState } from "./use-scrutiny"

function DocThumb() {
  return (
    <div className="flex h-[38px] w-[30px] shrink-0 flex-col justify-center gap-1 rounded-[3px] border bg-card px-1 shadow-raised">
      <div className="h-px w-full bg-border" />
      <div className="h-px w-full bg-border" />
      <div className="h-px w-3/4 bg-border" />
    </div>
  )
}

function DocRow({
  doc,
  active,
  dim,
  flagCount,
  onOpen,
}: {
  doc: DocMeta
  active: boolean
  dim?: boolean
  flagCount: number
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-lg py-1.5 pr-2 pl-2.5 text-left transition-[opacity,background-color] hover:bg-accent",
        active && "bg-accent",
        dim && "opacity-55 hover:opacity-90"
      )}
    >
      {active && (
        <span className="absolute inset-y-2 left-0 w-[2.5px] rounded-full bg-primary" aria-hidden />
      )}
      <DocThumb />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-compact font-medium text-foreground">
          {doc.name}
        </span>
        <span className="block text-caption text-muted-foreground">
          {doc.pages} page{doc.pages > 1 ? "s" : ""}
        </span>
      </span>
      {flagCount > 0 && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[11px] font-semibold text-destructive">
          <FlagIcon className="size-2.5" />
          {flagCount}
        </span>
      )}
    </button>
  )
}

export function DocumentRail({ s }: { s: ScrutinyState }) {
  const selectedField = s.selected ? fieldById(s.selected) : null
  const related = Boolean(s.ai && selectedField && selectedField.docIds.length > 0)

  const sectionGroups = React.useMemo(() => {
    const groups: { section: string; docs: DocMeta[] }[] = []
    DOCS.forEach((d) => {
      const last = groups[groups.length - 1]
      if (last && last.section === d.section) last.docs.push(d)
      else groups.push({ section: d.section, docs: [d] })
    })
    return groups
  }, [])

  return (
    <nav
      aria-label="Uploaded documents"
      className={cn(
        "flex min-h-0 w-64 shrink-0 flex-col bg-muted/40",
        s.swapped ? "border-l" : "border-r"
      )}
    >
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2.5 pb-6">
          {related && selectedField ? (
            <>
              <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1.5 text-caption font-medium text-muted-foreground">
                <Link2Icon className="size-3.5 opacity-80" />
                Related to selected field
              </div>
              {selectedField.docIds.map((id) => {
                const doc = DOCS.find((d) => d.id === id)!
                return (
                  <DocRow
                    key={id}
                    doc={doc}
                    active={id === s.openDocId}
                    flagCount={s.flagsTouchingDoc(id).length}
                    onOpen={() => s.openDoc(id)}
                  />
                )
              })}
              <div className="mx-2 my-2.5 h-px bg-border" />
              <div className="flex items-center gap-1.5 px-2.5 pb-1.5 text-caption font-medium text-muted-foreground">
                <FolderIcon className="size-3.5 opacity-80" />
                Other documents
              </div>
              {DOCS.filter((d) => !selectedField.docIds.includes(d.id)).map((doc) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  active={doc.id === s.openDocId}
                  dim
                  flagCount={s.flagsTouchingDoc(doc.id).length}
                  onOpen={() => s.openDoc(doc.id)}
                />
              ))}
            </>
          ) : (
            sectionGroups.map((g) => (
              <React.Fragment key={g.section}>
                <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1.5 text-caption font-medium text-muted-foreground">
                  <FolderIcon className="size-3.5 opacity-80" />
                  {g.section}
                </div>
                {g.docs.map((doc) => (
                  <DocRow
                    key={doc.id}
                    doc={doc}
                    active={doc.id === s.openDocId}
                    flagCount={s.flagsTouchingDoc(doc.id).length}
                    onOpen={() => s.openDoc(doc.id)}
                  />
                ))}
              </React.Fragment>
            ))
          )}
        </div>
      </ScrollArea>
    </nav>
  )
}
