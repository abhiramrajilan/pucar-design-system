# Design decisions log

> Running capture of Abhiram's design rulings made during working sessions.
> Nothing here is law yet. Entries are **ratified in batch review**, then land as
> edits to `design-guidelines.md` (law) or `screen-craft.md` (craft) and are marked
> accordingly. See CONTRIBUTING.md for the deferred-decisions counterpart
> (things explicitly *not* decided).

**Entry format** — every entry must carry the *why*, generalized beyond the screen
that triggered it. A fix without a transferable rule doesn't belong here; just fix it.

```
## YYYY-MM-DD · short title
- **Trigger:** which screen/component/review surfaced it
- **Ruling:** what Abhiram decided, verbatim intent
- **Generalized rule:** the transferable form ("never X", "prefer Y when Z")
- **Rationale:** why — the sensibility behind it, stated so someone without Abhiram can apply it
- **Status:** logged | ratified → design-guidelines.md §N | ratified → screen-craft.md §N | rejected (with reason)
```

---

## 2026-07-21 · Prefilled-field colour stays amber
- **Trigger:** two-way review of E-Filing + Scrutiny (REVIEW-two-designs.md §C2). Three treatments coexisted in the designs: amber tint, info-blue, teal.
- **Ruling:** keep the yellow/amber fill on machine-prefilled text fields as-is; snap it to the nearest design-system colour (warning ramp) rather than minting a new hue.
- **Generalized rule:** machine-read, human-unverified field values are marked with a warning-ramp tint (light warning fill + warning-mixed border), which clears once the user edits or verifies the value. One treatment everywhere — the info-blue and teal variants in the designs are to be replaced with this.
- **Rationale:** Abhiram's call, favouring the existing look over a new semantic token. Counter-argument recorded at time of ruling: this overloads a status hue ("status colours mean status") and a heavily prefilled form may read as a form full of warnings; revisit if that materializes in testing. Exact token mapping to be fixed after the neutral-temperature ruling lands.
- **Status:** logged

## 2026-07-21 · Scrutiny's sub-12px type is a defect, not a tier
- **Trigger:** scrutiny v10 runs on 11–13.5px type (REVIEW-two-designs.md §C3).
- **Ruling:** the 12px floor stands. Port scrutiny at ladder sizes (12/14), earning density through padding and line-height; no "workbench" density tier is added.
- **Generalized rule:** no screen — however dense or expert-facing — sets type below `caption` (12px) or off the ladder; full-viewport tools get their density from spacing and leading only.
- **Rationale:** the existing law already anticipated this ("density earned in tables only… never by shrinking type"); the ladder-sized version was never actually attempted, so defection was unjustified. Revisit only with a rendered ladder-compliant port demonstrably failing.
- **Status:** logged

## 2026-07-21 · Nav/sidebar selection uses brand tint, hover stays grey
- **Trigger:** wizard rail in E-Filing uses teal-tint fill + teal text for the active section; system token was calibrated grey (REVIEW-two-designs.md §C4).
- **Ruling:** brand tint becomes the selection treatment: `--sidebar-accent` → brand tint, `--sidebar-accent-foreground` → brand-11 (or dark-mode equivalent).
- **Generalized rule:** *selection* ("where you are" — persistent state) uses a brand tint; *hover* ("where you might go" — transient) stays on the calibrated grey `accent`. The two must remain visually distinct.
- **Rationale:** extends the existing structural/interactive grey split with a third distinction: persistent location vs transient feedback. Law already permitted "accent or a brand tint"; this pins which is used when. Exact tint values to be fixed after the neutral-temperature ruling.
- **Status:** logged

## 2026-07-21 · Neutral temperature — cool stays
- **Trigger:** designs are built on warm hue-83 "paper" neutrals; system ships cool Radix greys. Ruled after a side-by-side port of the upload screen (cool vs warm, light and dark).
- **Ruling:** cool. "The cool side reads more clinical, more instrument" — that is the intended feel.
- **Generalized rule:** the neutral ramp stays `slate` (`NEUTRAL` in tokens.ts). Warm/cream neutrals in any mockup are re-skinned to the system ramp on port; temperature is not a per-screen choice.
- **Rationale:** the product should read as a precise public instrument, not as stationery. Lightness-matched comparison showed the delta lives in chrome (bars, card fills, borders); dark mode is nearly identical either way — so cool costs nothing at night and sets the register by day.
- **Status:** logged

## 2026-07-21 · Working agreements (not design law)
- **Repo hygiene:** no new standalone .md files in the design system beyond the working set (design-guidelines, screen-craft, CONTRIBUTING, MAINTAINING, CHANGELOG, README, this log). Review artifacts live in the session, not the repo — REVIEW-two-designs.md moved out accordingly. Candidate consolidation for a future pass: fold GREY-AND-A11Y-PLAN.md's two open items into CONTRIBUTING § Deferred decisions and retire the file (needs Abhiram's yes).
- **Prefill mapping (implements the amber ruling above):** fill = `warning-2` via a semantic `prefilled` token; border unchanged (`input`, neutral-9) because no amber step clears the 3:1 boundary without going brown. Focus lifts the tint; editing clears the marker.
- **destructive-muted added** to complete the muted-status set (scrutiny flags need it) — follows the existing success/warning/info pattern, step-11 foreground clears AA in both themes. Flagged here because it's a palette addition made without a bespoke ruling; veto reverses it in one token.

## 2026-07-21 · Shape & metrics — radius roles, control heights, one chip
- **Trigger:** cohesion audit found control heights anarchic (composed field 32px beside a 40px input; census: h-8×9 vs h-10×3 in primitives), six radius values with no assignment rule (Badge `4xl` vs StatusPill `full`; bare `rounded` = fixed 4px ignoring the knob), and four coexisting "card paddings" (16/20/24 + p-5) against a law that names 24.
- **Ruling:** (1) every field-like control defaults to **40px**; ladder 32/36/40/44 with smaller sizes opt-in, 44 for citizen primaries. (2) Radius by role: container `xl` · control `lg` · inset item `md`/`sm` · micro-control derived `sm` · chip `full`; bare `rounded` illegal. (3) Container padding is 24 (`p-6`) everywhere; card `sm` = 16. (4) **One chip:** StatusPill merged into Badge (24px, pill, caption type); status variants use the opaque muted pairs — alpha fills banned for status (measured 4.44:1 on `accent`, below AA).
- **Generalized rule:** where the law is silent, primitives inherit upstream defaults and cohesion decays — so metrics (heights, radii, paddings) are now law, not component-local choices.
- **Rationale:** the "low visual sensibility" feel traced to metric drift, not colour. Measured on the rendered gallery 2026-07-21.
- **Status:** implemented (badge/card/dialog/sheet/drawer/alert-dialog/input-group/input-otp/command/checkbox/tabs; status-pill deleted from registry)

## 2026-07-21 · Elevation becomes theme-aware
- **Trigger:** foundations lab showed the four elevation levels indistinguishable in dark (pure-black shadows on near-black surfaces).
- **Ruling:** `SHADOWS` in tokens.ts becomes per-theme; dark uses deeper opacities so raised/overlay/modal stay legible. Semantic names and usage rules unchanged.
- **Status:** implemented

## 2026-07-21 · Status colours: three treatments per hue, alpha fills banned
- **Trigger:** the semantic colours read "not refined" — census found three coexisting tint mechanisms (alpha mixes `bg-destructive/10`, muted tokens, raw brand-3), the solid fills doubling as text colours, and the primary button's own hover (`bg-primary/90`) compositing to 4.12:1 in light — below AA mid-interaction.
- **Ruling:** each status hue has exactly three treatments — **solid** (fill for the one strong action), **tint pair** (chips/callouts/flagged rows), **ink** (text/icons on neutral surfaces). Solids are never text; inks are never fills. Alpha is legal only for focus rings, shadows, and washes over content that must remain readable through them (document annotation, scrims). Inks are engineered per theme (`STATUS_INKS`): green/red ride raw step-11; `warning-ink` #9d5c00 (amber-11 was 4.50 on page, 4.20 in wells) and `info-ink` #0c6ec3 (blue-11 4.34 in wells) are tuned. Soft destructive controls hover by ESCALATING to the solid pair — perceptible, AA at every moment, and it announces the danger.
- **Also fixed under this ruling:** primary/badge hovers → in-hue color-mix; alert description drops from red-wall to muted; registry never emitted `--brand-tint-foreground` (consumers had var(undefined) sidebar selection).
- **Status:** implemented; gate grows to 35 pairs × 2 themes.

## 2026-07-21 · Grey ladder re-ruled: one monotone scale, interaction moves one step down
- **Trigger:** `secondary` and `accent` were both neutral-3, so a secondary button's hover-to-accent changed nothing; toggle hover and pressed were both `muted`; the old law's "interactive greys stay lighter than structural" was internally false (accent-3 is darker than sunken-2½).
- **Ruling:** one ladder, one job per step: muted/sidebar (2) → sunken (tuned 2½) → `accent` (3, hover of white/transparent-rest) → **`accent-strong` (4, new: hover on grey-rest, pressed toggles, expanded triggers)** → `track` (5, moved from 4 — recessed tracks are the darkest fill) → borders (5/7) → input (9). Interaction always moves one step down; a control never hovers to its own rest colour.
- **Status:** implemented (button secondary, toggle, badge link-hovers; tabs/progress/slider inherit track via the token).

## 2026-07-21 · Grey refinement II — the four "reads wrong" fixes
- **Trigger:** Abhiram's screenshot review: command-palette search renders as a heavy grey slab; secondary buttons read as disabled; selected toggles read as hover/disabled; info/warning chip text (navy/brown step-12) sits in a different chroma register than success/destructive (vivid step-11).
- **Rulings:**
  1. **Command input is transparent with a bottom hairline** (Spotlight/cmdk pattern) — the palette frame is the boundary. `bg-input/30` was the field-boundary colour doing fill work at 30% alpha; boundary colours never fill.
  2. **The neutral button triad is exclusive:** outline = border on white · secondary = fill ONLY with a full-strength label (`secondary-foreground` → neutral-12) · ghost = nothing. Grey fill + grey border + muted label is the disabled costume.
  3. **Chosen state carries the brand tint** (`data-[state=on]` → `brand-muted` pair) — extends the selection ruling from location to choice. Grey is hover-only.
  4. **One ink per hue everywhere:** `*-muted-foreground` now aliases the hue's engineered ink, so chips, callouts and inline status text share one colour. Kills the 11-vs-12 chroma split (the tuned inks clear AA on the tints: warning 4.88, info 4.66).
- **Status:** implemented; gate green at 35 pairs × 2 themes.

## 2026-07-21 · The usage law + motion law (Track 2)
- **Trigger:** Abhiram's critique acceptance — "when and how to use what" was undocumented (8 lines for 48 components; 4 of 48 files carried the mandated usage comment), and the system had no motion rules at all.
- **Ruling:** a third law doc, **component-usage.md**, joins the working set (GOV.UK/USWDS/Carbon-grounded grammar: job · use when · don't use → instead · variant meanings, plus decision trees for actions, feedback, containers, overlays, navigation). Every `components/ui/*` file carries a distilled top-comment; the doc wins on conflict. **Motion law** added to design-guidelines: motion is feedback only, 100–150ms micro / 200–250ms surfaces, nothing over 300ms, ease-out in / ease-in out, and `prefers-reduced-motion` collapses everything globally via globals.css (WCAG 2.3.3 / C39) — enforced in CSS so no component can forget.
- **Also:** the repo-hygiene working agreement's "working set" now includes component-usage.md and `.claude/skills/pucar-design/SKILL.md` (the portable agent skill); both ship in the `design-rules` registry item so consumers inherit the judgment, not just the components.
- **Research base:** GOV.UK Design System (component-page grammar, disabled-button policy, button rationing), USWDS ("when to consider something else", links-vs-buttons, verb-first labels), Carbon (inline vs toast vs callout decision rules), Material 3 (motion duration/easing tokens).
- **Status:** implemented

## 2026-07-21 · The law is now machine-enforced; eight components close the vocabulary gaps
- **Trigger:** every convention outside the AA gate had been violated in practice (100+ fixes in one day); screen-craft prescribed a timeline and a stepper that didn't exist; the WCAG 2.2.1 timeout warning was the plan's one open a11y item.
- **Ruling:** (1) **law-lint** joins the gate in `pnpm tokens` and CI — six rules with a reasoned allowlist that fails when stale; the lint, not memory, now owns "no bare rounded / raw neutrals / raw type / alpha status fills / off-ladder spacing / pixel type". (2) **Visual regression** snapshots the review surfaces per platform. (3) Releases carry a calver `version`; breaking changes get a CHANGELOG **Migrations** entry. (4) Intake of eight components: timeline, session-timeout, stepper, combobox, date-picker, banner, context-menu, kbd — each justified against an existing law reference or decision-tree hole, gallery-shown, usage-documented. Data-table stays deferred (needs @tanstack/react-table and its own API ruling); RHF wrapper deferred — the field-composition pattern is the documented answer.
- **Status:** implemented
