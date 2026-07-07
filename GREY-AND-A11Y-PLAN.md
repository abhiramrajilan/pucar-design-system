# Status — grey/surface fix · button hovers · accessibility gaps

**Last updated: 6 July 2026.** Steps 1–3 of the original plan are **DONE and verified in code**. Of §4: labels are done, touch targets and Indic fonts are **explicitly deferred by Abhiram** (see CONTRIBUTING.md § Deferred decisions — do not implement without his sign-off), timeout warning remains open. Do not re-implement the completed work.

---

## ✅ Done (do not redo)

1. **Button hovers — hue-matched.** `components/ui/button.tsx` has solid `success` / `warning` / `info` / `destructive-solid` variants with in-hue `color-mix` hovers (darken in light, lighten in dark), plus `destructive-ghost`. Neutral variants (`outline`/`secondary`/`ghost`) hover to `accent` *by design*.
2. **Grey → named surface tokens.** `tokens.ts` has `surface` / `surface-raised` / `surface-sunken` / `track`; the `@theme inline` mappings exist; raw `var(--neutral-N)` usage in app/components is **zero** (verified by grep).
3. **Primitives → semantic.** Screens read semantic utilities only; ramp/surface changes propagate via `pnpm tokens`.

Also done since the original plan: `pnpm tokens` now runs the **AA contrast gate** (`lib/tokens/gate.ts`), regenerates `globals.css` **and** the registry in one pass — drift between tokens.ts and `public/r/` can no longer accumulate silently.

---

## §4 accessibility gaps — current state (2026-07-06)

- ⏸ **Touch targets 44×44 — DEFERRED by Abhiram (2026-07-06).** Controls stay 40px; 40px meets WCAG 2.2 AA (24px min), 44 is the AAA/mobile bar. The visual implication of raising it is unassessed — do not implement (not even invisible hit-areas) without his explicit decision. Options on the table when he decides: raise defaults to `h-11`, invisible hit-area insets, or citizen/staff split via `size="lg"`.
- ✅ **Visible labels (no placeholder-only)** — audited 2026-07-06: form screens pair every placeholder with a label (the settings/new-case `Field` wrapper), the gallery search has a visible label, and the one real gap (scrutiny flag-composer textarea) got an `aria-label`. New forms should use `components/ui/field.tsx`, which makes label-less fields hard to write.
- ⏸ **Indic scripts (Devanagari/Tamil/Malayalam) — DEFERRED (2026-07-06)** pending the font decision (OS fallback vs. self-hosted Noto Sans Malayalam). When decided: add fallbacks to `FONTS.sans` in `tokens.ts` after Helvetica Neue.
- ⬜ **Timeout warnings before session expiry** — still open; build a session-timeout warning dialog/toast pattern (component in the system; timing logic in the app). WCAG 2.2.1 — court filings are long forms; silent expiry destroys a citizen's work.

**Verify (test pass, not code):** screen readers (NVDA/JAWS/VoiceOver); 200% text zoom (watch fixed `h-*`); voice-control names match visible labels; no critical info in hover-only tooltips.

Paths note: pages live under `app/(shell)/` (e.g. `app/(shell)/dashboard/page.tsx`), and the new-case form currently lives at `app/(shell)/settings/page.tsx`.
