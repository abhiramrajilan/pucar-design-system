# Changelog

All user-visible changes to the Pucar · ON Court design system. Newest first.
Releases are dated (calver, stamped into the registry as `version`). Breaking
changes get an entry in **Migrations** below, in the same PR.

## Migrations (breaking changes)

- **2026-07-21 — `status-pill` removed; merged into `badge`.** Map the old
  `tone` prop to Badge's `variant`: `ready` → `success`, `waiting` → `warning`,
  `urgent` → `destructive`, `info` → `info`, `neutral` → `secondary`. Anatomy
  changed 20px→24px pill; alpha `bg-destructive/10` styling replaced by the
  opaque `destructive-muted` pair.
- **2026-07-21 — `Button` secondary lost its border; soft `destructive` variant
  now escalates to the solid pair on hover.** No API change; visual only.

## 2026-07-21

### Added (mechanized law + eight components — Tracks 3 & 4, same day)
- **Law-lint** (`pnpm lawlint`, in `pnpm tokens` + CI): six mechanical rules — bare `rounded`, raw `neutral-N`, raw Tailwind type sizes, arbitrary pixel type, alpha status/brand fills, off-ladder spacing — with a justified allowlist that fails when stale. Calibration itself caught and fixed 20+ live violations.
- **Visual regression** (`pnpm test:visual`): Playwright screenshots of the gallery, foundations, and dashboard — light + dark × desktop + mobile — against committed baselines; CI job bootstraps linux baselines as an artifact on first run.
- **Gate now asserts `cn()` knows the type scale** (the tailwind-merge silent-drop bug class) and the registry carries a calver `version`; breaking changes get a **Migrations** section (started with the chip merge). Pre-commit hook at `.githooks/` runs gate + law-lint.
- **Eight new components**, each with usage law + gallery section: `timeline` (case chronology — the law referenced it before it existed), `session-timeout` (the open WCAG 2.2.1 item), `stepper` (multi-step flows), `combobox` (search-a-long-list), `date-picker` (+range), `banner` (standing notices — scrutiny's hand-rolled one replaced), `context-menu`, `kbd`.
- **Filter-chip row pattern** demonstrated in the gallery (removable chips + visible result count).

### Added (usage + motion law — Track 2, same day)
- **component-usage.md** — the third law doc: when/how to use each of the 48 components (job · use when · don't use → instead · variant meanings) plus decision trees for actions, feedback, containers, overlays, and navigation. Grammar grounded in GOV.UK, USWDS, and Carbon.
- **Usage comments on all 48 primitives** — every `components/ui/*` file now opens with its distilled rule (39 added; the rest already complied).
- **Motion law** (design-guidelines §Motion) — feedback-only motion, 100–150ms micro / 200–250ms surfaces, ≤300ms always, ease-out in / ease-in out; `prefers-reduced-motion` collapses all animation globally in globals.css (WCAG 2.3.3).
- **Portable agent skill** — `.claude/skills/pucar-design/SKILL.md`; ships with `design-rules` alongside component-usage.md, so consumer repos' AI sessions inherit the law automatically.
- **Gallery captions** now carry the when/when-not rule for their section; `llms.txt` preamble points at the usage law.

### Changed (grey refinement II, same day)
- **Command input**: transparent with bottom hairline (Spotlight pattern) — the `bg-input/30` grey slab is gone; focus tints the underline teal.
- **Secondary button**: fill-only (border removed — that's outline's job) with a full-strength label (`secondary-foreground` → neutral-12). No longer confusable with disabled.
- **Pressed/selected toggles carry the brand tint** (`brand-muted` pair) instead of grey — chosen ≠ hovered ≠ disabled.
- **One ink per hue**: all `*-muted-foreground` tokens alias the engineered inks — info/warning chips drop navy/brown step-12 for vivid AA amber/blue, matching success/destructive.

### Added (colour-refinement release, same day)
- **Status inks** — `success-ink` / `warning-ink` / `info-ink` / `destructive-ink`: engineered per-theme text/icon colours for status on neutral surfaces, AA-proven on the page AND inside wells (warning and info are tuned; raw ambers/blues missed). The rule: solid = fill, tint = chips/callouts, ink = text. Solids are never text colours.
- **`brand-muted` / `brand-muted-foreground`** — the engineered brand-tint pair as a public token (identity tiles, monograms); replaces every hand-mixed `bg-primary/10`.
- **`accent-strong`** — interactive grey one step past `accent` (hover on grey-rest controls, pressed toggles, expanded triggers). `track` moves neutral-4 → neutral-5. New law: interaction always moves one step down the ladder.
- **Foundations lab**: "Status — three treatments per hue" panel; audit grows to 31 live pairs; grey ladder display updated.

### Changed (colour-refinement release)
- **Alpha status/brand fills are banned** (focus rings, shadows, and read-through washes exempt) — every tint that carries text is an opaque gate-verified pair. Refitted: button `destructive` (now tint at rest, ESCALATES to the solid pair on hover), `destructive-ghost`, dropdown/menubar destructive items, badge link-hovers, avatar/icon tiles across all screens.
- **Primary button hover was below AA** — `bg-primary/90` composited to 4.12:1 in light; now an in-hue color-mix darken like every other solid.
- **Secondary button hover was invisible** (`secondary` == `accent` == neutral-3); now hovers to `accent-strong`. Toggle hover/pressed were both `muted`; now `accent` / `accent-strong`.
- **Alert destructive** drops the red-wall description (`text-destructive/90` alpha ink) — title+icon carry the status ink, description is muted.
- **Type tokens everywhere in primitives** — 77 raw `text-sm/xs/base/[0.8rem]` swapped for `text-body-compact`/`text-caption`/`text-body` (identical metrics; captions gain the law's 500 floor).

### Fixed (colour-refinement release)
- **Registry never emitted `--brand-tint-foreground`** — consumer apps installing pucar-theme got `var(undefined)` for sidebar selection text. Now emitted per theme.
- **Calendar month-dropdown hydration mismatch** — server/client ICU disagree on short month names ("Sep"/"Sept"); fixed month list is deterministic.

### Added (later the same day — shape & metrics release)
- **Foundations page (`/foundations`)** — a live token laboratory: 22 regulated contrast pairs measured off the rendered browser (re-measures on theme flip), ramp swatches with resolved hex, surface/type/radius/elevation/spacing references, interaction-state proofs.
- **Gallery coverage 11 → 25 sections** — accordion, alert-dialog, calendar, charts, collapsible, command, drawer, input-group, input-otp, menubar, navigation-menu, scroll-area, separator, toggle, toggle-group; all with court-shaped content.
- **Mobile navigation** — the sidebar now collapses to a sheet drawer below `md` (design-guidelines §3 finally implemented); header actions collapse without overflow at 375.
- **Shape & metrics law** (design-guidelines §Control metrics, DECISIONS 2026-07-21): control default 40px; radius by role (container xl · control lg · inset md/sm · chip full); container padding 24; micro-spacing addendum (2/6/10 legal only inside a control).

### Changed (shape & metrics release)
- **One chip: `status-pill` is merged into `badge`** *(breaking)* — Badge is now 24px, pill-shaped, caption type, with `success/warning/info` variants added and `destructive` moved from the alpha fill (4.44:1 on `accent` — an AA failure) to the opaque `destructive-muted` pair (constant 4.54 light / 7.75 dark). `status-pill` is deleted from the registry; map `tone` → `variant` (ready→success, waiting→warning, urgent→destructive).
- **Elevation is per-theme** — `SHADOWS` now carries light/dark values via `--elevation-*` indirection; dark uses deeper ink so raised/overlay/modal stop collapsing on dark surfaces.
- **Control heights normalized to the 40px default** — input-group 32→40, OTP slots 32→40 (mono, 16px digits), command input 32→40, tabs track 36→40; card padding 20→24 (`sm` 12→16), dialog/sheet/drawer/alert-dialog padding 16→24; card/overlay body text no longer forced to 14px; checkbox radius derives from the knob.

### Fixed (shape & metrics release)
- **`cn()` silently dropped custom type tokens** — tailwind-merge didn't know the Pucar type scale, classified `text-caption` as a colour, and let any later colour utility erase it. `lib/utils.ts` now extends the merge config with the full scale.

### Added
- **`prefilled` token** — the fill for machine-read, human-unverified field values (amber, snapped to `warning-2`; fill only, border stays `input` for the 3:1 boundary). `Input` now styles `data-prefilled="true"`; focus lifts the tint. Decided against a new hue (DECISIONS.md 2026-07-21).
- **`destructive-muted` / `destructive-muted-foreground`** — completes the muted-status set (success/warning/info already existed); needed for scrutiny flags and removable filter chips. Step-11 foreground clears AA in both themes.
- **`description-list`** — semantic key–value rows (label muted left, value right, hairline dividers) for preview summaries, scrutiny field panels, and detail asides.
- **`document-slot`** — the e-filing upload anatomy: filled (sunken well, thumbnail, quality pill), empty (dashed boundary, required mark / Optional chip, "+ Choose file"), processing.
- **Gallery:** "Documents & provenance" section; prefilled-field example under the form pattern.

### Changed
- **Sidebar selection is now the brand tint** (`--sidebar-accent` → `brand-3`, foreground → engineered `--brand-tint-foreground`, 5.83:1 light / 8.07:1 dark). Ruling: selection = persistent location = brand tint; hover = transient = grey. Light `brand-11` failed AA on the tint (4.10:1), hence the engineered pair.
- **Neutral temperature ruled: cool stays** (`NEUTRAL = "slate"`), after a side-by-side warm/cool port of the upload screen. "Clinical, instrument."
- Gate grows three pairs (prefilled ×2, destructive-muted) — now 23 pairs × 2 themes.

## 2026-07-06

### Added
- **Every ui component now ships through the registry** as a `registry:ui` item (auto-generated — the build scans `components/ui/`, reads npm + internal deps from each file's imports, and points internal deps at this registry's own URLs). Consumers now get the *Pucar* button/input/etc., not stock shadcn with the same name.
- **Four new components:** `field` (standardized form anatomy — label above, caption hint, destructive-plus-text error, aria wiring), `button-group` (segmented action cluster — activates the `in-data-[slot=button-group]` styles button.tsx already carried), `empty` (canonical empty state per screen-craft §2), `spinner` (in-context pending states only; pages load with skeletons).
- **Gallery sections** for status/solid button variants (previously undocumented), button-group, field, empty states, and in-button pending.
- **Release stamping:** the registry build refuses to run without a dated `CHANGELOG.md` entry and stamps the release date into item descriptions.
- **Component intake ritual** in `CONTRIBUTING.md` (justify role → port → theme with tokens → gallery → auto-distribute → changelog → PR), plus a deferred-decisions log.

### Fixed
- **`bg-surface-sunken` was silently broken in consumer apps** — the `@theme` mapping was missing from the registry's `cssVars.theme` (a hand-appended list in the generator remembered `brand-accent`, forgot `surface-sunken`). Mappings are now derived from `SEMANTIC_REFS + SOLID_FOREGROUND_TOKENS + UTILITY_PRIMITIVES` — one list, no hand-appends.
- **The AA gate now also checks utility-mapping completeness** — every public token must have a `--color-*` mapping in globals.css' `@theme inline`, and every mapping must point at a token that actually exists. The surface-sunken bug class is now mechanically caught.
- Placeholder-only textarea in the scrutiny flag composer got an `aria-label`.

### Deferred (explicit — see CONTRIBUTING.md § Deferred decisions)
- 44px touch targets (visual implication unassessed) and Indic font fallbacks (font decision pending).

## 2026-07-02

### Fixed
- **Registry now ships the full theme API.** `pucar-theme` includes `cssVars.theme` (82 mappings): status colour utilities (`bg-success`, `bg-warning-muted`, …), surface vocabulary (`bg-surface-sunken`, `bg-track`), the type scale (`text-caption`…`text-display` with line-heights/weights), elevation (`shadow-raised/overlay/modal`), the radius scale, and `font-heading`. Previously consumers received the variables but none of the utility mappings — non-stock utilities silently resolved to nothing in consumer apps.
- **`--brand-accent` self-reference.** The semantic layer re-declared `brand-accent` as `var(--brand-accent)` (a cycle → invalid CSS), which broke the token in light mode. Removed; the primitive is the single declaration.
- **Registry drift.** Published `accent` was `neutral-5`; the source of truth says `neutral-4`. Regenerated; the pipeline change below prevents recurrence.

### Changed
- **`pnpm tokens` is now the whole pipeline:** AA gate → CSS → registry → `shadcn build`. CSS and registry can no longer drift apart.
- **Type scale + elevation `@theme` block is now generated** from `TYPE`/`SHADOWS` in `tokens.ts` (was hand-authored in `globals.css`).

### Added
- **AA contrast gate** (`lib/tokens/gate.ts`): 20 semantic fg/bg pairs × 2 themes + input boundary (3:1) + var-cycle check. Fails the build below AA.
- `CONTRIBUTING.md` (operating model), PR template, CI workflow (gate + generated-file drift check).

### Removed
- **`--sp-1..32` and `--nudge` spacing tokens** — they were emitted but mapped to nothing, so editing them changed nothing. The 4px/8px grid is Tailwind's default spacing scale; the grid remains design law via `design-guidelines.md`.
