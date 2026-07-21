// Visual regression over the review surfaces, light and dark.
// The theme is class-based (next-themes, storageKey "theme") — seeding
// localStorage before load renders the right theme without a toggle click.

import { test, expect, type Page } from "@playwright/test"

const PAGES = [
  { path: "/", name: "gallery" },
  { path: "/foundations", name: "foundations" },
  { path: "/dashboard", name: "dashboard" },
] as const

const THEMES = ["light", "dark"] as const

async function settle(page: Page) {
  // Fonts + recharts initial layout; animations are disabled by config.
  await page.waitForLoadState("networkidle")
  await page.evaluate(() => document.fonts.ready)
  // recharts animates on mount via JS (untouched by animations:'disabled') —
  // its one-shot draw finishes well inside this window.
  await page.waitForTimeout(2000)
}

for (const { path, name } of PAGES) {
  for (const theme of THEMES) {
    test(`${name} — ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme)
      await page.goto(path)
      await settle(page)
      await expect(page).toHaveScreenshot(`${name}-${theme}.png`, {
        fullPage: true,
      })
    })
  }
}
