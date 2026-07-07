"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LifeBuoyIcon,
  PlusIcon,
  FlaskConicalIcon,
  ScaleIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const workspace = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/case", label: "Cases", icon: FolderIcon },
  { href: "#", label: "Hearings", icon: CalendarIcon },
  { href: "#", label: "Documents", icon: FileTextIcon },
  { href: "#", label: "Parties", icon: UsersIcon },
]

const PAGE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/case": "Cases",
  "/settings": "New case",
  "/test-ui": "Test UI",
  "/test-ui/payment": "Test UI",
  "/": "Components",
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-body-compact font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pageLabel = PAGE_LABELS[pathname] ?? "Dashboard"

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ScaleIcon className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="font-heading text-body-compact font-semibold">Pucar</div>
            <div className="text-caption text-muted-foreground">ON Court</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          <div className="px-3 pt-2 pb-1 text-caption font-medium text-muted-foreground">
            Workspace
          </div>
          {workspace.map((item) => (
            <NavLink key={item.label} {...item} active={pathname === item.href} />
          ))}
          <div className="px-3 pt-4 pb-1 text-caption font-medium text-muted-foreground">
            Design system
          </div>
          <NavLink href="/" label="Components" icon={LayoutGridIcon} active={pathname === "/"} />
          <NavLink href="/test-ui" label="Test UI" icon={FlaskConicalIcon} active={pathname === "/test-ui"} />
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <a
            href="#"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-body-compact font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LifeBuoyIcon className="size-4" />
            Help &amp; support
          </a>
          <button className="mt-1 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-caption text-primary">MN</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-body-compact font-medium">Adv. Meera Nair</div>
              <div className="truncate text-caption text-muted-foreground">Court staff</div>
            </div>
            <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-1.5 text-body-compact text-muted-foreground">
            <span>ON Court</span>
            <ChevronRightIcon className="size-3.5" />
            <span className="font-medium text-foreground">{pageLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
            <Button variant="outline" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <ThemeToggle />
            <Button asChild>
              <Link href="/settings">
                <PlusIcon />
                New case
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
