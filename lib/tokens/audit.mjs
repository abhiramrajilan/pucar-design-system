// Perceptual + contrast audit of the ramps. Run: node lib/tokens/audit.mjs
// Answers: are steps perceptually even? how close are Brand vs Success? does Grass separate better?
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const radix = require("@radix-ui/colors")

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const srgbToLin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
const lin = (h) => hexToRgb(h).map(srgbToLin)
const relLum = (h) => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const wcag = (a, b) => { const L1 = relLum(a), L2 = relLum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05) }

function oklab(h) {
  const [r, g, b] = lin(h)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
const dEok = (a, b) => { const x = oklab(a), y = oklab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100 }
const hue = (h) => { const [, a, b] = oklab(h); return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 }
const dHue = (a, b) => { let d = Math.abs(hue(a) - hue(b)) % 360; return d > 180 ? 360 - d : d }

// APCA (0.0.98G-4g)
function apca(text, bg) {
  const Y = (h) => { const [r, g, b] = hexToRgb(h).map((v) => Math.pow(v / 255, 2.4)); return 0.2126729 * r + 0.7151522 * g + 0.072175 * b }
  const clamp = (y) => (y < 0.022 ? y + Math.pow(0.022 - y, 1.414) : y)
  let Yt = clamp(Y(text)), Yb = clamp(Y(bg))
  if (Math.abs(Yb - Yt) < 0.0005) return 0
  let S, Lc
  if (Yb > Yt) { S = (Math.pow(Yb, 0.56) - Math.pow(Yt, 0.57)) * 1.14; Lc = S < 0.1 ? 0 : (S - 0.027) * 100 }
  else { S = (Math.pow(Yb, 0.65) - Math.pow(Yt, 0.62)) * 1.14; Lc = S > -0.1 ? 0 : (S + 0.027) * 100 }
  return Math.round(Lc)
}

const ramp = (name) => Object.values(radix[name])
const p = (n, w = 6) => String(n).padStart(w)

console.log("\n=== 1 · ADJACENT-STEP PERCEPTUAL GAP (ΔE OKLab ×100) — is spacing even? ===")
for (const [label, key] of [["Neutral (slate)", "slate"], ["Brand (teal)", "teal"], ["Success (green)", "green"]]) {
  const r = ramp(key)
  const gaps = r.slice(1).map((h, i) => dEok(r[i], h))
  const med = [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)]
  const row = gaps.map((g, i) => {
    const flag = g > med * 1.9 ? "▲" : g < med * 0.5 ? "·" : " "
    return `${i + 1}→${i + 2}:${p(g.toFixed(1), 5)}${flag}`
  })
  console.log(`\n${label}  (median gap ${med.toFixed(1)}, ▲=>1.9× jump, ·=<0.5× tight)`)
  console.log("  " + row.join("  "))
}

console.log("\n\n=== 2 · BRAND vs SUCCESS confusability (higher ΔE / Δhue = more distinct) ===")
for (const step of [8, 9, 10, 11]) {
  const teal = ramp("teal")[step - 1]
  const green = ramp("green")[step - 1]
  const grass = ramp("grass")[step - 1]
  console.log(
    `step ${step}:  Teal↔Green  ΔE ${p(dEok(teal, green).toFixed(1), 5)}  Δhue ${p(dHue(teal, green).toFixed(0), 3)}°   |   Teal↔Grass  ΔE ${p(dEok(teal, grass).toFixed(1), 5)}  Δhue ${p(dHue(teal, grass).toFixed(0), 3)}°`
  )
}
console.log(`\n  hue angles (OKLab):  teal-9 ${hue(ramp("teal")[8]).toFixed(0)}°   green-9 ${hue(ramp("green")[8]).toFixed(0)}°   grass-9 ${hue(ramp("grass")[8]).toFixed(0)}°`)

console.log("\n\n=== 3 · TEXT LEGIBILITY on neutral-1 (WCAG ratio · APCA Lc) ===")
const bg = ramp("slate")[0]
for (const [label, key, step] of [["Brand-11", "teal", 11], ["Success-11", "green", 11], ["Grass-11", "grass", 11], ["Info-11", "blue", 11], ["Body neutral-12", "slate", 12]]) {
  const c = ramp(key)[step - 1]
  console.log(`  ${label.padEnd(16)} ${c}  WCAG ${wcag(c, bg).toFixed(2)}:1   APCA Lc ${apca(c, bg)}`)
}
console.log("")
