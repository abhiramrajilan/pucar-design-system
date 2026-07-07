"use client"

import * as React from "react"
import { AlertTriangleIcon, CheckIcon, FlagIcon, PencilIcon, PlayIcon, RectangleHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { ScrutinyState } from "./use-scrutiny"

function SummaryGroup({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-4.5 first:mt-0">
      <div className="flex items-center gap-1.5 border-b pb-2 text-caption font-semibold text-muted-foreground">
        <Icon className="size-3.5" />
        {title}
      </div>
      <div className="divide-y">{children}</div>
    </div>
  )
}

function SummaryRow({
  title,
  detail,
  meta,
  onEdit,
}: {
  title: string
  detail: React.ReactNode
  meta?: React.ReactNode
  onEdit: () => void
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-body-compact font-medium">{title}</div>
        <div className="mt-0.5 text-body-compact text-muted-foreground">{detail}</div>
        {meta && <div className="mt-1.5 flex flex-wrap gap-1.5">{meta}</div>}
      </div>
      <Button size="sm" variant="ghost" onClick={onEdit}>
        <PencilIcon />
        Edit
      </Button>
    </div>
  )
}

function ConfirmView({ s }: { s: ScrutinyState }) {
  return (
    <div className="flex flex-col items-center gap-3 px-2 py-7 text-center">
      <div className="flex size-13 items-center justify-center rounded-full bg-success-muted text-success">
        <CheckIcon className="size-6" />
      </div>
      <DialogTitle className="text-title-s">
        {s.decision === "send" ? "Sent back to Adv. Priya Nair" : "Approved for cognizance"}
      </DialogTitle>
      <DialogDescription className="max-w-sm">
        {s.decision === "send"
          ? "The advocate will see each flag with its comment, audio, and evidence."
          : "The file moves forward. Your review and any open flags are logged with it."}
      </DialogDescription>
      <Button variant="outline" className="mt-2" onClick={s.backToQueue}>
        Back to queue
      </Button>
    </div>
  )
}

function SummaryBody({ s }: { s: ScrutinyState }) {
  // Mounts fresh each time the dialog opens (Radix unmounts DialogContent's
  // children on close), so this local ack state naturally resets.
  const [ack, setAck] = React.useState(false)

  const { corrections, flags, unreviewed } = s.buildSummary()
  const anyIssue = corrections.length + flags.length > 0
  const anyOpen = unreviewed.length > 0 || flags.length > 0
  const approveDisabled = anyOpen && !ack

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-title-s">Review summary</DialogTitle>
        <DialogDescription>
          CMP/1043/2026 · {corrections.length} correction{corrections.length !== 1 ? "s" : ""} ·{" "}
          {flags.length} flag{flags.length !== 1 ? "s" : ""}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[60vh] overflow-y-auto">
        {corrections.length > 0 && (
          <SummaryGroup icon={PencilIcon} title="Corrections — sent to the advocate for consent">
            {corrections.map((c) => (
              <SummaryRow
                key={c.fieldId}
                title={c.title}
                detail={
                  <>
                    <s className="text-muted-foreground/60">{c.old}</s> → {c.new}
                  </>
                }
                onEdit={() => s.jumpToField(c.fieldId)}
              />
            ))}
          </SummaryGroup>
        )}
        {flags.length > 0 && (
          <SummaryGroup icon={FlagIcon} title="Flags — returned to the advocate to resolve">
            {flags.map((fl) => (
              <SummaryRow
                key={fl.flagId}
                title={fl.title}
                detail={fl.text || <i className="text-muted-foreground">No comment</i>}
                meta={
                  <>
                    {fl.audio && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground">
                        <PlayIcon className="size-2.5" />
                        0:{String(fl.dur).padStart(2, "0")}
                      </span>
                    )}
                    {fl.evidenceCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-caption font-medium">
                        <RectangleHorizontalIcon className="size-3" />
                        {fl.evidenceCount} evidence mark{fl.evidenceCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </>
                }
                onEdit={() => s.jumpToFlag(fl.flagId)}
              />
            ))}
          </SummaryGroup>
        )}
        {unreviewed.length > 0 && (
          <SummaryGroup icon={AlertTriangleIcon} title="Not reviewed — AI mismatches you took no action on">
            {unreviewed.map((u) => (
              <SummaryRow
                key={u.fieldId}
                title={u.title}
                detail={u.note}
                meta={
                  <span className="inline-flex items-center rounded-full bg-warning-muted px-2.5 py-1 text-caption font-medium text-warning-muted-foreground">
                    Open
                  </span>
                }
                onEdit={() => s.jumpToField(u.fieldId)}
              />
            ))}
          </SummaryGroup>
        )}
        {!anyIssue && unreviewed.length === 0 && (
          <p className="mt-4 text-body-compact text-muted-foreground">
            No corrections or flags. The file can be approved for cognizance.
          </p>
        )}
      </div>

      {anyOpen && (
        <div className="flex items-start gap-2.5 rounded-lg bg-warning-muted px-3.5 py-3 text-body-compact text-warning-muted-foreground">
          <Checkbox
            id="ackbox"
            checked={ack}
            onCheckedChange={(v) => setAck(v === true)}
            className="mt-0.5"
          />
          <Label htmlFor="ackbox" className="font-normal text-warning-muted-foreground">
            I have seen the open flags and choose to proceed
          </Label>
        </div>
      )}

      <DialogFooter className="sm:justify-between">
        <Button variant="ghost" onClick={s.closeSummary}>
          Back to review
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={approveDisabled}
            onClick={() => !approveDisabled && s.decide("approve")}
          >
            Approve for cognizance
          </Button>
          {anyIssue && <Button onClick={() => s.decide("send")}>Send back to advocate</Button>}
        </div>
      </DialogFooter>
    </>
  )
}

export function ReviewSummaryDialog({ s }: { s: ScrutinyState }) {
  return (
    <Dialog
      open={s.summaryOpen}
      onOpenChange={(open) => {
        if (!open) s.closeSummary()
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        {s.decision ? <ConfirmView s={s} /> : <SummaryBody s={s} />}
      </DialogContent>
    </Dialog>
  )
}
