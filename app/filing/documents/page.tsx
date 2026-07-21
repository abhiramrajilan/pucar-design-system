"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  CreditCardIcon,
  EyeIcon,
  FilePlus2Icon,
  FileTextIcon,
  LockIcon,
  MailIcon,
  PlusIcon,
  RotateCcwIcon,
  ScaleIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ── Model ────────────────────────────────────────────────────────────────
// A "slot" is one place a document belongs — filled (done or errored) or empty.
// Non-optional slots count toward the required total. Slots group into cards;
// cards group into sections. Sentence case throughout (guidelines §1).
type FileMeta = { name: string; size: string; type: "PDF" | "JPG" | "PNG" }
type Slot = {
  id: string
  title: string
  description?: string
  optional?: boolean
  file?: FileMeta
  status?: "done" | "error"
}
type DocCard = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  slots: Slot[]
  removable?: boolean
}

const cheques: DocCard[] = [
  {
    id: "cheque-1",
    label: "Cheque 1",
    icon: CreditCardIcon,
    removable: true,
    slots: [
      {
        id: "c1-front",
        title: "Cheque (front side)",
        file: { name: "Cheque-1.jpg", size: "2.1 MB", type: "JPG" },
      },
      {
        id: "c1-memo",
        title: "Bank return / dishonour memo",
        file: { name: "Return-memo-1.pdf", size: "0.6 MB", type: "PDF" },
      },
    ],
  },
  {
    id: "cheque-2",
    label: "Cheque 2",
    icon: CreditCardIcon,
    removable: true,
    slots: [
      {
        id: "c2-front",
        title: "Cheque (front side)",
        file: { name: "Cheque-2.jpg", size: "1.9 MB", type: "JPG" },
      },
      {
        id: "c2-memo",
        title: "Bank return / dishonour memo",
        description: "The memo your bank issued when this cheque bounced.",
      },
    ],
  },
]

const complainants: DocCard[] = [
  {
    id: "complainant-1",
    label: "Complainant 1",
    icon: UserIcon,
    removable: true,
    slots: [
      {
        id: "p1-id",
        title: "ID proof (Aadhaar / PAN)",
        file: { name: "Aadhaar.pdf", size: "0.5 MB", type: "PDF" },
      },
    ],
  },
]

const noticeSlots: Slot[] = [
  {
    id: "demand-notice",
    title: "Demand notice",
    file: { name: "Demand-notice.pdf", size: "0.5 MB", type: "PDF" },
  },
  {
    id: "dispatch",
    title: "Proof of dispatch & delivery",
    description: "Postal / courier receipt with tracking or acknowledgement.",
  },
]

const supportingSlots: Slot[] = [
  {
    id: "loan",
    title: "Loan agreement / invoice / ledger",
    description: "Anything that records the debt, if you have it.",
    optional: true,
  },
]

const uploadTips = [
  "One file per slot — put each document where it belongs.",
  "Capture the full page, with all corners visible.",
  "Include every page of multi-page documents.",
  "Keep text in focus and readable.",
]

// Progress is derived from the slots, not hardcoded: every non-optional slot is
// required; it's "done" once it holds a file that didn't error.
const requiredSlots = [...cheques, ...complainants]
  .flatMap((card) => card.slots)
  .concat(noticeSlots, supportingSlots)
  .filter((slot) => !slot.optional)
const REQUIRED_TOTAL = requiredSlots.length
const REQUIRED_DONE = requiredSlots.filter(
  (slot) => slot.file && slot.status !== "error"
).length

// ── Small pieces ───────────────────────────────────────────────────────────
function FileThumb({
  type,
  onOpen,
  failed,
}: {
  type: FileMeta["type"]
  onOpen: () => void
  failed?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Preview file"
      className={cn(
        "group/thumb relative size-14 shrink-0 overflow-hidden rounded-md border bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        failed && "border-destructive/40"
      )}
    >
      <FileTextIcon className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/60" />
      <span className="absolute bottom-1 left-1 rounded-sm bg-foreground px-1 py-px text-caption leading-none font-medium text-background">
        {type}
      </span>
      <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-opacity group-hover/thumb:bg-foreground/5 group-hover/thumb:opacity-100">
        <EyeIcon className="size-4 text-foreground" />
      </span>
    </button>
  )
}

function UploadSlot({
  slot,
  onPreview,
  variant = "nested",
}: {
  slot: Slot
  onPreview: (file: FileMeta) => void
  // "nested" = a soft-fill chip inside a card (no outline of its own).
  // "surface" = a standalone slot sitting directly on the page, so it needs
  // a card-like treatment to lift off the grey background.
  variant?: "nested" | "surface"
}) {
  // Small boxes (thumb, icon) are defined by a border, not a near-white fill —
  // so they read on any surface. The slot's own fill is the softest step.
  const filledSurface = variant === "surface" ? "border bg-card" : "bg-surface-sunken"
  const emptySurface =
    variant === "surface"
      ? "border border-dashed bg-card"
      : "border border-dashed"

  if (slot.file) {
    const failed = slot.status === "error"
    return (
      <div className={cn("flex items-center gap-3 rounded-lg p-3", filledSurface)}>
        <FileThumb
          type={slot.file.type}
          failed={failed}
          onOpen={() => onPreview(slot.file!)}
        />
        <div className="min-w-0 flex-1">
          <span className="block truncate text-body-compact font-medium">
            {slot.title}
          </span>
          {failed ? (
            <div className="mt-0.5 flex items-center gap-1.5 text-caption font-medium text-destructive-ink">
              <TriangleAlertIcon className="size-3.5 shrink-0" />
              Upload failed — check the file and try again
            </div>
          ) : (
            <div className="mt-0.5 truncate text-caption text-muted-foreground">
              {slot.file.name} · {slot.file.size}
            </div>
          )}
        </div>
        {/* Right zone = status, then remove. Replace lives in the preview. */}
        <div className="flex shrink-0 items-center gap-2">
          {failed ? (
            <Button variant="outline" size="sm">
              <RotateCcwIcon />
              Try again
            </Button>
          ) : (
            <CheckCircle2Icon
              className="size-5 text-success-ink"
              aria-label="Uploaded"
            />
          )}
          <Button
            variant="destructive-ghost"
            size="icon-sm"
            aria-label={`Remove ${slot.title}`}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3 rounded-lg p-3", emptySurface)}>
      <div className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-background">
        <FilePlus2Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-body-compact font-medium">{slot.title}</span>
        {slot.description && (
          <div className="mt-0.5 text-caption text-muted-foreground">
            {slot.description}
          </div>
        )}
      </div>
      <Button variant="ghost" size="sm" className="shrink-0 text-primary">
        <PlusIcon />
        Choose file
      </Button>
    </div>
  )
}

function DocCardBlock({
  card,
  onPreview,
}: {
  card: DocCard
  onPreview: (file: FileMeta) => void
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-brand-muted text-brand-muted-foreground">
            <card.icon className="size-4" />
          </div>
          <span className="text-body font-medium">{card.label}</span>
        </div>
        {card.removable && (
          <Button variant="destructive-ghost" size="sm">
            Remove
          </Button>
        )}
      </div>
      <div className="space-y-2.5 px-4 pb-4">
        {card.slots.map((slot) => (
          <UploadSlot key={slot.id} slot={slot} onPreview={onPreview} />
        ))}
      </div>
    </div>
  )
}

function SectionLabel({
  children,
  note,
}: {
  children: React.ReactNode
  note?: string
}) {
  return (
    <div className="flex items-baseline gap-2">
      <h2 className="text-body-compact font-medium text-muted-foreground">
        {children}
      </h2>
      {note && <span className="text-caption text-muted-foreground">{note}</span>}
    </div>
  )
}

function AddAnother({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-body-compact font-medium text-primary transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <PlusIcon className="size-4" />
      {label}
    </button>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function FilingDocumentsPage() {
  const [preview, setPreview] = React.useState<FileMeta | null>(null)
  const remaining = REQUIRED_TOTAL - REQUIRED_DONE
  const pct = Math.round((REQUIRED_DONE / REQUIRED_TOTAL) * 100)

  return (
    <div className="flex min-h-svh flex-col bg-muted">
      {/* Flow header */}
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ScaleIcon className="size-5" />
            </div>
            <span className="font-heading text-body font-semibold">ON Court</span>
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <span className="hidden truncate text-body-compact text-muted-foreground sm:block">
              Filing under{" "}
              <span className="font-medium text-foreground">S.138, NI Act</span>{" "}
              · 24×7 ON Court, Chandigarh
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-caption text-muted-foreground">
                Step 3 of 5
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={cn(
                      "h-1.5 w-5 rounded-full",
                      s <= 3 ? "bg-primary" : "bg-accent"
                    )}
                  />
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/test-ui">Save &amp; exit</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          {/* Form column */}
          <div className="min-w-0 space-y-8">
            <div className="space-y-3">
              <div className="text-body-compact font-medium text-primary">
                Documents
              </div>
              <h1 className="text-title-l">Add your case documents</h1>
              <p className="text-body text-muted-foreground">
                Put each document in its place. We read them and fill your form
                where we can — anything we can&apos;t read, you type in. Add a
                card for every cheque and complainant in your case.
              </p>
              <div className="space-y-2 pt-1">
                <Progress value={pct} />
                <div className="text-body-compact text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {REQUIRED_DONE} of {REQUIRED_TOTAL}
                  </span>{" "}
                  required documents · {remaining} to go
                </div>
              </div>
            </div>

            {/* Cheques */}
            <section className="space-y-3">
              <SectionLabel>Cheques</SectionLabel>
              {cheques.map((card) => (
                <DocCardBlock key={card.id} card={card} onPreview={setPreview} />
              ))}
              <AddAnother label="Add another cheque" />
            </section>

            {/* Complainants */}
            <section className="space-y-3">
              <SectionLabel>Complainants</SectionLabel>
              {complainants.map((card) => (
                <DocCardBlock key={card.id} card={card} onPreview={setPreview} />
              ))}
              <AddAnother label="Add another complainant" />
            </section>

            {/* Notice & service */}
            <section className="space-y-3">
              <SectionLabel>Notice &amp; service</SectionLabel>
              <div className="rounded-xl border bg-card">
                <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-brand-muted text-brand-muted-foreground">
                    <MailIcon className="size-4" />
                  </div>
                  <span className="text-body font-medium">
                    Demand notice &amp; service
                  </span>
                </div>
                <div className="space-y-2.5 px-4 pb-4">
                  {noticeSlots.map((slot) => (
                    <UploadSlot
                      key={slot.id}
                      slot={slot}
                      onPreview={setPreview}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Supporting */}
            <section className="space-y-3">
              <SectionLabel note="optional">Supporting documents</SectionLabel>
              {supportingSlots.map((slot) => (
                <UploadSlot
                  key={slot.id}
                  slot={slot}
                  onPreview={setPreview}
                  variant="surface"
                />
              ))}
            </section>
          </div>

          {/* Help rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4 rounded-xl border bg-card p-6">
              <div>
                <h3 className="text-body font-medium">How to upload</h3>
                <ul className="mt-3 space-y-2.5">
                  {uploadTips.map((tip) => (
                    <li key={tip} className="flex gap-2.5">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-success-ink" />
                      <span className="text-body-compact text-muted-foreground">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="text-body font-medium">Accepted</h3>
                <p className="mt-1 text-body-compact text-muted-foreground">
                  PDF, JPG or PNG · up to 25 MB each
                </p>
              </div>
              <Separator />
              <p className="flex items-start gap-2 text-caption text-muted-foreground">
                <LockIcon className="mt-0.5 size-3.5 shrink-0" />
                Encrypted and used only for this filing.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Sticky action bar */}
      <footer className="sticky bottom-0 z-20 border-t bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <span className="inline-flex items-center gap-2 text-body-compact text-warning-muted-foreground">
            <TriangleAlertIcon className="size-4" />
            {remaining} required documents still needed
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost">
              <ArrowLeftIcon />
              Back
            </Button>
            <Button variant="outline">Save draft</Button>
            <Button disabled title={`${remaining} required documents still needed`}>
              Continue to filing
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </footer>

      {/* File preview */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="sm:max-w-lg gap-0 p-0">
          <DialogHeader className="flex-row items-center gap-2.5 space-y-0 p-4">
            {preview && (
              <span className="rounded-sm bg-muted px-1.5 py-0.5 text-caption font-medium text-muted-foreground">
                {preview.type}
              </span>
            )}
            <DialogTitle className="text-body">{preview?.name}</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="p-4">
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-lg bg-muted/50 text-muted-foreground">
              <FileTextIcon className="size-10" />
              <span className="text-body-compact">
                {preview?.type} · document preview
              </span>
            </div>
          </div>
          <DialogFooter className="m-0 flex-row items-center justify-between border-t bg-muted/50 p-4 sm:justify-between">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">
                Replace file
              </Button>
              <Button variant="destructive-ghost" size="sm">
                Delete
              </Button>
            </div>
            <DialogClose asChild>
              <Button size="sm">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
