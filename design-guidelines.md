# Designing with Pucar · ON Court

> The **design-language skill** for the Pucar design system. Read this before designing or generating any screen.
> This is where design *policy* lives — edit it freely as taste evolves. The token/component **reference** is generated separately (see `llms.txt`); this file is the human-authored intent that `llms.txt`, `CLAUDE.md`, Figma and Pencil all point to.

---

## 0 · North star — the feel

Calm, dignified **public service**. A courts product used by citizens under stress and by staff all day. It must feel **friendly, not intimidating**, trustworthy, and quiet — *premium through restraint, never flashy*. When unsure, choose the calmer, more legible, more forgiving option. "Airy and a little apologetic."

---

## 1 · Non-negotiable rules

### Typography
- **Sentence case only.** Never ALL-CAPS or Title Case — including eyebrow/section labels, buttons, table headers, nav. **Exceptions:** proper nouns (ON Court, Pucar) and established legal abbreviations (CNR, FIR, IPC, S.138). *Why: caps shout, which intimidates; and Indic scripts have no case, so caps don't translate.*
- Body defaults to **16px** (reading + UI). Use 14 (`body-compact`) only for dense, staff-only data.
- **No thin text.** Honour the weight ladder (caption→500, body→400/500/600, titles→600). Sub-400 never ships.
- Hierarchy comes from **weight + `neutral-11`**, not from colour.

### Colour
- **Brand teal is rationed** — primary action, active state, focus. Never decoration.
- **Status colours mean status** (success / warning / info / destructive), never styling.
- **Data-viz uses the categorical palette** (`chart-1…5`) — chosen for mutual distinction, *not* status meaning.
- Neutrals carry structure (surfaces, borders, text).
- **Greys split by job — structural vs interactive — and never share a step.** *Structural* greys separate content and are the stronger end: `surface-sunken` (nested wells — a **tuned** step between neutral-2 and 3 that separates on a white card **on its own, no border**), `track` (neutral-4 — recessed control tracks like the tabs list, progress, slider, so a white/teal active pops). *Interactive* greys are transient feedback and stay **lighter**: `accent` (neutral-3 — hover/selection). If a hover looks too heavy, it's using a structural grey by mistake; if a surface won't separate, it's using an interactive one.
- **Depth is fill, not repeated borders.** The outer card keeps the one hairline; nested wells use `surface-sunken` with **no border of their own** — a border on a nested item reads as box-in-box. Exception: small chips/thumbnails are defined *by* a border. **Never pick a raw `neutral-N` for any surface/track/accent** — change the one token and it propagates everywhere.
- **Never rely on colour alone.** Pair it with an icon, label, or arrow (e.g. ↑/↓ on deltas). *Colour-blind and bad-monitor safe.*

### Accessibility — the floor, not the aspiration
- **WCAG 2.2 AA:** text ≥ 4.5:1, large text / UI boundaries ≥ 3:1. **Verify, don't eyeball.**
- Interactive states must stay **perceptible** — hover/selection use `accent` (a calibrated light neutral, deliberately calm) or a brand tint, never pure page-white. The AA gate checks `accent-foreground` on `accent` in both themes.
- Focus is always visible (the teal ring). Don't remove it.
- Touch targets ≥ **40px** on citizen-facing surfaces.

### Spacing & density
- **Generous by default.** Whitespace is a feature, not waste — it lowers cognitive load and reads as calm and premium.
- 4px grid, 8px rhythm; the 2px nudge is optical-only, never layout.
- Earn density only where trained staff live in tables — via line-height and padding, never by shrinking type or targets.

### Elevation & shape
- Depth is **semantic**: flat (page), raised (cards, optional), overlay (popovers), modal (dialogs). No decorative shadows.
- One system radius (10px) and its derived scale. No loose values.

---

## 2 · Information design
- **One primary line per row**; secondary info muted beneath it. *(A hearing row = parties in medium weight; CNR muted-mono below.)*
- Prefer **dividers over density**; keep table headers quiet (`muted-foreground`) so the *data* reads first.
- Numbers and IDs are tabular; CNRs are monospace.
- **Progressive disclosure** — show the essential, link to the rest ("4 of 27 shown → View cause list").
- One obvious primary action per view. Reduce the number of choices on screen.

## 3 · Responsiveness
- **Mobile-first.** Sidebar collapses to a drawer; multi-column grids stack; touch targets stay ≥ 40px.
- Comfortable reading max-widths; tables scroll horizontally rather than crush.
- Test at **375 / 768 / 1280**.

## 4 · Robustness — the Pucar stress tests
- **Bad monitor:** if a state depends on a near-white grey, it fails. Calibrated greys / brand tints for anything interactive.
- **Low network:** system-font stack (zero download); avoid heavy assets.
- **Indic scripts:** sentence case; ensure Malayalam renders (OS fallback / bundled Noto Sans Malayalam).

## 5 · Choosing components
- Primary action → `Button` default (teal). Secondary → `outline` / `secondary`. Tertiary → `ghost`.
- **Solid coloured action buttons** (`success` / `warning` / `info` / `destructive-solid`) are **rationed** — at most one strong coloured action per view, beside the single teal primary. Only status actions hover in-hue; neutral buttons (`outline` / `secondary` / `ghost`) hover grey *by design* — that's correct, not a bug.
- Status → muted **pill** chips (rounded-full), AA text. Plain labels/metadata → neutral chips.
- Cards default **flat** (hairline); use raised only to lift something genuinely above the page.
- Charts → categorical palette; highlight the current / most-relevant series.
- Forms → label above field, hint & error in `caption`; error uses `destructive` **plus text** (never colour alone).

## 6 · Do / don't
| ✅ Do | ❌ Don't |
|---|---|
| `New case` | `NEW CASE` · `New Case` |
| a ghost hover you can see on a cheap screen | a hover that vanishes into the background |
| `↓ 3.1%` in red **with the arrow** | red text with no arrow |
| one teal primary action per view | teal sprinkled as decoration |
| roomy rows, quiet headers | a dense grid that reads like a spreadsheet |

---

*Source of design intent. `llms.txt` and `CLAUDE.md` reference this file, and it ships as a registry item — so any project or AI building with Pucar inherits these rules.*
