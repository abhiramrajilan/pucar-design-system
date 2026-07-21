"use client"

import * as React from "react"
import { CheckIcon, TriangleAlertIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BOUNDARY_PAIRS,
  FAMILIES,
  SEPARATION_PAIRS,
  STEPS,
  TEXT_PAIRS,
  contrast,
  useTokenMeasurement,
  type Rgb,
} from "./token-audit"

// Class names are written out in full — Tailwind scans source for literal
// strings, so `text-${name}` would generate nothing.
const TYPE_SCALE = [
  ["text-display", "48 / 56 · 600"],
  ["text-display-s", "40 / 48 · 600"],
  ["text-title-l", "32 / 40 · 600"],
  ["text-title", "24 / 32 · 600"],
  ["text-title-s", "20 / 28 · 600"],
  ["text-body", "16 / 24 · 400"],
  ["text-body-compact", "14 / 20 · 400 — staff data only"],
  ["text-caption", "12 / 16 · 500"],
] as const

const RADIUS_SCALE = [
  ["rounded-sm", "sm"],
  ["rounded-md", "md"],
  ["rounded-lg", "lg — the 10px knob"],
  ["rounded-xl", "xl"],
  ["rounded-4xl", "4xl — pills"],
] as const

const SPACING_LADDER = [
  ["1", 4, "icon ↔ its text"],
  ["2", 8, "label ↔ its field"],
  ["3", 12, "buttons in a row"],
  ["4", 16, "field ↔ field"],
  ["6", 24, "card ↔ card · card padding"],
  ["8", 32, "section ↔ section (staff)"],
  ["12", 48, "section ↔ section (citizen)"],
  ["16", 64, "major page break"],
] as const

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-title-s">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-body-compact text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        {children}
      </div>
    </section>
  )
}

function Verdict({ ratio, floor }: { ratio: number; floor: number }) {
  const passes = ratio >= floor
  return (
    <span
      className={
        passes
          ? "inline-flex items-center gap-1.5 text-body-compact font-medium text-success-muted-foreground"
          : "inline-flex items-center gap-1.5 text-body-compact font-medium text-destructive-muted-foreground"
      }
    >
      {passes ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <TriangleAlertIcon className="size-3.5" />
      )}
      {passes ? "Pass" : "Fail"}
    </span>
  )
}

function ContrastTable({
  pairs,
  floor,
  resolved,
  sample,
}: {
  pairs: readonly (readonly [string, string, string])[]
  floor: number
  resolved: Record<string, Rgb>
  sample: "text" | "boundary"
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[38%]">Pair</TableHead>
          <TableHead>Sample</TableHead>
          <TableHead className="text-right tabular-nums">Ratio</TableHead>
          <TableHead className="w-24 text-right">
            AA {floor.toFixed(1)}:1
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pairs.map(([label, fg, bg]) => {
          const a = resolved[fg]
          const b = resolved[bg]
          const ratio = a && b ? contrast(a, b) : null
          return (
            <TableRow key={label}>
              <TableCell>
                <div className="font-medium">{label}</div>
                <div className="font-mono text-caption text-muted-foreground">
                  {fg} on {bg}
                </div>
              </TableCell>
              <TableCell>
                {sample === "text" ? (
                  <span
                    className="inline-flex items-center rounded-md px-2.5 py-1 text-body-compact font-medium"
                    style={{
                      backgroundColor: `var(${bg})`,
                      color: `var(${fg})`,
                    }}
                  >
                    Section 138
                  </span>
                ) : (
                  <span
                    className="inline-block h-7 w-24 rounded-md"
                    style={{
                      backgroundColor: `var(${bg})`,
                      boxShadow: `inset 0 0 0 2px var(${fg})`,
                    }}
                  />
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {ratio ? `${ratio.toFixed(2)}:1` : "—"}
              </TableCell>
              <TableCell className="text-right">
                {ratio ? <Verdict ratio={ratio} floor={floor} /> : null}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default function FoundationsPage() {
  const { theme: themeKey, resolved, values } = useTokenMeasurement()

  const failures = React.useMemo(() => {
    let count = 0
    for (const [, fg, bg] of TEXT_PAIRS) {
      const a = resolved[fg]
      const b = resolved[bg]
      if (a && b && contrast(a, b) < 4.5) count++
    }
    for (const [, fg, bg] of BOUNDARY_PAIRS) {
      const a = resolved[fg]
      const b = resolved[bg]
      if (a && b && contrast(a, b) < 3) count++
    }
    return count
  }, [resolved])

  const measured = Object.keys(resolved).length > 0

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <header className="space-y-3">
        <div className="space-y-1.5">
          <h1 className="text-title-l">Foundations</h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            The token laboratory. Every value below is read back from the
            browser after it has resolved, so this page measures what actually
            rendered — not what the source file intended. Flip the theme in the
            header and every ratio re-measures.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {themeKey}
          </Badge>
          {measured ? (
            failures === 0 ? (
              <Badge variant="success">
                <CheckIcon />
                {TEXT_PAIRS.length + BOUNDARY_PAIRS.length} pairs clear AA
              </Badge>
            ) : (
              <Badge variant="destructive">
                <TriangleAlertIcon />
                {failures} pair{failures === 1 ? "" : "s"} below AA
              </Badge>
            )
          ) : (
            <Badge variant="secondary">Measuring…</Badge>
          )}
        </div>
      </header>

      <Section
        title="Text pairs — the 4.5:1 floor"
        description="Every foreground/background combination the system ships, measured live. A failure here is a bug in tokens.ts, not a styling opinion."
      >
        <ContrastTable
          pairs={TEXT_PAIRS}
          floor={4.5}
          resolved={resolved}
          sample="text"
        />
      </Section>

      <Section
        title="Boundaries — the 3:1 floor"
        description="Non-text contrast (WCAG 1.4.11) — the boundaries a user needs in order to identify a control. Decorative hairlines and surface fills are exempt and are measured separately below."
      >
        <ContrastTable
          pairs={BOUNDARY_PAIRS}
          floor={3}
          resolved={resolved}
          sample="boundary"
        />
      </Section>

      <Section
        title="Separation — measured, not graded"
        description="Large-area fills and dividers are exempt from WCAG's contrast floors, so there is no pass/fail here. The standard is the design law's own promise: a sunken well must separate on a card on its own, with no border. Squint at these — if a fill disappears, the token is too weak regardless of its number."
      >
        <div className="space-y-4">
          {SEPARATION_PAIRS.map(([label, fill, base]) => {
            const a = resolved[fill]
            const b = resolved[base]
            const ratio = a && b ? contrast(a, b) : null
            return (
              <div
                key={label}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
                style={{ backgroundColor: `var(${base})` }}
              >
                <div className="min-w-0">
                  <div className="text-body-compact font-medium">{label}</div>
                  <div className="font-mono text-caption text-muted-foreground">
                    {fill} on {base}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-40 rounded-md"
                    style={{ backgroundColor: `var(${fill})` }}
                  />
                  <span className="w-16 text-right text-body-compact tabular-nums text-muted-foreground">
                    {ratio ? `${ratio.toFixed(2)}:1` : "—"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section
        title="Status — three treatments per hue"
        description="The whole status vocabulary: solid (the one strong action), tint (chips, callouts, flagged rows), ink (text and icons on neutral). The solid is never a text colour; the ink is never a fill; no treatment is an alpha mix."
      >
        <div className="space-y-4">
          {(
            [
              ["Success", "--success", "--success-foreground", "--success-muted", "--success-muted-foreground", "--success-ink", "Fee paid"],
              ["Warning", "--warning", "--warning-foreground", "--warning-muted", "--warning-muted-foreground", "--warning-ink", "Awaiting documents"],
              ["Info", "--info", "--info-foreground", "--info-muted", "--info-muted-foreground", "--info-ink", "Under hearing"],
              ["Destructive", "--destructive", "--destructive-foreground", "--destructive-muted", "--destructive-muted-foreground", "--destructive-ink", "Cheque dishonoured"],
            ] as const
          ).map(([hue, solid, solidFg, tint, tintFg, ink, label]) => (
            <div key={hue} className="grid items-center gap-3 sm:grid-cols-[6rem_1fr_1fr_1fr]">
              <div className="text-body-compact font-medium">{hue}</div>
              <span
                className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-body-compact font-medium"
                style={{ backgroundColor: `var(${solid})`, color: `var(${solidFg})` }}
              >
                Solid — action
              </span>
              <span
                className="inline-flex h-6 w-fit items-center rounded-full px-2.5 text-caption"
                style={{ backgroundColor: `var(${tint})`, color: `var(${tintFg})` }}
              >
                Tint — {label}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-body-compact font-medium"
                style={{ color: `var(${ink})` }}
              >
                <span aria-hidden>●</span> Ink — {label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Colour ramps"
        description="Twelve functional steps per family. 1–2 backgrounds · 3–5 components · 6–8 borders · 9–10 solids · 11–12 text. Values shown are what the current theme resolved to."
      >
        <div className="space-y-6">
          {FAMILIES.map((family) => (
            <div key={family} className="space-y-2">
              <div className="text-body-compact font-medium capitalize">
                {family}
              </div>
              <div className="grid grid-cols-6 gap-2 lg:grid-cols-12">
                {STEPS.map((step) => {
                  const name = `--${family}-${step}`
                  return (
                    <div key={step} className="space-y-1">
                      <div
                        className="h-12 rounded-md ring-1 ring-inset ring-foreground/10"
                        style={{ backgroundColor: `var(${name})` }}
                      />
                      <div className="text-center text-caption tabular-nums text-muted-foreground">
                        {step}
                      </div>
                      <div className="truncate text-center font-mono text-caption text-muted-foreground/70">
                        {values[name] ?? ""}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Surface hierarchy"
        description="Depth is fill, not repeated borders. The card keeps the one hairline; the well inside it separates on fill alone. Structural greys (sunken, track) sit stronger than interactive greys (accent)."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="text-body-compact font-medium">Nesting, correct</div>
            <div className="rounded-xl border bg-card p-6">
              <div className="text-body font-medium">Complaint documents</div>
              <p className="mt-1 text-body-compact text-muted-foreground">
                Card — one hairline, flat by default.
              </p>
              <div className="mt-4 rounded-lg bg-surface-sunken p-4">
                <div className="text-body-compact font-medium">
                  Cheque return memo
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  Sunken well — no border of its own. It separates on fill.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-body-compact font-medium">
              The grey ladder, in job order
            </div>
            <div className="space-y-2 rounded-xl border bg-card p-6">
              {(
                [
                  ["background", "--background", "page base"],
                  ["muted", "--muted", "quiet washes — sidebar, de-emphasis"],
                  ["surface-sunken", "--surface-sunken", "nested wells — tuned 2½"],
                  ["accent", "--accent", "hover (white/transparent-rest controls)"],
                  ["accent-strong", "--accent-strong", "engaged — hover on grey, pressed, expanded"],
                  ["track", "--track", "recessed control tracks — darkest fill"],
                  ["border", "--border", "hairline"],
                ] as const
              ).map(([label, token, job]) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="size-10 shrink-0 rounded-md ring-1 ring-inset ring-foreground/10"
                    style={{ backgroundColor: `var(${token})` }}
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-body-compact">{label}</div>
                    <div className="text-caption text-muted-foreground">
                      {job}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Type scale"
        description="Major third, base 16, line-heights snapped to the 8px grid. Sentence case everywhere; no weight below 400 ever ships."
      >
        <div className="space-y-6">
          {TYPE_SCALE.map(([cls, spec]) => (
            <div key={cls} className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="text-caption text-muted-foreground">{cls}</code>
                <span className="text-caption text-muted-foreground">
                  {spec}
                </span>
              </div>
              <div className={cls}>Hearing listed for 12 August</div>
            </div>
          ))}
          <Separator />
          <div className="space-y-2">
            <div className="text-caption text-muted-foreground">
              Monospace — identifiers and amounts
            </div>
            <div className="font-mono text-body">
              KLER01-000234-2026 · ₹4,50,000
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Radius, elevation, and the spacing ladder"
        description="One system radius (10px) and its derived scale. Elevation is semantic depth, never decoration. Gaps come only from the ladder."
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="text-body-compact font-medium">Radius</div>
            <div className="flex flex-wrap gap-4">
              {RADIUS_SCALE.map(([cls, label]) => (
                <div key={cls} className="space-y-1.5">
                  <div className={`size-16 border bg-surface-sunken ${cls}`} />
                  <div className="text-center text-caption text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-body-compact font-medium">Elevation</div>
            <div className="flex flex-wrap gap-6">
              {(
                [
                  ["flat", "", "page-level content"],
                  ["raised", "shadow-raised", "genuine lift above the page"],
                  ["overlay", "shadow-overlay", "popovers, dropdowns"],
                  ["modal", "shadow-modal", "dialogs"],
                ] as const
              ).map(([label, cls, job]) => (
                <div key={label} className="space-y-2">
                  <div
                    className={`flex size-24 items-center justify-center rounded-xl border bg-card text-caption text-muted-foreground ${cls}`}
                  >
                    {label}
                  </div>
                  <div className="max-w-24 text-caption text-muted-foreground">
                    {job}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-body-compact font-medium">Spacing ladder</div>
            <div className="space-y-2">
              {SPACING_LADDER.map(([step, px, job]) => (
                <div key={step} className="flex items-center gap-4">
                  <code className="w-16 shrink-0 text-caption text-muted-foreground">
                    gap-{step}
                  </code>
                  <div
                    className="h-4 shrink-0 rounded-sm bg-brand-accent"
                    style={{ width: px }}
                  />
                  <span className="w-12 shrink-0 text-caption tabular-nums text-muted-foreground">
                    {px}px
                  </span>
                  <span className="text-body-compact text-muted-foreground">
                    {job}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Interaction states"
        description="Hover, focus, and disabled must survive a cheap monitor. Tab through this block — the teal ring should be unmistakable on every control."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-body-compact font-medium">
              Buttons — hover them, then tab through them
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-body-compact font-medium">
              Fields — boundary, focus ring, and the prefilled fill
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input placeholder="Empty field" aria-label="Empty field" />
              <Input
                defaultValue="Suresh Kumar"
                aria-label="Filled field"
              />
              <Input
                defaultValue="KLER01-000234-2026"
                aria-label="Machine-prefilled field"
                className="bg-prefilled font-mono"
              />
            </div>
            <p className="text-caption text-muted-foreground">
              The third field is machine-prefilled and human-unverified — amber
              fill only; the boundary stays neutral because no amber step clears
              3:1 without going brown.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-body-compact font-medium">
              Selection vs hover — the 2026-07-21 ruling
            </div>
            <div className="grid gap-2 sm:max-w-sm">
              <div className="rounded-md bg-sidebar-accent px-3 py-2 text-body-compact font-medium text-sidebar-accent-foreground">
                Selected — persistent location, brand tint
              </div>
              <div className="rounded-md bg-accent px-3 py-2 text-body-compact font-medium text-accent-foreground">
                Hover — transient feedback, grey accent
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
