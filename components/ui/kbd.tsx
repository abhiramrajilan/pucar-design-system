import * as React from "react"

import { cn } from "@/lib/utils"

// A keyboard key, rendered as a key: mono caption on a muted cap with a
// hairline. For documenting shortcuts (command palette, menus, help) — never
// the only way a shortcut is discoverable, and never for emphasis.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border bg-muted px-1 font-mono text-caption text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
