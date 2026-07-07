@AGENTS.md

# Pucar · ON Court — design system

When building or generating ANY UI in this repo (or with these components), follow this:

1. **Read `design-guidelines.md` AND `screen-craft.md` first.** Guidelines = the law (sentence case, rationed teal, WCAG 2.2 AA floor, calibrated greys, never colour alone). Screen-craft = the craft (spacing ladder, page scaffolds, hierarchy/squint test, UX patterns, the 5 states, density modes). Compose screens from screen-craft's scaffolds — never freestyle layout — and run its §8 review pass before calling any screen done.
2. **Use tokens, never hardcode.** Colour/space/radius/type come from CSS variables + Tailwind utilities (`bg-primary`, `text-muted-foreground`, `text-title-l`, `bg-success-muted`, `--chart-1..5`, …). To change a design value, edit `lib/tokens/tokens.ts` then run `pnpm tokens` (regenerates the token block in `app/globals.css`). Never hand-edit the generated block.
3. **Reuse `components/ui/`** — don't rebuild primitives. Compose from them.
4. **Verify** every change: text ≥ 4.5:1, UI boundaries ≥ 3:1, in **light and dark**. Interactive states must not vanish on a cheap screen.

Product: **Pucar · ON Court** — Indian courts (Section 138 cheque-bounce, CNR numbers, hearings), Kerala. Tone: calm, friendly, dignified public service. Index: `llms.txt`.
