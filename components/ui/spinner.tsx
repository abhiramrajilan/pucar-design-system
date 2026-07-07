import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

// Loading indicator for in-context pending states (in-button submit, inline row
// refresh). NEVER a bare centered spinner for a whole page — screen-craft §5 says
// full-page loading is a skeleton that mirrors the final layout.
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
