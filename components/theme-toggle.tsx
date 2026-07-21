"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

// Hydration-safe "mounted" without setState-in-effect: the store never changes,
// so the client snapshot (true) simply replaces the server snapshot (false) on
// hydration — same guarantee as the mount-effect gate, zero extra renders.
const emptySubscribe = () => () => {}
const useMounted = () =>
  React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
