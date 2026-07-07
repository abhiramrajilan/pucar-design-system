// AA contrast gate — runs FIRST in `pnpm tokens` and fails the build if any
// semantic foreground/background pair drops below WCAG 2.2 AA, in either theme.
// This is "verify, don't eyeball" as a machine check: a token edit that breaks
// contrast never reaches globals.css or the registry.
//
// Run alone: pnpm gate   (tsx lib/tokens/gate.ts)

import { readFileSync } from "node:fs"
import { ramps } from "./ramps"
import {
  FAMILY_RAMP,
  SOLIDS,
  BRAND_ACCENT,
  SOLID_FOREGROUND,
  SURFACE_SUNKEN,
  SEMANTIC_REFS,
  SOLID_FOREGROUND_TOKENS,
  UTILITY_PRIMITIVES,
  CHART_PALETTE,
} from "./tokens"

type Theme = "light" | "dark"

// ── WCAG relative-luminance contrast ────────────────────────────
const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const srgbToLin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
const relLum = (h: string) => { const [r, g, b] = hexToRgb(h).map(srgbToLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const contrast = (a: string, b: string) => {
  const L1 = relLum(a), L2 = relLum(b)
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
}

// ── Resolve any semantic token to a hex for a given theme ───────
function primitives(theme: Theme): Record<string, string> {
  const o: Record<string, string> = {}
  for (const [role, rampName] of Object.entries(FAMILY_RAMP)) {
    ramps[rampName][theme].forEach((hex, i) => (o[`${role}-${i + 1}`] = hex))
  }
  o["brand-solid"] = SOLIDS.brand[theme]
  o["success-solid"] = SOLIDS.success[theme]
  o["info-solid"] = SOLIDS.info[theme]
  o["destructive-solid"] = SOLIDS.destructive[theme]
  o["brand-accent"] = BRAND_ACCENT
  o["surface-sunken"] = SURFACE_SUNKEN[theme] // tuned per-theme nested-surface fill
  CHART_PALETTE[theme].forEach((hex, i) => (o[`chart-${i + 1}`] = hex))
  return o
}

function resolve(token: string, theme: Theme): string {
  if ((SOLID_FOREGROUND_TOKENS as readonly string[]).includes(token)) return SOLID_FOREGROUND[theme]
  const prim = primitives(theme)
  if (prim[token]) return prim[token]
  const ref = SEMANTIC_REFS[token]
  if (!ref) throw new Error(`gate: unknown token "${token}"`)
  if (ref.startsWith("#")) return ref
  const m = ref.match(/^var\(--([a-z0-9-]+)\)$/)
  if (!m) throw new Error(`gate: cannot resolve "${token}" → "${ref}"`)
  if (m[1] === token) throw new Error(`gate: CYCLE — "${token}" references itself`)
  return resolve(m[1], theme)
}

// ── The contract: [foreground, background, minimum ratio] ───────
// Text pairs need 4.5:1; UI boundaries need 3:1 (WCAG 1.4.11).
const PAIRS: Array<[fg: string, bg: string, min: number, note?: string]> = [
  ["foreground", "background", 4.5],
  ["card-foreground", "card", 4.5],
  ["popover-foreground", "popover", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["secondary-foreground", "secondary", 4.5],
  ["muted-foreground", "muted", 4.5],
  ["muted-foreground", "background", 4.5, "muted text sits on the page too"],
  ["muted-foreground", "surface-sunken", 4.5, "secondary text inside wells"],
  ["accent-foreground", "accent", 4.5, "hover/selected states"],
  ["destructive-foreground", "destructive", 4.5],
  ["success-foreground", "success", 4.5],
  ["info-foreground", "info", 4.5],
  ["warning-foreground", "warning", 4.5],
  ["success-muted-foreground", "success-muted", 4.5, "status chips"],
  ["warning-muted-foreground", "warning-muted", 4.5, "status chips"],
  ["info-muted-foreground", "info-muted", 4.5, "status chips"],
  ["sidebar-foreground", "sidebar", 4.5],
  ["sidebar-primary-foreground", "sidebar-primary", 4.5],
  ["sidebar-accent-foreground", "sidebar-accent", 4.5],
  ["input", "background", 3.0, "field boundary — WCAG 1.4.11"],
]

// ── Run ─────────────────────────────────────────────────────────
// Cycle guard over the whole semantic layer (the brand-accent bug class).
for (const [k, v] of Object.entries(SEMANTIC_REFS)) {
  if (v.includes(`var(--${k})`)) {
    console.error(`✗ CYCLE: SEMANTIC_REFS["${k}"] references var(--${k})`)
    process.exit(1)
  }
}

// ── Mapping completeness — every public token must have a @theme utility mapping.
// The registry derives its cssVars.theme from this same list (build-registry.ts);
// this check keeps the hand-authored @theme inline block in globals.css honest too.
// (The surface-sunken bug class: token emitted, utility mapping silently missing —
// Tailwind v4 drops unknown classes without an error, so only a gate catches it.)
const EXPECTED_COLOR_TOKENS: string[] = [
  ...Object.keys(SEMANTIC_REFS),
  ...SOLID_FOREGROUND_TOKENS,
  ...UTILITY_PRIMITIVES,
  ...[1, 2, 3, 4, 5].map((i) => `chart-${i}`),
]

let mappingFailures = 0
{
  const css = readFileSync("app/globals.css", "utf8")
  const inlineStart = css.indexOf("@theme inline {")
  const inlineEnd = css.indexOf("\n}", inlineStart)
  if (inlineStart === -1 || inlineEnd === -1) {
    console.error("✗ gate: could not find the @theme inline block in app/globals.css")
    process.exit(1)
  }
  const block = css.slice(inlineStart, inlineEnd)
  const mapped = new Map<string, string>() // color token → var target
  for (const m of block.matchAll(/--color-([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)/g)) {
    mapped.set(m[1], m[2])
  }
  const known = new Set([...EXPECTED_COLOR_TOKENS, ...Object.keys(primitives("light"))])
  for (const t of EXPECTED_COLOR_TOKENS) {
    if (!mapped.has(t)) {
      mappingFailures++
      console.error(`✗ @theme inline is missing --color-${t} — bg-${t}/text-${t} will silently not exist.`)
    }
  }
  for (const [t, target] of mapped) {
    if (!known.has(target)) {
      mappingFailures++
      console.error(`✗ @theme inline maps --color-${t} to var(--${target}), which no token emits (stale or typo).`)
    }
  }
}
if (mappingFailures > 0) {
  console.error(`\n✗ Gate failed: ${mappingFailures} utility-mapping problem(s). Fix app/globals.css @theme inline (or tokens.ts) before building.`)
  process.exit(1)
}

let failures = 0
for (const theme of ["light", "dark"] as const) {
  for (const [fg, bg, min, note] of PAIRS) {
    const f = resolve(fg, theme)
    const b = resolve(bg, theme)
    const ratio = contrast(f, b)
    const ok = ratio >= min
    if (!ok) {
      failures++
      console.error(
        `✗ ${theme.padEnd(5)} ${fg} on ${bg}: ${ratio.toFixed(2)}:1 < ${min}:1  (${f} on ${b})${note ? `  — ${note}` : ""}`
      )
    }
  }
}

if (failures > 0) {
  console.error(`\n✗ Gate failed: ${failures} pair(s) below AA. Fix tokens.ts before building.`)
  process.exit(1)
}
console.log(
  `✓ AA gate passed — ${PAIRS.length} pairs × 2 themes, no cycles, ${EXPECTED_COLOR_TOKENS.length} utility mappings complete.`
)
