// Generates registry.json from the token source of truth, then `shadcn build`
// compiles it to public/r/*.json for `npx shadcn add <url>`.
// Run: pnpm tokens   (this now runs css + registry + shadcn build in one pass)
//
// IMPORTANT — cssVars.theme is what makes the theme portable. light/dark ship the
// variable VALUES; theme ships the @theme mappings that turn them into Tailwind
// utilities (bg-success, text-title-l, shadow-raised, bg-surface-sunken, …).
// Without it, consumers get the paint but not the names for the paint, and every
// non-stock utility silently resolves to nothing.
//
// DESIGN RULES OF THIS GENERATOR (learned the hard way):
// 1. No hand-maintained inclusion lists. Every list is DERIVED — colour mappings
//    from SEMANTIC_REFS + SOLID_FOREGROUND_TOKENS + UTILITY_PRIMITIVES, ui items
//    from readdirSync(components/ui), deps from each file's actual imports.
// 2. Internal registryDependencies use this registry's own URLs, so consumers get
//    the PUCAR component, not the stock shadcn one with the same name.
// 3. The build refuses to run without a dated CHANGELOG entry — every published
//    registry state is traceable to a release note.

import { writeFileSync, readFileSync, readdirSync } from "node:fs"
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
  FONTS,
  RADIUS,
  TYPE,
  SHADOWS,
} from "./tokens"

type Theme = "light" | "dark"
type Vars = Record<string, string>

// ── Registry identity ───────────────────────────────────────────
// Set this to the real deployed URL (e.g. the Vercel domain) and re-run
// `pnpm tokens` before publishing. Internal registryDependencies are built
// from it, so a wrong value here breaks cross-item installs.
const HOMEPAGE = "https://pucar.example/ui"
const own = (name: string) => `${HOMEPAGE}/r/${name}.json`

// ── Version stamp — refuse to build without a release note ──────
const changelog = readFileSync("CHANGELOG.md", "utf8")
const releaseMatch = changelog.match(/^## (\d{4}-\d{2}-\d{2})/m)
if (!releaseMatch) {
  throw new Error(
    "build-registry: CHANGELOG.md has no dated release entry (## YYYY-MM-DD). Add one describing this change, then rebuild."
  )
}
const RELEASE = releaseMatch[1]

function primitives(theme: Theme): Vars {
  const o: Vars = {}
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

const scales: Vars = {
  "font-sans": FONTS.sans,
  "font-mono": FONTS.mono,
  "font-heading": FONTS.heading,
  radius: RADIUS,
}

// ── cssVars.theme — the Tailwind v4 utility mappings (mirror of @theme inline in globals.css).
// Includes the stock shadcn names too: harmless on a fresh init (idempotent merge), and it
// makes the theme self-sufficient in apps whose template lacks any of them.
const px = (n: number) => `${n / 16}rem`

// Every token that gets a colour utility — ONE derived list, shared with gate.ts's
// completeness check. See UTILITY_PRIMITIVES in tokens.ts for why this is not hand-built.
export const COLOR_UTILITY_TOKENS: string[] = [
  ...Object.keys(SEMANTIC_REFS),
  ...SOLID_FOREGROUND_TOKENS,
  ...UTILITY_PRIMITIVES,
  ...[1, 2, 3, 4, 5].map((i) => `chart-${i}`),
]

const themeVars: Vars = {
  // Every semantic token + utility-facing primitive → colour utility (bg-*/text-*/border-*)
  ...Object.fromEntries(COLOR_UTILITY_TOKENS.map((k) => [`color-${k}`, `var(--${k})`])),

  // Fonts
  "font-heading": "var(--font-heading)",

  // Radius scale — derived from the single --radius knob (matches globals.css)
  "radius-sm": "calc(var(--radius) * 0.6)",
  "radius-md": "calc(var(--radius) * 0.8)",
  "radius-lg": "var(--radius)",
  "radius-xl": "calc(var(--radius) * 1.4)",
  "radius-2xl": "calc(var(--radius) * 1.8)",
  "radius-3xl": "calc(var(--radius) * 2.2)",
  "radius-4xl": "calc(var(--radius) * 2.6)",

  // Type scale (text-caption … text-display) with line-height + weight companions
  ...Object.fromEntries(
    Object.entries(TYPE).flatMap(([name, t]) => {
      const entries: [string, string][] = [
        [`text-${name}`, px(t.size)],
        [`text-${name}--line-height`, px(t.line)],
      ]
      if (t.weight !== 400) entries.push([`text-${name}--font-weight`, String(t.weight)])
      return entries
    })
  ),

  // Elevation
  ...Object.fromEntries(Object.entries(SHADOWS).map(([name, v]) => [`shadow-${name}`, v])),
}

const lightVars: Vars = {
  ...primitives("light"),
  ...SEMANTIC_REFS,
  ...Object.fromEntries(SOLID_FOREGROUND_TOKENS.map((t) => [t, SOLID_FOREGROUND.light])),
  ...scales,
}
const darkVars: Vars = {
  ...primitives("dark"),
  ...Object.fromEntries(SOLID_FOREGROUND_TOKENS.map((t) => [t, SOLID_FOREGROUND.dark])),
}

// ── registry:ui items — one per themed component, deps read from the imports ──
// This ships the CUSTOMIZED components (button's status variants, engineered
// hovers, …). Without it, consumers adding "button" got stock shadcn and the
// entire component layer silently evaporated outside this repo.
const SKIP_PACKAGES = new Set(["react", "react-dom", "next"])

function packageName(spec: string): string {
  const parts = spec.split("/")
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function scanImports(filePath: string) {
  const src = readFileSync(filePath, "utf8")
  const uiDeps = new Set<string>()
  const hookDeps = new Set<string>()
  const npmDeps = new Set<string>()
  for (const m of src.matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1]
    if (spec.startsWith("@/components/ui/")) {
      uiDeps.add(spec.replace("@/components/ui/", ""))
    } else if (spec.startsWith("@/hooks/")) {
      hookDeps.add(spec.replace("@/hooks/", ""))
    } else if (spec.startsWith("@/") || spec.startsWith(".")) {
      // lib/utils (cn) etc — present in every shadcn app after init
    } else {
      const pkg = packageName(spec)
      if (!SKIP_PACKAGES.has(pkg) && !pkg.startsWith("next/")) npmDeps.add(pkg)
    }
  }
  return { uiDeps, hookDeps, npmDeps }
}

const titleCase = (name: string) => {
  const s = name.replace(/-/g, " ")
  return s.charAt(0).toUpperCase() + s.slice(1) // sentence case — design law
}

const uiFiles = readdirSync("components/ui").filter((f) => f.endsWith(".tsx"))
const hookItems = new Map<string, object>()

const uiItems = uiFiles.map((file) => {
  const name = file.replace(/\.tsx$/, "")
  const { uiDeps, hookDeps, npmDeps } = scanImports(`components/ui/${file}`)
  uiDeps.delete(name)

  for (const hook of hookDeps) {
    hookItems.set(hook, {
      name: hook,
      type: "registry:hook",
      title: titleCase(hook),
      files: [{ path: `hooks/${hook}.ts`, type: "registry:hook" }],
    })
  }

  return {
    name,
    type: "registry:ui",
    title: titleCase(name),
    description: `Pucar-themed ${titleCase(name).toLowerCase()} (release ${RELEASE}).`,
    files: [{ path: `components/ui/${file}`, type: "registry:ui" }],
    ...(npmDeps.size ? { dependencies: [...npmDeps].sort() } : {}),
    registryDependencies: [
      own("pucar-theme"),
      ...[...uiDeps].sort().map(own),
      ...[...hookDeps].sort().map(own),
    ],
  }
})

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "pucar",
  homepage: HOMEPAGE,
  items: [
    {
      name: "design-rules",
      type: "registry:item",
      title: "Design rules (law + craft)",
      description:
        `The two files that govern designing with Pucar: design-guidelines.md (the law — teal rationing, sentence case, AA, colour semantics) and screen-craft.md (the craft — spacing ladder, scaffolds, hierarchy, UX patterns, states, review pass). Installed into the consumer repo root so humans and AI sessions there inherit the rules. Release ${RELEASE}.`,
      files: [
        { path: "design-guidelines.md", type: "registry:file", target: "design-guidelines.md" },
        { path: "screen-craft.md", type: "registry:file", target: "screen-craft.md" },
      ],
    },
    {
      name: "pucar-theme",
      type: "registry:style",
      title: "Pucar theme",
      description:
        `Pucar · ON Court design tokens — colour, type, spacing, radius, elevation (light + dark, WCAG 2.2 AA). Ships the full @theme utility mappings (status colours, surfaces, type scale, shadows), so custom utilities work in consumer apps. Pulls in design-rules (guidelines + screen-craft) so the rules travel with the tokens. Release ${RELEASE}.`,
      cssVars: { theme: themeVars, light: lightVars, dark: darkVars },
      registryDependencies: [own("design-rules")],
    },
    ...uiItems,
    ...hookItems.values(),
    {
      name: "status-pill",
      type: "registry:component",
      title: "Status pill",
      description: "Rounded-full status chip (AA-safe, sentence case).",
      files: [{ path: "components/status-pill.tsx", type: "registry:component" }],
      registryDependencies: [own("pucar-theme")],
    },
    {
      name: "site-shell",
      type: "registry:component",
      title: "App shell",
      description:
        "Pucar app frame — sidebar (grouped nav + user block) + top bar. Blocks (case-dashboard, new-case-form) are designed to render inside this shell — add it first and wrap your pages with it (plus the theme provider).",
      files: [
        { path: "components/site-shell.tsx", type: "registry:component" },
        { path: "components/theme-toggle.tsx", type: "registry:component" },
        { path: "components/theme-provider.tsx", type: "registry:component" },
      ],
      registryDependencies: [own("pucar-theme"), own("button"), own("avatar")],
    },
    {
      name: "case-dashboard",
      type: "registry:block",
      title: "Case dashboard",
      description:
        "ON Court dashboard — stat cards, filings chart, share-of-docket, today's hearings. Expects to render inside site-shell.",
      files: [
        { path: "app/(shell)/dashboard/page.tsx", type: "registry:page", target: "app/dashboard/page.tsx" },
      ],
      registryDependencies: [
        own("pucar-theme"), own("status-pill"), own("card"), own("table"), own("chart"), own("button"),
      ],
    },
    {
      name: "new-case-form",
      type: "registry:block",
      title: "New case form",
      description:
        "ON Court intake — sectioned multi-field complaint form. Expects to render inside site-shell.",
      files: [
        { path: "app/(shell)/settings/page.tsx", type: "registry:page", target: "app/new-case/page.tsx" },
      ],
      registryDependencies: [
        "pucar-theme", "card", "input", "select", "checkbox",
        "radio-group", "switch", "textarea", "separator", "button", "label",
      ].map(own),
    },
  ],
}

writeFileSync("registry.json", JSON.stringify(registry, null, 2))
console.log(
  `✓ Wrote registry.json — release ${RELEASE}, ${registry.items.length} items (${uiItems.length} ui), ${Object.keys(themeVars).length} theme mappings.`
)
