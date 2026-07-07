import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

// Typeface: a system-font stack led by Helvetica Neue — zero download (ideal for
// low-network), native feel, broadly available. Defined in app/globals.css @theme.
// (Malayalam falls back to the OS script font; bundle Noto Sans Malayalam later if needed.)

export const metadata: Metadata = {
  title: "Pucar UI — Design System",
  description: "The Pucar design system playground and component library.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
