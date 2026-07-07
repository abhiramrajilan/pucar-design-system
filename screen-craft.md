# Screen craft — how to compose a screen that passes a professional eye

> `design-guidelines.md` is the **law** (what and why). This file is the **craft** (how).
> Read BOTH before building any screen. The law without the craft produces on-brand screens with amateur bones — wrong spacing, mushy hierarchy, missing states. This file exists because that happened.

The rule underneath everything here: **never freestyle layout.** Start from a scaffold (§2), take every gap from the ladder (§1), run the review pass (§8) before calling anything done.

---

## 0 · Before you place anything

Answer these in one line each — in a comment or to yourself. If you can't, stop and ask:

1. **The job:** what does the user come to this screen to do? One sentence.
2. **The one action:** which single button is THE primary action? (Everything else is outline/ghost/link.)
3. **The mode:** citizen (stressed, occasional, mobile-likely → generous, one decision at a time) or staff (trained, all-day, data-dense → earned density)? This sets widths, spacing, and target sizes for the whole screen (§7).
4. **The hierarchy:** what must be seen 1st, 2nd, 3rd? If everything feels important, nothing is — cut or demote.

## 1 · Spacing — proximity is meaning

Space is not decoration; it *is* the grouping structure. Related things sit closer than unrelated things — that single principle produces most of "professional".

**The ladder — these gaps only.** Tailwind: `1=4px 2=8px 3=12px 4=16px 6=24px 8=32px 12=48px 16=64px`. Never arbitrary values (`p-[13px]`, `mt-5`, `gap-7` are all bugs). If a design feels like it needs an in-between value, the grouping is wrong, not the ladder.

**Distance encodes relationship:**

| Relationship | Gap |
|---|---|
| Inside an element (icon ↔ its text) | `gap-1.5` / `gap-2` |
| Label ↔ its field · title ↔ its subtitle | `gap-1.5` / `gap-2` |
| Field ↔ next field in the same group | `gap-4` … `gap-6` |
| Card ↔ card · group ↔ group | `gap-6` |
| Section ↔ section on a page | `space-y-8` (staff) / `space-y-10`–`12` (citizen) |
| Page header ↔ first content | `mb-8` |

**Container padding:** cards `p-6` (never less than the largest gap inside them); page gutters `px-4 sm:px-6 lg:px-8`, vertical `py-8`; dialog/sheet content `p-6`.

**Three checks that catch 90% of spacing bugs:**
- **Padding ≥ gap** — a container's padding is never smaller than the gaps inside it (otherwise content hugs the edge while floating apart internally).
- **Outside > inside** — the space *around* a group is always larger than the spaces *within* it. If `gap` between groups ≤ `gap` within groups, grouping is illegible.
- **Symmetry** — left/right padding equal; the same section rhythm all the way down the page. One inconsistent margin reads as a mistake everywhere.

When something feels cramped, add space **between groups**, not inside elements.

## 2 · Scaffolds — start from a skeleton, never a blank file

Pick the matching skeleton and fill it. These encode the decisions that keep screens consistent.

**Every page:**
```tsx
<main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
  {/* header block */}
  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div className="space-y-1.5">
      <h1 className="text-title-l">Hearings today</h1>       {/* citizen pages: text-title */}
      <p className="text-body text-muted-foreground">Supporting line — what this screen is, in one sentence.</p>
    </div>
    <Button>New case</Button>   {/* THE primary action — exactly one, teal */}
  </div>
  <div className="space-y-8">{/* sections */}</div>
</main>
```
Widths: staff/table pages `max-w-6xl`–`7xl` · citizen flows and forms `max-w-2xl`–`3xl` · reading content `max-w-prose`. Never stretch a form to fill a wide screen.

**Form screen** (`max-w-2xl`): sections as cards or `space-y-10` groups. Each section = `title-s` heading + optional `caption` muted description + fields in `space-y-6`. **Single column always** — two-column forms cause skipped fields and broken tab order; the only exception is tightly-coupled pairs (city/PIN) as `grid grid-cols-2 gap-4`. Label above field (`gap-2`); hint/error in `caption` under the field. Actions in a row at the end: `<div className="flex justify-end gap-3 pt-4">` — ghost/outline secondary first, primary last (outer position). Long legal forms: end with a **review step**, not a surprise submit.

**List/table screen:** toolbar (`flex items-center justify-between gap-4 mb-6`: search left — labeled, `sr-only` is fine; filters middle; primary action right) → table in a flat card → footer with count + pagination. Row anatomy: one primary line (`font-medium`) + one muted secondary line (CNR in `font-mono text-muted-foreground`); headers quiet (`text-muted-foreground`, sentence case); row actions as a ghost `…` menu at row end; whole row clickable to detail.

**Detail screen:** identity header (title + status pill inline, muted mono meta line below, actions right) → `grid gap-6 lg:grid-cols-3`: main content `lg:col-span-2`, aside (parties, dates, documents) in the third. Sections inside use the same `space-y-8`.

**Dashboard:** stat row `grid gap-6 sm:grid-cols-2 lg:grid-cols-4`; each stat card = `caption` muted label → number in `text-title tabular-nums` → delta with **arrow + colour** (never colour alone). Then chart + list pairings, each in a card with a quiet `title-s` header row.

**Empty state (its own component shape, centered — the one place centering is right):**
```tsx
<div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
  <FileText className="size-8 text-muted-foreground/60" />
  <p className="text-title-s">No cases yet</p>
  <p className="max-w-sm text-body text-muted-foreground">When you file a complaint, it appears here with its hearing dates.</p>
  <Button className="mt-4">File a complaint</Button>
</div>
```

## 3 · Hierarchy — the squint test

- **One `<h1>` per screen.** The ladder: page title `title-l` (staff) / `title` (citizen) → section `title-s` → card/group title `text-body font-medium` → content `body` / `body-compact` → metadata `caption text-muted-foreground`. Don't invent intermediate sizes; don't skip levels.
- **At most 3 levels of emphasis visible at once.** Emphasis comes from **weight (500/600) and muting (`text-muted-foreground`)** — never from size sprawl or colour (law: hierarchy = weight + neutral-11).
- **Elevate the one by muting the many.** Labels, IDs, timestamps, helper text → muted. The *data* is the figure; everything else is ground. If a row/card has two bold things, one of them is wrong.
- Numbers align in columns: `tabular-nums`. Identifiers (CNR, case no.): `font-mono text-muted-foreground`.
- **The squint test:** blur your eyes at the rendered screen. You should still find: the page title, the primary action, and the first row/card of real content. If anything else competes, demote it.

## 4 · Alignment & shape

- **One left spine.** Page title, section headings, card contents, and form labels all start at the same x-position. Mixed indents read as sloppiness even when nobody can name why.
- **Center only** empty states and single-purpose confirmation moments. Never center body text or form labels.
- Icon + text: `flex items-center gap-2`, icon `size-4` matched to line-height. Buttons in a row share ONE size.
- Inputs in a group share one width; never a ragged right edge of mixed-width fields.
- Radius and elevation are semantic (law §Elevation): cards flat-with-hairline by default, `shadow-raised` only for genuine lift, overlays/modals use their own levels. No decorative shadows, no mixed radii.

## 5 · UX patterns — when to reach for what

**Dialog vs sheet vs page:** dialog = one decision or a tiny form (≤ ~4 fields); sheet = contextual create/edit while the list stays visible behind; full page = anything multi-section, anything with legal weight (filings are pages, not popups). Destructive confirms = `alert-dialog`, always naming the object and the consequence ("Delete draft complaint against Suresh Kumar? This can't be undone.") with `destructive-solid` confirm.

**Feedback:** background/async results → toast (sonner). Blocking context the user must read → inline `Alert` above the content it blocks. Field problems → inline error under the field (`caption` + destructive + text, never colour alone). Never a toast for a field error; never an alert for a success.

**Filtering & search:** active filters render as removable chips under the toolbar; always show a result count ("14 cases"); filtered-empty gets its own empty state with "Clear filters", distinct from true-empty.

**Progressive disclosure:** show the essential, link the rest ("4 of 27 shown → View cause list"). Rare/advanced form fields behind a collapsible, not deleted. Critical info never lives *only* in a tooltip or hover.

**Status & time:** state → muted pill; case progress → vertical timeline (past = muted dot, current = brand, future = hollow); neutral metadata → plain muted text, not a pill. Pill inflation is real — if everything has a pill, nothing has status.

**Selection density:** ≤5 options → radio group / toggle group (visible, one tap); >5 → select; multi-select from many → checkboxes in a scroll area, chosen items echoed as chips.

**Loading:** skeletons that **mirror the final layout** (same heights, same grid — no layout jump), never a bare centered spinner for a whole page. Buttons show in-button pending state on submit.

## 6 · A screen is five screens — states are the design

Nothing is "done" with only the happy path. Every screen ships with:

1. **Default** — real-shaped data, not lorem ipsum (use plausible Kerala names, real CNR formats).
2. **Empty** — first-run teaches the first action (§2 recipe). Filtered-empty is a separate, lighter state.
3. **Loading** — skeleton mirroring layout.
4. **Error** — what happened + what to do now, in plain sentences ("Couldn't load today's hearings. Check your connection and retry."). Never a bare code.
5. **Edge** — the longest party name you can imagine (and its Malayalam version), a 16-char CNR, 0 items, 1 item, 10,000 items, tomorrow's date, a hearing 4 years out. Truncate deliberately (`truncate` + full value on hover/detail), wrap intentionally, and make sure the layout survives all of it.

## 7 · Density modes (from §0's answer)

- **Citizen:** `max-w-2xl/3xl` · targets ≥ 44px (`size="lg"` for primary flows) · `body` 16 everywhere · `space-y-10`+ between sections · one decision per screen where possible · progress indicator on multi-step flows.
- **Staff:** density earned in **tables only**, via row padding and line-height — never by shrinking type below `body-compact` (14) or targets below 40px. Page furniture (headers, toolbars) keeps the generous rhythm even on dense screens.

## 8 · The review pass — run this before declaring done

Go through literally, against the rendered screen (light AND dark, 375/768/1280):

- [ ] Every gap/padding is from the ladder — zero arbitrary values in the diff
- [ ] Padding ≥ gap in every container; outside > inside for every group
- [ ] Exactly one primary (teal) action; everything else outline/ghost/link
- [ ] Exactly one `<h1>`; type ladder with no skips; ≤3 emphasis levels per view
- [ ] Squint test: title, primary action, first content — findable blurred
- [ ] One left spine; forms single-column at `max-w-2xl`; no full-width inputs on wide screens
- [ ] All five states exist (default/empty/loading/error/edge) and the layout survives the edge kit
- [ ] Status has icon-or-text with its colour; deltas have arrows; sentence case everywhere
- [ ] Focus visible on every interactive element by keyboard-tabbing through
- [ ] Dark mode actually checked, not assumed

If any box fails, fix it before showing the screen. This pass is not optional polish — it's the difference this file exists to make.

---

*Companion to `design-guidelines.md` (the law) and `CLAUDE.md` (the workflow). Ships with the repo so every human and AI designing with Pucar composes screens the same way.*
