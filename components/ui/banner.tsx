import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Full-width standing notice that LOADS WITH THE PAGE (Carbon's callout
// semantics): it is information, not feedback — not triggered by an action,
// not dismissible by default, always present while the condition holds
// ("Hearing adjourned to 14 Aug", "Scrutiny in read-only mode"). Feedback on
// an action -> alert (contextual) or toast (background). Pair the tint with
// an icon or label — never colour alone.
const bannerVariants = cva(
  "flex w-full items-center gap-2.5 px-4 py-2.5 text-body-compact [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "bg-info-muted text-info-muted-foreground",
        warning: "bg-warning-muted text-warning-muted-foreground",
        success: "bg-success-muted text-success-muted-foreground",
        neutral: "bg-surface-sunken text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

function Banner({
  className,
  variant = "info",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof bannerVariants>) {
  return (
    <div
      data-slot="banner"
      data-variant={variant}
      role="status"
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Optional trailing slot — a link or quiet action, pushed to the end. */
function BannerAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-action"
      className={cn("ml-auto shrink-0", className)}
      {...props}
    />
  )
}

export { Banner, BannerAction }
