// Generates public/llms.txt — the AI-consumer index.
//
// DERIVED, not hand-maintained: the previous llms.txt was edited by hand and
// drifted within one release (it advertised a deleted component and knew
// nothing about three token additions). Same design rule as build-registry:
// hand-authored INTENT lives in llms-preamble.md; every CATALOG section below
// is derived from tokens.ts + registry.json, so it cannot lie.
//
// Runs AFTER build-registry in the `pnpm tokens` chain (it reads registry.json).
// CI's drift check covers public/llms.txt like every other generated file.

import { readFileSync, writeFileSync } from "node:fs"
import {
  SEMANTIC_REFS,
  SOLID_FOREGROUND_TOKENS,
  UTILITY_PRIMITIVES,
  TYPE,
  SHADOWS,
  RADIUS,
} from "./tokens"

const preamble = readFileSync("lib/tokens/llms-preamble.md", "utf8").trimEnd()

const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
  homepage: string
  items: Array<{ name: string; type: string; description?: string }>
}
const HOST = registry.homepage

// ── Tokens (grouped for scanning, every name real) ──────────────
const semantic = Object.keys(SEMANTIC_REFS)
const group = (prefix: RegExp) => semantic.filter((t) => prefix.test(t))

const tokenLines = [
  "## Foundations — tokens (source of truth: lib/tokens/tokens.ts → `pnpm tokens`)",
  `- Surfaces: ${group(/^(background|foreground|card|popover|surface)/).join(" · ")}`,
  `- Brand & neutrals: ${group(/^(primary|secondary|muted|accent|sidebar|brand)/).join(" · ")}`,
  `- Status — solids: ${group(/^(success|warning|info|destructive)(-foreground)?$/).join(" · ")}`,
  `- Status — tints: ${group(/-muted(-foreground)?$/).filter((t) => !t.startsWith("brand")).join(" · ")}`,
  `- Status — inks (text/icons on neutral): ${UTILITY_PRIMITIVES.filter((t) => t.endsWith("-ink")).join(" · ")}`,
  `- Structure: ${group(/^(border|input|ring|track|prefilled)$/).join(" · ")} · brand-accent (non-text) · surface-sunken`,
  `- Charts (categorical, never status): chart-1 … chart-5`,
  `- Type scale: ${Object.keys(TYPE).map((t) => `text-${t}`).join(" · ")}`,
  `- Elevation: ${Object.keys(SHADOWS).map((s) => `shadow-${s}`).join(" · ")} (per-theme values) · radius knob ${RADIUS} (rounded-sm/md/lg/xl/full by ROLE)`,
  `- Solid foregrounds flip white→ink in dark: ${SOLID_FOREGROUND_TOKENS.join(" · ")}`,
]

// ── Catalog (from the registry — the same items consumers can install) ──
const ui = registry.items.filter((i) => i.type === "registry:ui").map((i) => i.name)
const rest = registry.items.filter(
  (i) => i.type !== "registry:ui" && !["pucar-theme", "design-rules"].includes(i.name)
)

const catalogLines = [
  `## Components (components/ui/ — ${ui.length} primitives, all registry-installable)`,
  ui.sort().join(" · "),
  "",
  "## Patterns & blocks",
  ...rest.map((i) => `- **${i.name}** (${i.type.replace("registry:", "")}) — ${i.description ?? ""}`.trimEnd()),
]

const installLines = [
  "## Install (self-hosted shadcn registry)",
  `- Theme + utility mappings: \`npx shadcn add ${HOST}/r/pucar-theme.json\``,
  `- Any component, Pucar-themed (deps auto-resolve here): \`npx shadcn add ${HOST}/r/<name>.json\``,
  `- The law as files: \`npx shadcn add ${HOST}/r/design-rules.json\``,
  `- Live gallery: ${HOST}/ · measured token lab: ${HOST}/foundations`,
]

const out = [preamble, "", tokenLines.join("\n"), "", catalogLines.join("\n"), "", installLines.join("\n"), ""].join("\n")

writeFileSync("public/llms.txt", out)
console.log(`✓ Wrote public/llms.txt — ${ui.length} ui items, ${semantic.length} semantic tokens, host ${HOST}`)
