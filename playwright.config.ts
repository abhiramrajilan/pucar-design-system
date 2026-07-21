// Visual regression — the gallery is "the visual regression canvas"
// (CONTRIBUTING); this makes that literal. Screenshots of the review surfaces
// at the law's breakpoints, light and dark, compared against committed
// baselines. A token or component change that shifts rendering fails here.
//
// Baselines are PER-PLATFORM (font rasterization differs): darwin baselines
// are generated locally (`pnpm test:visual -- --update-snapshots`), linux
// baselines come from the CI bootstrap run's artifact and get committed.
//
// Run: pnpm test:visual   (needs `pnpm build` first — tests run against
// `next start`, never the dev server, so no dev overlay in the shots)

import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  snapshotPathTemplate:
    "tests/__screenshots__/{platform}/{projectName}/{arg}{ext}",
  expect: {
    // Full-page shots of very tall pages + recharts' one-shot JS mount
    // animation need a wider stabilization window than the 5s default.
    timeout: 30_000,
    toHaveScreenshot: {
      // Anti-aliasing wiggle room only — real drift must fail.
      maxDiffPixelRatio: 0.002,
      animations: "disabled",
    },
  },
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } },
    },
  ],
  webServer: {
    command: "pnpm exec next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
