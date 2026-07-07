"use client"

import * as React from "react"
import { UserRoundIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Profile setup fields. Name / username / email arrive pre-filled from sign-up;
// the password is the one thing the citizen sets here. Sentence-case labels (§1);
// hints reassure in the product's own voice, not generic filler.
const fields = [
  {
    id: "display-name",
    label: "Display name",
    type: "text",
    autoComplete: "name",
    defaultValue: "Abhiram",
  },
  {
    id: "username",
    label: "Username",
    type: "text",
    autoComplete: "username",
    defaultValue: "abhiramrajilan",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    defaultValue: "abhiramrajilan.design@gmail.com",
    hint: "We'll send hearing reminders and filing updates here.",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Create a password",
    hint: "At least 8 characters.",
  },
] as const

function CompleteProfileDialog() {
  return (
    <DialogContent className="gap-0 p-0 sm:max-w-md">
      {/* Left-aligned, quiet header — the system's own modal voice (cf. the payment dialog),
          not a generic centered onboarding badge. */}
      <DialogHeader className="space-y-1.5 p-6 pb-5">
        <DialogTitle className="text-title-s">Complete your profile</DialogTitle>
        <DialogDescription>
          A few details to finish setting up your ON Court account.
        </DialogDescription>
      </DialogHeader>

      <Separator />

      {/* Single column, generous rhythm; label above field, hint in caption below (screen-craft §2). */}
      <form className="p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                defaultValue={"defaultValue" in field ? field.defaultValue : undefined}
                placeholder={"placeholder" in field ? field.placeholder : undefined}
              />
              {"hint" in field && field.hint ? (
                <p className="text-caption text-muted-foreground">{field.hint}</p>
              ) : null}
            </div>
          ))}
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full">
          Save &amp; continue
        </Button>
      </form>
    </DialogContent>
  )
}

export default function ProfileTestPage() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-title-l">Complete your profile</h1>
        <p className="text-body text-muted-foreground">
          Onboarding modal — redesigned from Figma to the Pucar system: sentence
          case, rationed teal, calibrated surfaces, Helvetica.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRoundIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-body font-medium">Complete your profile</div>
            <div className="text-body-compact text-muted-foreground">
              Account setup · 4 fields
            </div>
          </div>
          <div className="ml-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Preview modal</Button>
              </DialogTrigger>
              <CompleteProfileDialog />
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
