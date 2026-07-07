"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  CreditCardIcon,
  InfoIcon,
  ClockIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// ── Fee breakdown ──────────────────────────────────────────────────────────
// Sentence case throughout (design-guidelines §1). Amounts are tabular so the
// decimals line up and the total reads at a glance.
const fees = [
  { label: "Court fee", amount: 14 },
  { label: "Legal benefit fee", amount: 13 },
  { label: "Advocate clerk welfare fund", amount: 12 },
  { label: "Complaint fee", amount: 10000 },
  { label: "Advocate welfare fund", amount: 50 },
  { label: "Delay condonation application fee", amount: 20 },
]
const total = fees.reduce((sum, f) => sum + f.amount, 0)

// Pre-payment steps — procedural, so tucked behind a disclosure, not shouting.
const steps = [
  "Allow payment pop-ups in your browser.",
  "Paying offline means visiting the court in person.",
  "Submit the stamp and envelope at the court complex within 3 days.",
]

const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

function PendingPaymentDialog() {
  return (
    <DialogContent
      showCloseButton
      className="sm:max-w-md gap-0 p-0 max-h-[90vh] grid-rows-[auto_auto_1fr_auto]"
    >
      {/* Header */}
      <DialogHeader className="p-5 pb-4">
        <DialogTitle className="text-title-s">Pending payment</DialogTitle>
        <DialogDescription>
          Your complaint under S.138 is ready once this is paid.
        </DialogDescription>
      </DialogHeader>

      <Separator />

      {/* Body */}
      <div className="space-y-4 overflow-y-auto p-5">
        {/* Amount receipt — the total leads, its make-up sits below it. */}
        <div className="rounded-xl bg-surface-sunken">
          <div className="flex items-start justify-between gap-3 p-4">
            <div>
              <div className="text-body-compact text-muted-foreground">
                Amount due
              </div>
              <div className="mt-1 text-title-l tabular-nums">{inr(total)}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-muted px-2.5 py-1 text-caption font-medium text-warning-muted-foreground">
              <ClockIcon className="size-3.5" />
              Under verification
            </span>
          </div>

          <Separator />

          <dl className="divide-y px-4">
            {fees.map((fee) => (
              <div
                key={fee.label}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <dt className="text-body-compact text-muted-foreground">
                  {fee.label}
                </dt>
                <dd className="text-body-compact tabular-nums">
                  {inr(fee.amount)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* One calm note — title + supporting line, clear hierarchy. */}
        <div className="flex gap-3 rounded-xl bg-info-muted p-4">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-info" />
          <div className="space-y-1">
            <p className="text-body-compact font-semibold text-foreground">
              We&apos;re verifying your payment
            </p>
            <p className="text-body-compact text-muted-foreground">
              If your account was already charged, please wait for the status to
              update — there&apos;s no need to pay again.
            </p>
          </div>
        </div>

        {/* Pre-payment steps — disclosed, not dumped on screen. */}
        <Collapsible defaultOpen={false} className="rounded-xl bg-surface-sunken">
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-body-compact font-medium transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            Before you pay
            <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-2 px-4 pt-1 pb-4 text-body-compact text-muted-foreground">
              {steps.map((step) => (
                <li key={step} className="flex gap-2">
                  <span aria-hidden className="text-muted-foreground/70">
                    •
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer — margins reset (parent is p-0), primary leads, quiet way out. */}
      <DialogFooter className="m-0 flex-col gap-2 px-5 py-4 sm:flex-col">
        <Button size="lg" className="w-full">
          <CreditCardIcon />
          Pay online now
        </Button>
        <DialogClose asChild>
          <Button variant="ghost" size="lg" className="w-full">
            I&apos;ll wait
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default function TestUIPage() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-title-l">Test UI</h1>
        <p className="text-body text-muted-foreground">
          A scratch surface for trying screens against the Pucar design system.
          First up: the pending-payment dialog, redesigned to spec.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCardIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-body font-medium">Pending payment</div>
            <div className="text-body-compact text-muted-foreground">
              {inr(total)} · status under verification
            </div>
          </div>
          <div className="ml-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Review payment</Button>
              </DialogTrigger>
              <PendingPaymentDialog />
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
