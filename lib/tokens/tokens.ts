// Tier 2/3 design decisions — the single source of truth for Pucar · ON Court (Rajini 2.0).
// Edit values here, then run `pnpm tokens` to regenerate app/tokens.css.
// Contrast values proven in Foundations rev 3 (WCAG 2.1/2.2 AA).

import type { RampName } from "./ramps"

// ── Neutral anchor ──────────────────────────────────────────────
// "sand" = warm (doc default) · "slate" = cool (your #8b8d98 reference) · "gray" = true neutral.
export const NEUTRAL: RampName = "slate"

// Role → source ramp. Neutral is swappable above; chromatic roles are fixed.
export const FAMILY_RAMP: Record<string, RampName> = {
  neutral: NEUTRAL,
  brand: "teal",
  success: "grass", // warmer green — separated from the teal brand (ΔE≈8 vs ≈5 for Radix Green)
  info: "blue",
  warning: "amber",
  destructive: "red",
}

// ── AA-tuned solids (engineered 9–10 override; not raw Radix steps) ──
// Light: darker fill carries WHITE text. Dark: brighter fill carries INK text.
export const SOLIDS: Record<"brand" | "success" | "info" | "destructive", { light: string; dark: string }> = {
  brand: { light: "#007E7E", dark: "#0eb39e" }, // 4.90:1 white / brighter dark teal + ink so it doesn't read faint
  success: { light: "#217a3a", dark: "#46a758" }, // grass · 5.37:1 white / 6.53:1 ink
  info: { light: "#0d74ce", dark: "#3b9eff" }, // 4.77:1 / 6.57:1
  destructive: { light: "#c1232a", dark: "#ec5d5e" }, // 5.93:1 / 5.57:1
}

// Warning is dark-text-only in BOTH themes (amber-9 fill + ink label).
export const WARNING_FOREGROUND = "#3d2000"
// Bright chromatic teal for NON-text moments only (mark, chart lines, active underlines, tints).
export const BRAND_ACCENT = "#12a594"
// Foreground on solids: white in light, near-black ink in dark.
export const SOLID_FOREGROUND = { light: "#ffffff", dark: "#0a0a0a" }

// Nested-surface fill — a TUNED step between neutral-2 and neutral-3 (the "missing" surface step the
// ramp lacks). Separates from a white card on its own (no border) yet stays softer than neutral-3.
// This is the systemic answer to the recurring "too weak / too heavy / box-in-box" grey problem.
export const SURFACE_SUNKEN = { light: "#f4f4f7", dark: "#1d1e21" }

// Categorical data-viz palette — chosen for MUTUAL DISTINCTION, not status meaning.
// (Charts shouldn't borrow success/warning semantics — Foundations §chart tension.)
// teal · blue · violet · amber · rose. Dark = brighter siblings.
export const CHART_PALETTE = {
  light: ["#007E7E", "#0d74ce", "#6e56cf", "#e2a336", "#e93d82"],
  dark: ["#0eb39e", "#3b9eff", "#9e8cff", "#ffce6a", "#ff8dab"],
}

// ── Scales ──────────────────────────────────────────────────────
// Typeface: system-font stack led by Helvetica Neue — zero download (best for low-network),
// native feel. Malayalam falls back to the OS script font (bundle Noto Sans Malayalam later).
export const FONTS = {
  sans: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  heading: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
}

export const RADIUS = "0.625rem" // 10px — single knob driving the radius scale

// Spacing: the 4px grid / 8px rhythm IS Tailwind's default spacing scale (p-4 = 16px …).
// We deliberately do not ship custom spacing tokens — earlier --sp-* vars were emitted but
// mapped to nothing, so editing them changed nothing (false leverage). The grid is design
// law (design-guidelines.md §Spacing), enforced by convention, not by a token.

// Elevation — neutral low-opacity black. Level = semantic depth, never decoration.
export const SHADOWS: Record<string, string> = {
  raised: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.07)",
  overlay: "0 4px 8px -2px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  modal: "0 16px 32px -8px rgb(0 0 0 / 0.18), 0 6px 12px -6px rgb(0 0 0 / 0.12)",
}

// Type scale — major third (1.250), base 16, rounded to even, 25→24 locked.
// [size, lineHeight, weight] in px. Line-heights snap to the 8px grid.
export const TYPE: Record<string, { size: number; line: number; weight: number }> = {
  display: { size: 48, line: 56, weight: 600 },
  "display-s": { size: 40, line: 48, weight: 600 },
  "title-l": { size: 32, line: 40, weight: 600 },
  title: { size: 24, line: 32, weight: 600 },
  "title-s": { size: 20, line: 28, weight: 600 },
  body: { size: 16, line: 24, weight: 400 },
  "body-compact": { size: 14, line: 20, weight: 400 }, // off-scale, opt-in (dense staff data)
  caption: { size: 12, line: 16, weight: 500 }, // floor raised to 500
}

// ── Semantic mapping (Tier 2 — the frozen shadcn public API) ────
// Theme-independent tokens: reference primitive steps via var(); the step vars flip per theme.
export const SEMANTIC_REFS: Record<string, string> = {
  background: "var(--neutral-1)",
  foreground: "var(--neutral-12)",
  card: "var(--neutral-1)",
  "card-foreground": "var(--neutral-12)",
  popover: "var(--neutral-1)",
  "popover-foreground": "var(--neutral-12)",

  // Structural depth vocabulary — name the surface role so components never pick raw neutral-N by eye.
  // (muted = content de-emphasis; surface-* = structural depth. Same value today, free to diverge later.)
  surface: "var(--neutral-1)", // structural base (page)
  "surface-raised": "var(--neutral-1)", // card / small box — lifted by border + shadow, not fill
  // surface-sunken is a TUNED value (between neutral-2 and 3) — see SURFACE_SUNKEN below. It separates
  // on a white card on its own (no border) without reading as heavy as neutral-3. Emitted per-theme.
  track: "var(--neutral-4)", // recessed control tracks (tabs list, progress, slider) — a white/teal active must pop

  primary: "var(--brand-solid)",
  secondary: "var(--neutral-3)",
  "secondary-foreground": "var(--neutral-11)",
  muted: "var(--neutral-2)",
  "muted-foreground": "var(--neutral-11)",
  accent: "var(--neutral-3)", // interaction highlight (hover/selected) — light & calm; interactive greys stay LIGHTER than structural (track/sunken)
  "accent-foreground": "var(--neutral-12)",

  destructive: "var(--destructive-solid)",
  success: "var(--success-solid)",
  info: "var(--info-solid)",
  warning: "var(--warning-9)",
  "warning-foreground": WARNING_FOREGROUND,

  "success-muted": "var(--success-3)",
  "success-muted-foreground": "var(--success-11)",
  "warning-muted": "var(--warning-3)",
  "warning-muted-foreground": "var(--warning-12)", // step-11 = 4.25:1 on the tint (fails); step-12 clears AA
  "info-muted": "var(--info-3)",
  "info-muted-foreground": "var(--info-12)", // step-11 = 4.25:1 on the tint (fails); step-12 clears AA

  border: "var(--neutral-7)",
  input: "var(--neutral-9)", // field boundary needs 3:1 (WCAG 1.4.11); neutral-8 was 1.86:1
  ring: "var(--brand-solid)",


  sidebar: "var(--neutral-2)",
  "sidebar-foreground": "var(--neutral-12)",
  "sidebar-primary": "var(--brand-solid)",
  "sidebar-accent": "var(--neutral-3)",
  "sidebar-accent-foreground": "var(--neutral-12)",
  "sidebar-border": "var(--neutral-5)",
  "sidebar-ring": "var(--brand-solid)",

  // NOTE: --brand-accent is emitted as a Tier-1 primitive (BRAND_ACCENT above).
  // It must NOT appear here — `"brand-accent": "var(--brand-accent)"` created a
  // self-referential cycle that invalidated the token in light mode.
}

// ── Utility-facing primitives ───────────────────────────────────
// Tier-1 primitives that are part of the PUBLIC utility API (bg-brand-accent,
// bg-surface-sunken, …). They are emitted per-theme as primitives, but consumers
// still need a `--color-*` @theme mapping for them. This list is the SINGLE
// source of truth for those mappings — build-registry.ts derives cssVars.theme
// from it and gate.ts asserts globals.css agrees. Never hand-append a primitive
// to a mapping list in a generator again: `surface-sunken` was silently missing
// from the registry because "brand-accent" was hand-appended and it wasn't.
export const UTILITY_PRIMITIVES = ["brand-accent", "surface-sunken"] as const

// Foregrounds that flip white (light) → ink (dark). Only these need a .dark override;
// everything else auto-flips because the primitive step vars are redefined in .dark.
export const SOLID_FOREGROUND_TOKENS = [
  "primary-foreground",
  "destructive-foreground",
  "success-foreground",
  "info-foreground",
  "sidebar-primary-foreground",
] as const
