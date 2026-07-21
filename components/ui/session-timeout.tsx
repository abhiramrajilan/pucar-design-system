"use client"

import * as React from "react"
import { ClockIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Session-expiry warning (WCAG 2.2.1): court filings are long forms, and a
// silent expiry destroys a citizen's work. Show this BEFORE the session ends,
// with enough time to act; extending must be one press. The timing logic
// (when to open, what extending does) lives in the app — this component is
// the accessible warning surface. The countdown is announced politely, and
// the safe action (staying signed in) is the primary.
function SessionTimeoutDialog({
  open,
  secondsRemaining,
  onExtend,
  onSignOut,
  title = "Your session is about to end",
  description = "You've been inactive for a while. To protect your information, you'll be signed out soon — any unsaved work in this filing will be kept as a draft.",
  extendLabel = "Stay signed in",
  signOutLabel = "Sign out now",
}: {
  open: boolean
  /** Seconds until the session expires — the app ticks this down. */
  secondsRemaining: number
  onExtend: () => void
  onSignOut: () => void
  title?: string
  description?: string
  extendLabel?: string
  signOutLabel?: string
}) {
  const minutes = Math.floor(Math.max(0, secondsRemaining) / 60)
  const seconds = Math.max(0, secondsRemaining) % 60
  const clock = `${minutes}:${String(seconds).padStart(2, "0")}`

  return (
    <AlertDialog open={open}>
      <AlertDialogContent data-slot="session-timeout">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ClockIcon className="size-4 text-warning-ink" aria-hidden="true" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {/* aria-live polite: announced without interrupting; visually the one number that matters */}
        <p aria-live="polite" className="text-body">
          Time remaining:{" "}
          <span className="font-mono font-semibold tabular-nums">{clock}</span>
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onSignOut}>{signOutLabel}</AlertDialogCancel>
          {/* Staying signed in is the SAFE action — it gets the primary. */}
          <AlertDialogAction onClick={onExtend}>{extendLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { SessionTimeoutDialog }
