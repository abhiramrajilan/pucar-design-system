// Law-lint — mechanizes the conventions the AA gate can't see.
//
// Every rule here was violated in practice before it was mechanized (100+
// instances cleaned on 2026-07-21 alone). The gate proves token PAIRS; this
// proves component/screen code actually USES the tokens: no bare `rounded`,
// no raw neutral steps, no raw Tailwind type sizes, no alpha status/brand
// fills, no off-ladder spacing, no arbitrary pixel type.
//
// Runs first in `pnpm tokens` and as a CI step. Scans components/ and app/.
// The ALLOW list is the ONLY escape hatch — every entry carries its reason,
// and an entry that no longer matches anything fails the build (stale
// allowlist = the violation was fixed; delete the entry).
//
// Run alone: pnpm lawlint   (tsx lib/tokens/law-lint.ts)

import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

type Allow = { file: string; pattern: RegExp; reason: string }

// ── The allowlist — legal exceptions, each with its law citation ────────────
const ALLOW: Allow[] = [
  // Simulated paper documents: scrutiny renders court-order PAPER, not UI
  // chrome. Document typography is deliberately bespoke (DECISIONS 2026-07-21).
  { file: "app/scrutiny/data.tsx", pattern: /text-(sm|base|xl)|text-\[\d+px\]|leading-\[\d+px\]|m[rt]-[57]/, reason: "simulated court-order paper, not UI chrome" },
  // Alpha washes over content that must stay readable through them
  // (design-guidelines §Colour alpha exemption).
  { file: "app/scrutiny/field-span.tsx", pattern: /bg-primary\/15/, reason: "evidence-span highlight over document text" },
  { file: "app/scrutiny/document-viewer.tsx", pattern: /bg-destructive\/10/, reason: "evidence-rect marking over document text" },
  { file: "app/scrutiny/fields-panel.tsx", pattern: /bg-(destructive\/4|primary\/5|warning-muted\/50)/, reason: "row-emphasis washes under dark neutral text (contrast unaffected)" },
  { file: "components/ui/document-slot.tsx", pattern: /bg-primary\/3|border-primary\/50/, reason: "3% drag-affordance wash; dashed boundary defines the slot" },
  // Menu inset alignment: 28px = px-1.5 + 16px icon + gap — the shadcn inset
  // convention, internal to the control (micro-spacing family).
  { file: "components/ui/dropdown-menu.tsx", pattern: /data-inset:pl-7/, reason: "menu inset alignment (icon width + gap)" },
  { file: "components/ui/menubar.tsx", pattern: /data-inset:pl-7/, reason: "menu inset alignment (icon width + gap)" },
  { file: "components/ui/context-menu.tsx", pattern: /data-inset:pl-7/, reason: "menu inset alignment (icon width + gap)" },
]

// ── The rules ───────────────────────────────────────────────────────────────
const RULES: Array<{ name: string; pattern: RegExp; law: string }> = [
  {
    name: "bare-rounded",
    // `rounded` not followed by a dash: a fixed 4px that ignores the radius knob
    pattern: /(?<![\w-])rounded(?![-\w])/,
    law: "radius is assigned by role from the knob (design-guidelines §Elevation & shape); use rounded-sm/md/lg/xl/full",
  },
  {
    name: "raw-neutral-step",
    pattern: /(?<![\w-])(bg|text|border|ring|fill|stroke)-neutral-\d/,
    law: "never pick a raw neutral-N — use the named surface/text tokens (design-guidelines §Colour)",
  },
  {
    name: "raw-type-size",
    pattern: /(?<![\w-])text-(xs|sm|base|lg|xl|2xl|3xl|4xl)(?![\w-])/,
    law: "type comes from the scale: text-caption/body-compact/body/title-s/title/title-l (design-guidelines §Typography)",
  },
  {
    name: "arbitrary-px-type",
    pattern: /(?<![\w-])(text|leading)-\[[\d.]+px\]/,
    law: "no off-scale pixel type — the 12px floor and the ladder are law (DECISIONS 2026-07-21)",
  },
  {
    name: "alpha-status-fill",
    // bg/text of a status or brand hue with an alpha modifier. Rings and
    // borders are exempt by law (focus rings, invalid-state borders).
    pattern: /(?<![\w-])(bg|text)-(primary|success|warning|info|destructive|brand)[\w-]*\/\d+/,
    law: "alpha status/brand fills are banned — contrast depends on the backdrop; use the opaque muted pairs or inks (design-guidelines §Colour)",
  },
  {
    name: "off-ladder-spacing",
    pattern: /(?<![\w-])(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(5|7|9|11)(?![\w.-])/,
    law: "gaps come from the ladder: 1/2/3/4/6/8/12/16 (+0.5/1.5/2.5 inside controls) — screen-craft §1",
  },
]

// ── Scan ────────────────────────────────────────────────────────────────────
function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) yield p
  }
}

// Strip // and /* */ comments so law citations in comments don't trip the rules.
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(?<!:)\/\/[^\n]*/g, "")

let failures = 0
const allowHits = new Set<Allow>()

for (const dir of ["components", "app"]) {
  for (const file of walk(dir)) {
    const raw = readFileSync(file, "utf8")
    const src = stripComments(raw)
    const lines = src.split("\n")
    for (const rule of RULES) {
      lines.forEach((line, i) => {
        const m = line.match(rule.pattern)
        if (!m) return
        const allowed = ALLOW.find((a) => file === a.file && (a.pattern.test(line) || a.pattern.test(m[0])))
        if (allowed) {
          allowHits.add(allowed)
          return
        }
        failures++
        console.error(`✗ ${file}:${i + 1} [${rule.name}] "${m[0]}" — ${rule.law}`)
      })
    }
  }
}

// A stale allowlist entry means the violation was fixed — delete the entry.
for (const a of ALLOW) {
  if (!allowHits.has(a)) {
    failures++
    console.error(`✗ stale allowlist entry (nothing matches anymore): ${a.file} ${a.pattern} — delete it`)
  }
}

if (failures > 0) {
  console.error(`\n✗ Law-lint failed: ${failures} violation(s). The law lives in design-guidelines.md / screen-craft.md.`)
  process.exit(1)
}
console.log(`✓ Law-lint passed — ${RULES.length} rules over components/ + app/, ${ALLOW.length} justified exceptions.`)
