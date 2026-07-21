"use client"

import * as React from "react"
import Link from "next/link"
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
import {
  DescriptionList,
  DescriptionRow,
  DescriptionTerm,
  DescriptionDetail,
} from "@/components/ui/description-list"
import {
  DocumentSlot,
  DocumentSlotActions,
  DocumentSlotContent,
  DocumentSlotMedia,
  DocumentSlotMeta,
  DocumentSlotRequired,
  DocumentSlotTitle,
} from "@/components/ui/document-slot"

import { GalleryExtra } from "./gallery-extra"
import { GalleryPatterns } from "./gallery-patterns"
import { Section } from "./gallery-section"

const invoices = [
  { id: "CF-2026-0141", client: "Ravi Menon", status: "Paid", amount: "₹4,340.00" },
  { id: "CF-2026-0142", client: "Fathima Beevi", status: "Pending", amount: "₹2,180.00" },
  { id: "CF-2026-0138", client: "Anil Thomas", status: "Overdue", amount: "₹1,760.00" },
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
        <div className="space-y-1.5">
          <h1 className="text-title-l">Component gallery</h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            The critique canvas. Every component renders against the current
            tokens — as we tune colour, type, space, and radius, this whole page
            re-renders so you can react to the real thing. Token values
            themselves are measured on{" "}
            <Link href="/foundations" className="text-primary underline-offset-4 hover:underline">
              Foundations
            </Link>
            .
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
        title="Buttons"
        description="The emphasis ladder: exactly one teal primary per view; secondary/outline/ghost step down; status solids rationed to one, only when the action IS the status. Navigation between pages is a link, not a button. Disabled buttons are a last resort — prefer active + inline error."
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

      <Section title="Form controls" description="Choose by count and effect: ≤5 visible options → radio/toggle group · >5 → select · independent declarations → checkbox · instant on/off → switch · exact numbers → input, never a slider. Labels always visible.">
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
          <Field>
            <FieldLabel htmlFor="f-cheque-date">Date on cheque</FieldLabel>
            <Input
              id="f-cheque-date"
              data-prefilled="true"
              defaultValue="15/03/2026"
              className="tabular-nums"
            />
            <FieldDescription>
              Read from your uploaded cheque — check it, then continue. Editing
              clears the marker.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </Section>

      <Section
        title="Documents & provenance"
        description="The e-filing upload grammar: one slot per expected document; filled slots are sunken wells, empty slots are dashed boundaries; quality verdicts pair icon + word. Key–value rows carry preview and scrutiny summaries."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <DocumentSlot variant="filled">
              <DocumentSlotMedia>
                <span className="absolute bottom-1 left-1 rounded-sm bg-foreground px-1 text-caption font-bold tracking-wide text-background">
                  JPG
                </span>
              </DocumentSlotMedia>
              <DocumentSlotContent>
                <DocumentSlotTitle>Cheque (front side)</DocumentSlotTitle>
                <DocumentSlotMeta className="truncate">
                  Cheque-1.jpg · 2.1 MB
                </DocumentSlotMeta>
              </DocumentSlotContent>
              <DocumentSlotActions>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-muted px-2.5 py-1 text-caption text-success-muted-foreground">
                  <CheckIcon className="size-3" /> Good
                </span>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Delete
                </Button>
              </DocumentSlotActions>
            </DocumentSlot>
            <DocumentSlot variant="empty" role="button" tabIndex={0}>
              <DocumentSlotContent>
                <DocumentSlotTitle>
                  Cheque return memo <DocumentSlotRequired />
                </DocumentSlotTitle>
                <DocumentSlotMeta>
                  The memo your bank issued when this cheque bounced.
                </DocumentSlotMeta>
              </DocumentSlotContent>
              <DocumentSlotActions>
                <Button variant="ghost" size="sm" className="text-primary">
                  <PlusIcon /> Choose file
                </Button>
              </DocumentSlotActions>
            </DocumentSlot>
            <DocumentSlot variant="empty" role="button" tabIndex={0}>
              <DocumentSlotContent>
                <DocumentSlotTitle>
                  Reply to the demand notice
                  <Badge variant="outline">Optional</Badge>
                </DocumentSlotTitle>
                <DocumentSlotMeta>
                  The accused&apos;s reply to the notice, if any.
                </DocumentSlotMeta>
              </DocumentSlotContent>
              <DocumentSlotActions>
                <Button variant="ghost" size="sm" className="text-primary">
                  <PlusIcon /> Choose file
                </Button>
              </DocumentSlotActions>
            </DocumentSlot>
          </div>
          <DescriptionList>
            <DescriptionRow>
              <DescriptionTerm>Full name</DescriptionTerm>
              <DescriptionDetail>Prateek Agrawal</DescriptionDetail>
            </DescriptionRow>
            <DescriptionRow>
              <DescriptionTerm>Cheque no. / date</DescriptionTerm>
              <DescriptionDetail>
                <span className="font-mono text-muted-foreground">004821</span> ·
                15/03/2026
              </DescriptionDetail>
            </DescriptionRow>
            <DescriptionRow>
              <DescriptionTerm>Amount</DescriptionTerm>
              <DescriptionDetail className="tabular-nums">₹50,25,000</DescriptionDetail>
            </DescriptionRow>
            <DescriptionRow>
              <DescriptionTerm>Returned</DescriptionTerm>
              <DescriptionDetail>05/04/2026 — Funds insufficient</DescriptionDetail>
            </DescriptionRow>
          </DescriptionList>
        </div>
      </Section>

      <Section title="Data display" description="Tables are records × attributes for staff (one primary line per row, quiet headers); one record's facts want a description list. Skeletons mirror the final layout — a whole page never loads behind a bare spinner.">
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Court fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-muted-foreground">{inv.id}</TableCell>
                  <TableCell className="font-medium">{inv.client}</TableCell>
                  <TableCell>
                    {/* Status means status: the chip's muted variants, never neutral greys */}
                    <Badge
                      variant={
                        inv.status === "Paid"
                          ? "success"
                          : inv.status === "Overdue"
                            ? "destructive"
                            : "warning"
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

      <Section title="Feedback" description="Routing: one field's problem → inline field error · section-blocking → alert (persists until resolved) · background result → toast (auto-dismisses, so never things requiring action) · standing notice → banner region. Never a toast for a field error; never an alert for a success.">
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

      <Section title="Overlays" description="One decision → dialog · destructive confirm → alert-dialog naming object + consequence · side context while the list stays visible → sheet · anchored actions → dropdown · icon labels → tooltip (critical info never lives only there). Multi-section or legal weight → a full page.">
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
              <p className="text-body-compact font-medium">Quick search</p>
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
            <HoverCardContent className="text-body-compact">
              The Pucar design system — built on shadcn + Radix.
            </HoverCardContent>
          </HoverCard>
        </div>
      </Section>

      <Section title="Navigation" description="Tabs switch parallel views of one object — sequential steps want a stepper, not tabs. Pagination keeps citable positions ('Page 4 of 12'); no infinite scroll for records with legal weight.">
        <div className="space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4 text-body-compact text-muted-foreground">
              Overview content — a summary of everything at a glance.
            </TabsContent>
            <TabsContent value="analytics" className="pt-4 text-body-compact text-muted-foreground">
              Analytics content — charts and trends live here.
            </TabsContent>
            <TabsContent value="reports" className="pt-4 text-body-compact text-muted-foreground">
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

      <Section title="Cards" description="A bounded region with one hairline, flat by default. Never nest cards — inner grouping is a sunken well on fill alone. Raised shadow only for genuine lift.">
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
              <div className="text-title-l tabular-nums">₹48,120</div>
              <p className="mt-1 text-body-compact text-muted-foreground">
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

      <GalleryExtra />

      <GalleryPatterns />
    </div>
  )
}
