import { SiteShell } from "@/components/site-shell"

// Everything in this group renders inside the workspace shell (sidebar +
// header). Focused flows (e.g. /filing) live outside it, so they get the bare
// providers from the root layout and none of the app chrome.
export default function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SiteShell>{children}</SiteShell>
}
