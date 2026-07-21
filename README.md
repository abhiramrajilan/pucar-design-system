# Pucar · ON Court design system

The design system for **ON Court** — a courts product for India (Section 138 cheque-bounce matters, CNR numbers, hearings), built first for Kerala. Used by citizens under stress and by court staff all day, so the system optimizes for calm, legible, dignified public service: sentence case everywhere, rationed brand colour, calibrated greys that survive cheap monitors, and a **WCAG 2.2 AA floor that is machine-enforced** — a token change that fails contrast fails the build.

Built on [shadcn/ui](https://ui.shadcn.com) + Tailwind v4 + Radix, with a single-source token pipeline and a self-hosted registry.

## See it

- **Component gallery** — every component rendered against the live tokens: [pucar-ui.vercel.app](https://pucar-ui.vercel.app)
- **Foundations lab** — the token layer *measured in the browser* (31 contrast pairs, live pass/fail, both themes): [/foundations](https://pucar-ui.vercel.app/foundations)

## Use it in your project

```bash
# the theme — tokens, type scale, elevation, full @theme utility mappings
npx shadcn@latest add https://pucar-ui.vercel.app/r/pucar-theme.json

# any component, Pucar-themed (internal deps resolve to this registry)
npx shadcn@latest add https://pucar-ui.vercel.app/r/button.json

# a whole screen pattern
npx shadcn@latest add https://pucar-ui.vercel.app/r/case-dashboard.json
```

AI/agent consumers: [`llms.txt`](https://pucar-ui.vercel.app/llms.txt) is the machine-readable index.

## Develop it

```bash
pnpm install
pnpm dev        # gallery at localhost:3000
```

To change a design value, edit `lib/tokens/tokens.ts`, then:

```bash
pnpm tokens
```

One command runs everything: the **AA contrast gate** (fails below 4.5:1 text / 3:1 boundaries, both themes) → regenerates `app/globals.css` → regenerates `registry.json` + `public/r/` + `public/llms.txt`. Never hand-edit generated files — CI rejects drift.

## The law

The written rules are the point of this repo — components are just the rules made runnable.

| Doc | What it is |
|---|---|
| [`design-guidelines.md`](design-guidelines.md) | The law: sentence case, rationed teal, status colours mean status, the grey ladder, three treatments per status hue, AA floor |
| [`screen-craft.md`](screen-craft.md) | The craft: spacing ladder, page scaffolds, hierarchy, UX patterns, the five screen states, the review pass |
| [`DECISIONS.md`](DECISIONS.md) | Every design ruling, with trigger, rationale, and status |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | The operating model: PR ritual, new-token questions, component intake |
| [`CHANGELOG.md`](CHANGELOG.md) | Dated releases (the registry build refuses to run without one) |

## Repo map

```
lib/tokens/          tokens.ts (source of truth) · ramps.ts · gate.ts (AA gate)
                     build-css.ts · build-registry.ts · build-llms.ts (generators)
components/ui/       48 themed primitives
app/(shell)/         gallery (/) · foundations lab (/foundations) · demo screens
app/filing, scrutiny full-screen flow prototypes
public/r/            the compiled registry (generated)
```

## License

[MIT](LICENSE)
