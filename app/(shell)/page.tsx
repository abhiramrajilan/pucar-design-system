"use client"

import * as React from "react"
import {
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="rounded-xl border bg-card p-6 text-card-foreground">
        {children}
      </div>
    </section>
  )
}

const invoices = [
  { id: "INV-001", client: "Acme Corp", status: "Paid", amount: "$1,200.00" },
  { id: "INV-002", client: "Globex", status: "Pending", amount: "$800.00" },
  { id: "INV-003", client: "Initech", status: "Overdue", amount: "$450.00" },
]

export default function ComponentsGallery() {
  const [progress, setProgress] = React.useState(40)

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Pucar UI</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Components</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Component gallery
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The critique canvas. Every component renders against the current
            tokens — as we tune color, type, space, and radius, this whole page
            re-renders so you can react to the real thing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Radix base</Badge>
          <Badge variant="secondary">Tailwind v4</Badge>
          <Badge variant="outline">OKLCH tokens</Badge>
          <Badge variant="destructive">Draft</Badge>
        </div>
      </header>

      <Section
        title="Foundations — colour ramps"
        description="Twelve functional steps per family. 1–2 backgrounds · 3–5 components · 6–8 borders · 9–10 solids (AA-tuned) · 11–12 text."
      >
        <div className="space-y-4">
          {(["neutral", "brand", "success", "info", "warning", "destructive"] as const).map(
            (fam) => (
              <div key={fam}>
                <div className="mb-1.5 text-xs font-medium capitalize text-muted-foreground">
                  {fam}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <div key={n} className="flex-1">
                      <div
                        className="h-9 rounded-md ring-1 ring-inset ring-foreground/10"
                        style={{ backgroundColor: `var(--${fam}-${n})` }}
                      />
                      <div className="mt-1 text-center text-[10px] tabular-nums text-muted-foreground">
                        {n}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </Section>

      <Section
        title="Solid actions — AA-tuned"
        description="Every fill clears WCAG AA with its paired foreground (white in light, ink in dark)."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(
            [
              ["Primary", "--primary", "--primary-foreground"],
              ["Success", "--success", "--success-foreground"],
              ["Info", "--info", "--info-foreground"],
              ["Warning", "--warning", "--warning-foreground"],
              ["Destructive", "--destructive", "--destructive-foreground"],
            ] as const
          ).map(([name, bg, fg]) => (
            <div
              key={name}
              className="flex h-16 items-end rounded-lg p-3 text-sm font-medium"
              style={{ backgroundColor: `var(${bg})`, color: `var(${fg})` }}
            >
              {name}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Buttons"
        description="Variants, sizes, and states."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Add">
              <PlusIcon />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <DownloadIcon />
              Download
            </Button>
            <Button variant="outline">
              <BellIcon />
              Notify
            </Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="success">Approve filing</Button>
            <Button variant="warning">Hold for review</Button>
            <Button variant="info">Request documents</Button>
            <Button variant="destructive-solid">Delete draft</Button>
            <Button variant="destructive-ghost">Remove</Button>
          </div>
          <p className="text-caption text-muted-foreground">
            Solid status actions are rationed — at most one strong coloured
            action per view, beside the single teal primary. Hovers shift
            in-hue, never grey.
          </p>
        </div>
      </Section>

      <Section
        title="Grouped actions — button group"
        description="Segmented cluster for one decision (pagination, view switch, split button). Not a place to park several primaries."
      >
        <div className="flex flex-wrap items-center gap-6">
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <ButtonGroupSeparator />
            <Button variant="outline" size="icon" aria-label="More export options">
              <ChevronDownIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>Page 4 of 12</ButtonGroupText>
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </ButtonGroup>
        </div>
      </Section>

      <Section title="Form controls" description="Inputs and selection.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@pucar.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <Select>
              <SelectTrigger id="framework" className="w-full">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="remix">Remix</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Type your message…" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="marketing" />
              <Label htmlFor="marketing">Marketing emails</Label>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Plan</Label>
            <RadioGroup defaultValue="pro" className="space-y-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="free" id="p-free" />
                <Label htmlFor="p-free">Free</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pro" id="p-pro" />
                <Label htmlFor="p-pro">Pro</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-3 sm:col-span-2">
            <Label>Volume</Label>
            <Slider defaultValue={[60]} max={100} step={1} />
          </div>
        </div>
      </Section>

      <Section
        title="Form pattern — field"
        description="The standardized form anatomy: label above field, hint and error in caption, error is destructive plus text — never colour alone. Use Field instead of hand-wiring Label + <p> per screen."
      >
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="f-cnr">CNR number</FieldLabel>
            <Input id="f-cnr" placeholder="KLEK020012342026" className="font-mono" />
            <FieldDescription>
              The 16-character case number printed on your notice.
            </FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="f-amount">Cheque amount</FieldLabel>
            <Input
              id="f-amount"
              aria-invalid="true"
              defaultValue="₹0"
              className="tabular-nums"
            />
            <FieldError>Enter the amount exactly as written on the cheque.</FieldError>
          </Field>
        </FieldGroup>
      </Section>

      <Section title="Data display" description="Table, avatars, progress, skeletons.">
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{inv.client}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === "Paid"
                          ? "secondary"
                          : inv.status === "Overdue"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {inv.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex -space-x-2">
              <Avatar>
                <AvatarFallback>PU</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>KJ</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-56 space-y-2">
              <Progress value={progress} />
              <div className="flex gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setProgress((p) => Math.max(0, p - 10))}
                >
                  −10
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setProgress((p) => Math.min(100, p + 10))}
                >
                  +10
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Feedback" description="Alerts, toasts, and pending states.">
        <div className="space-y-4">
          <Alert>
            <InfoIcon />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              This is an informational alert using semantic tokens.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              Your changes could not be saved. Please try again.
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Saved", {
                  description: "Your changes have been saved.",
                })
              }
            >
              Show toast
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.error("Delete failed", {
                  description: "We couldn't delete that item.",
                })
              }
            >
              Show error toast
            </Button>
            <Button disabled>
              <Spinner />
              Filing complaint…
            </Button>
          </div>
          <p className="text-caption text-muted-foreground">
            Spinner is for in-context pending states (in-button submit). Whole
            pages load with skeletons that mirror the final layout — never a
            bare centered spinner.
          </p>
        </div>
      </Section>

      <Section
        title="Empty states"
        description="First-run teaches the first action. Filtered-empty is a separate, lighter state with a way out."
      >
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No cases yet</EmptyTitle>
            <EmptyDescription>
              When you file a complaint, it appears here with its hearing dates.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>File a complaint</Button>
          </EmptyContent>
        </Empty>
      </Section>

      <Section title="Overlays" description="Dialog, sheet, popover, dropdown, tooltip, hover card.">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pucar" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down the results using the options below.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-2 p-4">
                <Label htmlFor="q">Search</Label>
                <Input id="q" placeholder="Search…" />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Apply</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <SearchIcon />
                Popover
              </Button>
            </PopoverTrigger>
            <PopoverContent className="space-y-2">
              <p className="text-sm font-medium">Quick search</p>
              <Input placeholder="Type to search…" />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Menu
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CopyIcon />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More">
                <MoreHorizontalIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@pucar</Button>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm">
              The Pucar design system — built on shadcn + Radix.
            </HoverCardContent>
          </HoverCard>
        </div>
      </Section>

      <Section title="Navigation" description="Tabs and pagination.">
        <div className="space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4 text-sm text-muted-foreground">
              Overview content — a summary of everything at a glance.
            </TabsContent>
            <TabsContent value="analytics" className="pt-4 text-sm text-muted-foreground">
              Analytics content — charts and trends live here.
            </TabsContent>
            <TabsContent value="reports" className="pt-4 text-sm text-muted-foreground">
              Reports content — exportable summaries.
            </TabsContent>
          </Tabs>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Section>

      <Section title="Cards" description="Composed surfaces with actions.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly revenue</CardTitle>
              <CardDescription>Compared to last month</CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon-sm" aria-label="More">
                  <MoreHorizontalIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">$48,120</div>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="text-foreground">▲ 12.5%</span> vs last month
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">
                <CheckIcon />
                Approve
              </Button>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite your team</CardTitle>
              <CardDescription>
                Add members to collaborate on Pucar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="invite">Email address</Label>
              <div className="flex gap-2">
                <Input id="invite" placeholder="name@pucar.com" />
                <Button>
                  <PlusIcon />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  )
}
