"use client"

import * as React from "react"
import { CalendarClockIcon, CopyIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Banner, BannerAction } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { SessionTimeoutDialog } from "@/components/ui/session-timeout"
import { Stepper, StepperItem } from "@/components/ui/stepper"
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineMeta,
  TimelineTitle,
} from "@/components/ui/timeline"

import { Row, Section } from "./gallery-section"

const policeStations = [
  { value: "ekm-central", label: "Ernakulam Central" },
  { value: "ekm-town-north", label: "Ernakulam Town North" },
  { value: "ekm-town-south", label: "Ernakulam Town South" },
  { value: "fort-kochi", label: "Fort Kochi" },
  { value: "mattancherry", label: "Mattancherry" },
  { value: "palarivattom", label: "Palarivattom" },
  { value: "kalamassery", label: "Kalamassery" },
  { value: "aluva", label: "Aluva" },
]

export function GalleryPatterns() {
  const [station, setStation] = React.useState("")
  const [hearingDate, setHearingDate] = React.useState<Date | undefined>(
    new Date(2026, 7, 12)
  )
  const [timeoutOpen, setTimeoutOpen] = React.useState(false)
  const [secondsLeft, setSecondsLeft] = React.useState(120)

  // Demo countdown — in product the app owns this timer.
  React.useEffect(() => {
    if (!timeoutOpen) return
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [timeoutOpen])

  return (
    <>
      <Section
        title="Case progress — timeline"
        description="The chronology of one matter: past = muted dot, current = brand, future = hollow (screen-craft §5). Not a feed and not an activity log — those are list screens."
      >
        <Timeline className="max-w-lg">
          <TimelineItem status="past">
            <TimelineTitle>Complaint filed</TimelineTitle>
            <TimelineMeta>4 June 2026 · e-filing</TimelineMeta>
          </TimelineItem>
          <TimelineItem status="past">
            <TimelineTitle>Scrutiny cleared</TimelineTitle>
            <TimelineMeta>11 June 2026 · Registry</TimelineMeta>
          </TimelineItem>
          <TimelineItem status="current">
            <TimelineTitle>Cognizance &amp; summons</TimelineTitle>
            <TimelineMeta>Listed 12 August 2026 · JFCM-II, Ernakulam</TimelineMeta>
            <TimelineContent>
              Summons issued to the accused; service report awaited.
            </TimelineContent>
          </TimelineItem>
          <TimelineItem status="future">
            <TimelineTitle>Appearance of accused</TimelineTitle>
          </TimelineItem>
          <TimelineItem status="future">
            <TimelineTitle>Evidence</TimelineTitle>
          </TimelineItem>
        </Timeline>
      </Section>

      <Section
        title="Multi-step flows — stepper"
        description="Every citizen multi-step flow shows where it is (screen-craft §7). Steps are ordered — parallel views of one object are tabs, never this."
      >
        <Stepper className="max-w-2xl">
          <StepperItem step={1} label="Complaint details" status="complete" />
          <StepperItem step={2} label="Parties" status="complete" />
          <StepperItem step={3} label="Documents" status="current" />
          <StepperItem step={4} label="Court fee" status="upcoming" />
          <StepperItem step={5} label="Review & submit" status="upcoming" />
        </Stepper>
      </Section>

      <Section
        title="Session expiry — timeout warning"
        description="WCAG 2.2.1: long court forms must warn before a session ends, with a one-press extend. Timing lives in the app; this is the accessible surface. Staying signed in is the safe action, so it gets the primary."
      >
        <Row>
          <Button
            variant="outline"
            onClick={() => {
              setSecondsLeft(120)
              setTimeoutOpen(true)
            }}
          >
            <CalendarClockIcon />
            Simulate expiry warning
          </Button>
        </Row>
        <SessionTimeoutDialog
          open={timeoutOpen}
          secondsRemaining={secondsLeft}
          onExtend={() => setTimeoutOpen(false)}
          onSignOut={() => setTimeoutOpen(false)}
        />
      </Section>

      <Section
        title="Search a long list — combobox"
        description="One of many, with search — party names, police stations, court lists. ≤5 options stay visible as a radio/toggle group; >5 without search is a plain select."
      >
        <div className="grid max-w-md gap-2">
          <Label htmlFor="station">Police station</Label>
          <Combobox
            id="station"
            options={policeStations}
            value={station}
            onValueChange={setStation}
            placeholder="Select police station"
            searchPlaceholder="Search stations…"
            emptyMessage="No station found."
          />
        </div>
      </Section>

      <Section
        title="Dates in fields — date picker"
        description="A 40px field-shaped trigger echoing the chosen date; the calendar opens in a popover. Known dates users can type (DOB) want segmented text inputs instead."
      >
        <div className="grid max-w-md gap-6">
          <div className="grid gap-2">
            <Label htmlFor="hearing-date">Next hearing</Label>
            <DatePicker
              id="hearing-date"
              value={hearingDate}
              onValueChange={setHearingDate}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cause-window">Cause-list window</Label>
            <DateRangePicker id="cause-window" placeholder="Pick a range" />
          </div>
        </div>
      </Section>

      <Section
        title="Standing notice — banner"
        description="Loads with the page, persists while the condition holds, and is not feedback (Carbon's callout rule). Feedback on an action is an alert or a toast."
      >
        <div className="space-y-3">
          <Banner variant="info">
            <span>
              You are viewing this filing in <strong>read-only</strong> mode while
              scrutiny is in progress.
            </span>
          </Banner>
          <Banner variant="warning">
            <span>Hearing adjourned — next date 14 August 2026.</span>
            <BannerAction>
              <Button variant="ghost" size="sm">
                View order
              </Button>
            </BannerAction>
          </Banner>
        </div>
      </Section>

      <Section
        title="Right-click accelerators — context menu"
        description="Actions on the thing under the cursor, for staff surfaces. Every action here must also exist somewhere visible — right-click is an accelerator, never the only path."
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="flex h-24 max-w-md items-center justify-center rounded-lg border border-dashed text-body-compact text-muted-foreground select-none">
              Right-click this row
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem>
              <PencilIcon />
              Edit field
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <CopyIcon />
              Copy CNR
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              <Trash2Icon />
              Remove flag
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Section>

      <Section
        title="Keyboard keys — kbd"
        description="Documenting shortcuts in menus, palettes, and help. Never the only way a shortcut is discoverable."
      >
        <Row>
          <span className="text-body-compact text-muted-foreground">
            Open the palette with
          </span>
          <span className="inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
          <span className="text-body-compact text-muted-foreground">
            · jump to cause list with
          </span>
          <span className="inline-flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>L</Kbd>
          </span>
        </Row>
      </Section>

      <Section
        title="Active filters — chip row"
        description="Filters echo as removable chips under the toolbar, with the result count always visible (screen-craft §5). Filtered-empty gets its own state with a way out."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              S.138
              <button aria-label="Remove filter Section 138" className="ml-0.5 rounded-full hover:bg-accent-strong">
                <XIcon />
              </button>
            </Badge>
            <Badge variant="outline">
              JFCM-II Ernakulam
              <button aria-label="Remove filter court JFCM-II Ernakulam" className="ml-0.5 rounded-full hover:bg-accent-strong">
                <XIcon />
              </button>
            </Badge>
            <Badge variant="outline">
              Awaiting docs
              <button aria-label="Remove filter awaiting documents" className="ml-0.5 rounded-full hover:bg-accent-strong">
                <XIcon />
              </button>
            </Badge>
            <Button variant="ghost" size="sm">
              Clear all
            </Button>
          </div>
          <p className="text-body-compact text-muted-foreground">14 cases match</p>
        </div>
      </Section>
    </>
  )
}
