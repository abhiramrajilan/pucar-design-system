# Pucar · ON Court — design system

Pucar's design system for the ON Court product (Indian courts — Section 138, CNR, hearings; Kerala). Built on shadcn/ui + Tailwind v4, Radix-anchored tokens, machine-verified WCAG 2.2 AA in light and dark (the build fails below the floor).

## Read first (the design law + the craft)
- **design-guidelines.md** — the LAW: sentence case only; brand teal rationed to primary/active/focus; status colours mean status; **three treatments per status hue** (solid = the one strong action · opaque tint pair = chips/callouts · ink = text/icons on neutral — solids are never text, alpha status fills are banned); the **monotone grey ladder** (muted 2 → sunken 2½ → accent 3 hover → accent-strong 4 engaged → track 5 — interaction moves one step down); **control metrics** (fields default 40px; radius by role: container xl · control lg · inset md/sm · chip full; container padding 24); AA floor; never colour alone.
- **screen-craft.md** — the CRAFT: spacing ladder (+ micro-spacing 2/6/10 inside controls only), page scaffolds (form/list/detail/dashboard/empty), hierarchy & squint test, UX patterns (dialog vs sheet vs page, feedback, filtering, disclosure), the 5 screen states, citizen vs staff density, the mandatory review pass. Generating ANY screen? Follow both.
- **DECISIONS.md** — every ruling with trigger + rationale. Check before "fixing" anything deliberate.

## Rules of thumb
Sentence case. Teal rationed. Status = meaning (chips/inks), charts = categorical. One chip: Badge. AA machine-verified. Generous spacing, ladder-only gaps. Never colour alone (pair with icon/arrow/label). Selection = brand tint; hover = grey; disabled = washed. Live gallery at `/`, measured tokens at `/foundations`.
