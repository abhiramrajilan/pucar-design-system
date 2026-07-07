# Contributing to Pucar UI — the operating model

*One page. Working assumptions are marked; Abhiram owns final say on all of them.*

## Roles

- **System owner (Abhiram):** merges to main, owns `tokens.ts`, `ramps.ts`, `design-guidelines.md`, and the semantic vocabulary. The design law changes only through him.
- **Designers (team):** design in code inside a clone of this repo, or in their own apps via the registry. Propose changes via PR — never push to main directly. *(Assumption: 2–3 designers, one product.)*
- **Developers:** consume via `shadcn add` or the repo. Component bugs → PR like anyone else.

## The PR ritual (replaces "get on a call")

1. Branch: `git checkout -b propose/<short-name>`
2. Make the change:
   - **Token value change** → edit `lib/tokens/tokens.ts`, run `pnpm tokens`, commit source + generated files together.
   - **New semantic token** → same, plus answer the two questions in the PR template (below).
   - **Component change** → edit `components/ui/*`, follow `design-guidelines.md`.
3. Open the PR. CI runs the AA gate and checks that generated files match `tokens.ts` (no half-run pipelines).
4. Abhiram reviews the diff — a token proposal is typically 3–10 lines. Merge → Vercel auto-redeploys → everyone `git pull`s.

## The two questions every new semantic token must answer

1. **What *role* does this name?** (Not "what colour is it" — what recurring decision does it remove?)
2. **Why can't an existing token serve it?** (Check `muted`, `accent`, `surface-*`, the status families first.)

If either answer is weak, it's probably a one-off — use an existing token. This is the guardrail against vocabulary sprawl: today `muted`/`surface-sunken` intentionally share a value; ten accidental near-duplicates would dissolve the system.

## Hard rules (CI enforces the first two)

- Never hand-edit the generated block in `app/globals.css` or `registry.json` / `public/r/*` — they are build outputs.
- A token change that fails the AA gate does not merge. No exceptions, no "it looks fine".
- Follow `design-guidelines.md` for anything visual. If the guideline is wrong, PR the guideline — don't quietly violate it.
- User-visible changes get a line in `CHANGELOG.md` in the same PR.

## Adding a NEW component — the intake ritual

A new component is a vocabulary change, not a code drop. Every addition goes through these steps, in order:

1. **Justify the role.** One paragraph in the PR: what recurring screen problem does this solve, and which existing component *almost* serves it — why not? (Same guardrail as new tokens: weak answer → compose from what exists.)
2. **Port, then theme.** Start from the stock shadcn implementation where one exists — its aria wiring and keyboard behaviour are battle-tested. Then theme with **semantic tokens only** (no raw hex, no raw `neutral-N`, no off-ladder spacing), follow file conventions (`data-slot`, cva variants, `cn`), and encode the *usage rule* as a comment at the top of the file (see `spinner.tsx`, `button-group.tsx` — agents read these).
3. **Show it in the gallery.** Add a section to the component gallery (`app/(shell)/page.tsx`) demonstrating every variant plus the rationing rule. A component that isn't in the gallery doesn't exist — the gallery is the review surface and the visual regression canvas.
4. **Run `pnpm tokens`.** Distribution is automatic — the registry generator scans `components/ui/` and ships every component with deps read from its imports. There is nothing to register by hand.
5. **Changelog.** Add the entry — the registry build *refuses to run* without a dated release note.
6. **PR** with light + dark screenshots of the gallery section. Review checks the screen-craft review pass (§8), not just the code.

The same ritual applies to new **blocks/templates** (screen patterns), with step 3 being the pattern's own page instead of a gallery section.

## Deferred decisions — do not "fix" these

Decisions Abhiram has explicitly parked. Changing them requires his sign-off, not a well-meaning PR:

- **Touch targets stay 40px** (2026-07-06). The 44px citizen-facing bar (GREY-AND-A11Y-PLAN §4) is deliberately unimplemented — the visual implication is unassessed. Don't raise control heights or add hit-area insets to meet it.
- **Indic font fallbacks** (2026-07-06). `FONTS.sans` intentionally lacks Devanagari/Tamil/Malayalam entries pending a font decision (bundle Noto Sans Malayalam vs. OS fallback). Don't add fallbacks ad hoc.

## Local improvements in your own app

If you customized a copied component in a consumer app and it's good, bring it home: PR the change to this repo so everyone gets it. Improvements that stay in your local copy die there.
