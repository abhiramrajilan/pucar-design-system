# Maintaining & using Pucar UI

Everything the system needs is in files — no chat history required. A fresh session re-reads these and is up to speed.

## Continue in a NEW Claude Code session
- Open Claude Code in **`/Users/abhiramrajilan/Desktop/Shadcn Pucar`** (or `pucar-ui/`).
- `CLAUDE.md` + `design-guidelines.md` load automatically → the assistant knows the rules (sentence case, rationed teal, WCAG 2.2 AA, calibrated greys, etc.). Just say what you want built.
- Cross-session memory lives in `~/.claude/projects/-Users-abhiramrajilan-Desktop-Shadcn-Pucar/memory/` and auto-loads when you open Claude in the **"Shadcn Pucar"** folder (so prefer that folder for full continuity).

## Edit design tokens (colour, type, radius, chart palette…)
1. Edit **`lib/tokens/tokens.ts`** — the single source of truth. (For raw ramps, `ramps.ts`.) **Never** hand-edit the generated block in `app/globals.css`.
2. **`pnpm tokens`** — one command, four steps, in order:
   1. `gate.ts` — AA contrast gate (20 semantic pairs × 2 themes + cycle check). **Fails the build if a token breaks AA** — you cannot ship a failing token by accident.
   2. `build-css.ts` — regenerates the token layer in `globals.css` (including the type-scale/elevation `@theme` block — TYPE/SHADOWS in tokens.ts drive it).
   3. `build-registry.ts` — regenerates `registry.json`, including **`cssVars.theme`** (the Tailwind utility mappings — this is what makes `bg-success`, `text-title-l`, `shadow-raised` etc. work in consumer apps).
   4. `shadcn build` — compiles to `public/r/*.json` for distribution.
3. Check the dev server in **light and dark**. The gate covers contrast; your eyes still cover taste.

Because CSS + registry regenerate together, the registry can no longer drift from tokens.ts. If CI is set up (`.github/workflows/ci.yml`), a PR with stale generated files fails automatically.

## Change the design RULES (policy, not values)
Edit **`design-guidelines.md`** — decoupled from code, safe to edit anytime. This file governs how anything (human or AI) designs with Pucar.

## Team workflow (git — recommended)
The repo root is `pucar-ui/` (already a git repo). Once pushed to GitHub:
- **Designers:** `git clone` once, `git pull` for updates. No folder re-downloading.
- **Token/component proposals:** branch → edit → open a PR (template asks the two questions that matter). CI runs the gate + drift check; Abhiram reviews a small diff instead of taking a call. See `CONTRIBUTING.md`.
- **Vercel:** connect the GitHub repo → every merge to main auto-redeploys the app **and** the registry. No manual publish step.
- **Releases:** note user-visible token/component changes in `CHANGELOG.md`; tag if useful.

## Publish the registry (once)
1. Push to GitHub, then import the repo in Vercel (or `vercel` from the CLI).
2. Registry is live at `https://<you>.vercel.app/r/<name>.json`, and `llms.txt` at `https://<you>.vercel.app/llms.txt`.
3. Update `homepage` in `lib/tokens/build-registry.ts` to the real URL and re-run `pnpm tokens`.

## Use the system in ANOTHER project (the shadcn way — copies code in, you own it)
```bash
npx shadcn@latest init                                              # new app
npx shadcn@latest add https://<you>.vercel.app/r/pucar-theme.json   # tokens + @theme utility mappings
npx shadcn@latest add https://<you>.vercel.app/r/case-dashboard.json # a screen (auto-pulls the theme)
```
Optional namespace — add to the consumer's `components.json`:
```json
{ "registries": { "@pucar": "https://<you>.vercel.app/r/{name}.json" } }
```
then `npx shadcn@latest add @pucar/case-dashboard`.

> `add` **copies** the theme into `globals.css` and components into `components/ui/` and installs deps. It's not git-clone and not "just read the URL". Re-running `add` to update **overwrites local edits** to those files — if a consumer has customized components, update via git diff/PR instead.
> Blocks (`case-dashboard`, `new-case-form`) are designed to render inside **`site-shell`** — add it and wrap pages with it (plus the theme provider).

## Use it with an AI tool (cloud design / a fresh Claude / Pencil)
- Best: give it the **git repo URL** — it gets code, tokens, rules, and history.
- URL-only: give it **`/llms.txt`** (index) and **`design-guidelines.md`** (rules). It reads the rules and either runs the `shadcn add` commands (if it has a shell) or generates screens in-language.
- Pencil: paste `design-guidelines.md` into its guidelines; it doesn't consume shadcn registries directly.

## Registry items
`design-rules` (guidelines + screen-craft, auto-pulled by the theme) · `pucar-theme` · **every `components/ui/*` component** (auto-generated `registry:ui` items — consumers get the Pucar-themed component, deps read from imports, internal deps resolve to this registry) · `status-pill` · `site-shell` · `case-dashboard` · `new-case-form`

Each build stamps the latest `CHANGELOG.md` release date into item descriptions, and refuses to run without one — every published registry state is traceable to a release note.
