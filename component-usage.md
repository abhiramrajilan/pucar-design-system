# Component usage — when and how to use what

> The third law doc. `design-guidelines.md` says what the system looks like; `screen-craft.md` says how screens compose; **this file says which component to reach for, and when not to.** Format follows the systems built for the same job as ours — GOV.UK ("when to use / when not to use"), USWDS ("when to consider something else"), Carbon (feedback decision rules).
>
> Every `components/ui/*` file carries a distilled version of its entry as a top comment — agents and humans read those in place. This file is the full law; if they disagree, this file wins and the comment is a bug.

**The grammar of every entry:** *Job* (one sentence) · *Use when* · *Don't use* (with the "→ use X instead" pointer) · *Variants* (what each means, not just what exists). Rationing and accessibility notes where the law demands them.

---

## 1 · Actions

**The decision:** does it *do* something (button) or *go* somewhere (link)? Navigation between pages is a link (`text-primary`, underline on hover) — buttons are for actions. USWDS's rule: lead with a verb; less important actions get quieter variants, not more buttons.

**The emphasis ladder — exactly one primary per view:** `default` (teal, THE action) → `secondary` (grey fill, supporting) → `outline` (border, parallel choices) → `ghost` (bare, repeated/row-level) → `link` (inline reference). Status solids (`success/warning/info/destructive-solid`) sit beside — not above — the primary, rationed to one strong coloured action per view.

### button
- **Job.** Trigger an action, in one press.
- **Use when** the user commits, submits, opens, confirms, files.
- **Don't use** for navigation between pages → use a link; for switching an on/off state → `switch` or `toggle`; for choosing one of ≤5 options → `toggle-group` or `radio-group`.
- **Variants.** One `default` (teal) per view — more than one main call to action makes it harder to know what to do next (GOV.UK). `destructive` (tinted) for row-level dangerous actions; it escalates to solid red on hover — that's the design, not a bug. `destructive-solid` only as the confirm inside an `alert-dialog`. `warning`/`success`/`info` solids: at most one, only when the action *is* that status ("Approve filing").
- **Disabled buttons are a last resort** — they have poor contrast and confuse users (GOV.UK). Prefer keeping the button active and showing the inline error on press.
- **Labels:** sentence case, verb first, ≤3 words ("File a complaint", never "Complaint filing" or "SUBMIT"). In-progress: swap label for `spinner` + "Filing…" inside the same button.

### button-group
- **Job.** One decision expressed as a segmented cluster (pagination arrows, split button, view switch).
- **Use when** the actions are variations of one choice and belong under one visual boundary.
- **Don't use** to park several unrelated primaries side by side → lay out separate buttons with `gap-3`; for one-of-N selection that persists → `toggle-group`.

### toggle · toggle-group
- **Job.** A pressed/unpressed state (`toggle`) or a persistent one-of-N / many-of-N choice (`toggle-group`).
- **Use when** ≤5 options should stay visible and one-tap reachable (density picker, view switch, formatting bar).
- **Don't use** for >5 options → `select`; for an on/off setting with a sentence label → `switch`; for form data that gets submitted → `radio-group`/`checkbox` (they carry form semantics; toggles are UI state).
- **The chosen state carries the brand tint** — grey is hover-only (grey selection reads as disabled; DECISIONS 2026-07-21).

---

## 2 · Status & feedback

**The decision tree (Carbon's split, adapted):**
- Known *before* the page renders, can't be dismissed → **banner** — it loads with the page and is information, not feedback.
- Result of a user/system action, tied to *this section* of the page, must be read → **alert** (inline, persistent until resolved).
- Result of a background/async action, tied to *no particular section* → **toast** (`sonner`; auto-dismisses, so never put anything the user must act on in one).
- A problem with *one field* → inline `field` error under that field. Never a toast for a field error; never an alert for a success.
- The *state of a thing* (case, fee, document) → **badge**. The *progress of a process* → **progress**. The *absence of things* → **empty**.

### alert
- **Job.** Blocking, contextual information the user must read before continuing with the section below it.
- **Use when** an error/warning/notice relates to the content it sits above, and must persist until resolved.
- **Don't use** for transient success ("Saved") → toast; for page-level standing notices → `banner`; for one field's problem → `field` error.
- **Variants.** `default` (neutral notice) and `destructive` (the title and icon carry the status ink; the description stays muted — a wall of red text shouts).

### sonner (toast)
- **Job.** Non-blocking confirmation of a background or just-completed action.
- **Use when** the user's flow shouldn't stop: "Draft saved", "Document uploaded", "Copied".
- **Don't use** for anything requiring action or that the user must not miss — toasts auto-dismiss in seconds and screen-reader users may never hear them → alert or dialog; never for validation errors.

### badge
- **Job.** THE chip. A short status or category label on an object.
- **Use when** a row/card needs its state readable at a glance: `success` ("Fee paid"), `warning` ("Awaiting docs"), `info` ("Under hearing"), `destructive` ("Dishonoured").
- **Don't use** status variants for decoration or emphasis — status colours mean status; for neutral metadata ("4 documents") → `secondary`/`outline`, or plain muted text. **Pill inflation is real: if everything has a badge, nothing has status.**
- Pair the colour with words — never colour alone.

### progress
- **Job.** How far a determinate process has got (upload, multi-step filing).
- **Don't use** for indeterminate waits → `spinner` (in context) or `skeleton` (whole regions); not as a chart → `chart`.

### spinner
- **Job.** In-context pending state: inside a pressed button, beside a refreshing row.
- **Don't use** as a bare centered spinner for a whole page — full-page loading is a `skeleton` that mirrors the final layout (no layout jump when content lands).

### skeleton
- **Job.** Loading placeholder that mirrors the final layout — same heights, same grid.
- **Use when** a page or region is fetching its initial data.
- **Don't use** shapeless grey boxes that don't match what will render — the mirror is the point.

### banner
- **Job.** Full-width standing notice that loads with the page and persists while the condition holds ("Read-only during scrutiny", "Hearing adjourned to 14 Aug").
- **Use when** the notice is *state*, not the result of an action; not dismissible by default (Carbon's callout rule).
- **Don't use** as feedback → alert (contextual) or toast (background); never stack more than one — two standing notices means the page needs redesigning.

### session-timeout
- **Job.** The WCAG 2.2.1 expiry warning: countdown + one-press extend, before a long form's session dies.
- **Use when** any authenticated flow can expire with unsaved work — court filings always qualify.
- **The safe action (staying signed in) is the primary**; the countdown is announced politely. Timing logic lives in the app.

### empty
- **Job.** The canonical empty state: icon, one-line title, one supportive sentence, the first action.
- **Use when** a list/region has no items yet (teach the first action) — and use a *lighter* variant for filtered-empty ("No cases match — clear filters"), which is a different state from true-empty.
- **Don't use** for errors → alert with a retry; never leave a region silently blank.

---

## 3 · Forms

**The frame:** every field = `field` (label above, hint below label, error below control — caption size, destructive ink *plus text*, never colour alone). Single column, `max-w-2xl`. Visible labels always — placeholder-only fields fail accessibility (and our audit).

### field · label
- **Job.** The form anatomy wrapper: spacing, aria wiring, error slots.
- **Use when** building ANY form control group — it makes label-less fields hard to write.
- **Don't** hand-compose label+input+error with ad-hoc spacing → this is what field is for.

### input
- **Job.** Single-line free text.
- **Don't use** for long text → `textarea`; for constrained choices → `select`/`radio-group`; for text with affixes or inline actions → `input-group`.
- Machine-prefilled, human-unverified values get `data-prefilled` (amber fill) until the user edits or confirms.

### textarea
- **Job.** Multi-line free text (grounds of complaint, remarks).
- Give it a visible character expectation if one exists; grows with content, never scrolls invisibly at 2 lines.

### input-group
- **Job.** A field with affixes: search icon, ₹ prefix, unit suffix, copy button.
- **Don't use** to decorate a plain field — if the affix carries no meaning, use `input`.

### input-otp
- **Job.** Fixed-length verification code (e-filing OTP). Monospaced, grouped, 40px targets.
- **Don't use** for anything that isn't a code — it's not a styled input.

### select
- **Job.** One choice from >5 options where showing all would crowd the screen.
- **Don't use** for ≤5 options → `radio-group`/`toggle-group` (visible options, one tap — hiding 3 choices behind a dropdown is pure friction); for one-of-many with search (party names, police stations) → command-in-popover (combobox pattern).

### combobox
- **Job.** One choice from many, with search (party names, police stations, court lists).
- **Use when** typing beats scrolling — long lists with recognisable names.
- **Don't use** for ≤5 options → radio/toggle group; for >5 without search need → `select`; the trigger always echoes the selection (never placeholder-only).

### date-picker
- **Job.** Field-shaped date choice: 40px trigger + calendar popover (single or range).
- **Use when** the week context matters (hearings, adjournments, cause-list windows).
- **Don't use** for known dates users can type faster (DOB) → segmented text inputs (GOV.UK memorable-dates pattern).

### checkbox
- **Job.** Independent yes/no declarations, or many-of-N selection.
- **Use when** each option stands alone ("Apply for exemption…"); >7 options → checkboxes inside a `scroll-area` with chosen items echoed as chips.
- **Don't use** for mutually exclusive options → `radio-group`; for instant-effect settings → `switch`.

### radio-group
- **Job.** Exactly one of 2–5 visible, submitted options.
- **Don't use** when unselected isn't a valid transit state or the effect is instant → `switch`/`toggle-group`; >5 options → `select`.

### switch
- **Job.** An instant on/off setting — flipping it takes effect now, no submit.
- **Don't use** inside a submitted form (state is ambiguous until save) → `checkbox`.

### slider
- **Job.** Choosing a value from a continuous/dense range where the *relative* position matters.
- **Don't use** when the exact number matters (amounts, dates) → `input` with `inputMode="numeric"` — sliders are hostile to precision and to screen readers for exact entry.

### calendar
- **Job.** Date choice where the *week context* matters (hearings, adjournments).
- **Don't use** for known dates the user can type faster (date of birth) → segmented text inputs (GOV.UK memorable-dates pattern).
- Week starts Sunday, deterministic; selected day carries the brand tint; today is marked without colour alone.

### document-slot
- **Job.** The e-filing upload anatomy: filled (sunken well + thumbnail + quality pill), empty (dashed boundary + required mark), processing.
- **Don't** rebuild ad-hoc upload rows — this is the one upload shape.

---

## 4 · Containers & structure

**The decision:** page-level grouping → `card` (one hairline, flat). Grouping *inside* a card → `surface-sunken` well (fill, no border — box-in-box reads amateur). Ephemeral grouping → whitespace alone (the ladder groups harder than boxes do). Key–value facts → `description-list`. Rows of records → `table`.

### card
- **Job.** A bounded region of related content on the page — one hairline, flat by default.
- **Don't** nest cards → inner grouping is a `surface-sunken` well; don't reach for `shadow-raised` unless the thing genuinely floats above the page (menus float; summaries don't).
- **Variants.** `size="sm"` (16px padding) only for staff-dense grids.

### description-list
- **Job.** Label–value pairs: case metadata, review summaries, detail asides.
- **Don't use** a two-column `table` for key–value data → tables are for *many records*, description lists are for *one record's facts*.

### table
- **Job.** Records × attributes, for trained staff.
- **Use when** users scan/compare many rows; one primary line per row, identifiers in mono muted, headers quiet (the data reads first, headers second).
- **Don't use** for layout, ever; on mobile it scrolls inside its own container — never crushes columns.

### separator
- **Job.** A quiet hairline between meta items (inline) or blocks (horizontal).
- **Don't** stack separators to fake structure → if you need more than dividers, the grouping wants a well or a card. Prefer dividers over density.

### scroll-area
- **Job.** A bounded, styled scroll region for long option lists (acts invoked, multi-select).
- **Don't use** to make a page section scroll independently without a reason — nested scroll on touch is a trap.

### accordion
- **Job.** One-at-a-time expandable Q&A / help content (citizen-facing FAQs).
- **Don't use** to hide critical filing information the user *must* see → put it in the page; for independent sections that can all be open → `collapsible` per section.

### collapsible
- **Job.** Progressive disclosure of rare/advanced options — hidden, never deleted.
- **Don't** put anything *required* behind one; critical info never lives only behind a disclosure.

---

## 5 · Overlays

**The decision (screen-craft §5, sharpened):** one decision or ≤4 fields → `dialog`. Destructive confirm → `alert-dialog`, always naming the object and consequence. Contextual create/edit while the list stays visible → `sheet` (desktop side panel). Touch bottom-sheet → `drawer`. Anything multi-section or with legal weight → a full page; **filings are pages, not popups.** Small anchored choices → `popover`/`dropdown-menu`. Labels for icon buttons → `tooltip`. Rich preview on hover → `hover-card` (desktop-only affordance — never the sole path to anything).

### dialog
- **Job.** One focused decision or a tiny form, blocking the page.
- **Don't use** for multi-section content or long forms → full page; for destructive confirms → `alert-dialog`; opening a dialog from a dialog is a design failure.

### alert-dialog
- **Job.** Confirm a destructive or irreversible act.
- **The confirm names the object and consequence** ("Withdraw the complaint against Suresh Kumar? … can't be undone") — never a bare "Are you sure?". Confirm button is `destructive-solid`; cancel is the safe default and phrased as the safe action ("Keep the draft").

### sheet
- **Job.** A side panel for contextual create/edit/detail while the underlying list stays visible.
- **Don't use** for confirmations → dialog; below `md` prefer `drawer` (thumb-reachable).

### drawer
- **Job.** The touch bottom-sheet — mobile counterpart to sheet/dialog for citizen flows.
- **Don't use** on desktop as a novelty → sheet.

### popover
- **Job.** Small anchored surface with interactive content (filters, a mini form, a picker).
- **Don't use** for plain-text labels → `tooltip`; for a list of actions → `dropdown-menu`; anything a user must complete → dialog (popovers dismiss too easily).

### dropdown-menu
- **Job.** Actions on the thing you clicked (row `…` menu, header account menu).
- **Don't use** for choosing form data → `select` (form semantics, typeahead); destructive items use the ink + tint treatment and sit last, separated.

### context-menu
- **Job.** Right-click accelerators on the thing under the cursor (staff tables, document viewer).
- **Every action here must also exist somewhere visible** — right-click is an accelerator, never the only path; touch users never see one.

### menubar
- **Job.** Desktop application-style command surface (document workspace: File/View/Help).
- **Don't use** for site navigation → `navigation-menu` or the sidebar. Staff-only; citizens never need a menubar.

### tooltip
- **Job.** A short text label for an icon-only control, on hover/focus.
- **Critical information never lives only in a tooltip** — touch users and screen-reader flows may never see it. Icon-only buttons still need `aria-label` (the tooltip is a courtesy, not the name).

### hover-card
- **Job.** Rich preview of a linked entity (party, case) on hover — desktop enhancement.
- **Don't** gate any task on it; there must always be a click-through path.

### command
- **Job.** The staff jump-to palette (⌘K): fuzzy search across cases, parties, actions.
- **Don't use** as a general search results page → that's a list screen; citizens get visible search fields, not keyboard palettes.

---

## 6 · Navigation

**The decision:** where am I in the *app* → `sidebar` (workspace) / `navigation-menu` (public site). Where am I in the *hierarchy* → `breadcrumb`. Switching *views of one thing* → `tabs`. Moving through *pages of a list* → `pagination`.

### tabs
- **Job.** Parallel views of the same object (Overview / Documents / Orders on one case).
- **Don't use** for sequential steps → stepper pattern (multi-step flows are ordered; tabs imply free order); don't nest tabs; >5 tabs means the object wants a different layout.

### stepper
- **Job.** Progress indicator for ordered multi-step flows (the filing wizard).
- **Use when** a citizen flow has ≥3 steps — screen-craft §7 makes the indicator mandatory.
- **Don't use** for parallel views → `tabs`; completed state is check + label, never colour alone.

### breadcrumb
- **Job.** Ancestry trail on detail pages — where this page sits, one click up.
- **Don't use** on top-level pages (nothing above them) or as a step indicator.

### pagination
- **Job.** Page-through for long lists, with the count visible ("Page 4 of 12").
- **Don't use** infinite scroll for records with legal weight — people need stable positions they can return to and cite.

### navigation-menu
- **Job.** Top-level navigation for public/citizen surfaces without the workspace sidebar.
- **Don't use** inside the workspace (the sidebar owns that) — two competing navigations disorient.

### sidebar
- **Job.** The workspace navigation rail (staff surfaces). Selection = brand tint; hover = grey.
- Collapses to a sheet drawer below `md` — never simply vanishes.

---

## 7 · Identity & data

### avatar
- **Job.** A person, as image or monogram. Monogram tiles use the `brand-muted` pair.
- **Don't use** for organisations/objects → an icon tile; never as decoration.

### timeline
- **Job.** The chronology of one matter: past = muted dot, current = brand, future = hollow.
- **Use when** showing where a case stands in its life; not a feed, not an activity log with actions (those are list screens).

### kbd
- **Job.** A keyboard key as a key — documenting shortcuts in palettes, menus, help.
- **Don't** make a shortcut discoverable *only* through kbd hints; it decorates, the visible control is the path.

### chart
- **Job.** Data visualisation on the categorical palette (`chart-1…5`) — chosen for mutual distinction.
- **Charts never borrow status colours** — a red line means "series 3", not "bad", or it means nothing. Highlight the current/most-relevant series; legends and tooltips carry labels so colour is never alone.

---

## 8 · Motion (the law lives in design-guidelines §Motion)

Micro feedback (hover, focus, pressed) **100–150ms** · surface transitions (overlays, expansion) **200–250ms** · nothing over **300ms**, ever — this is a tool, not a show. Ease-out entering, ease-in exiting (Material's decelerate/accelerate rule). Motion is *feedback for something the user did* — never ambient, never decorative. `prefers-reduced-motion` collapses all of it to instant state changes, globally.

---

*Companion to `design-guidelines.md` (the law) and `screen-craft.md` (the craft). Ships with `design-rules` in the registry, so consumers inherit the judgment, not just the components.*
