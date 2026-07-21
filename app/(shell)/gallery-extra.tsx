"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  BoldIcon,
  CalendarIcon,
  CopyIcon,
  IndianRupeeIcon,
  ItalicIcon,
  LayoutGridIcon,
  ListIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UnderlineIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Row, Section } from "./gallery-section"

const filings = [
  { month: "Feb", filed: 42, disposed: 31 },
  { month: "Mar", filed: 51, disposed: 38 },
  { month: "Apr", filed: 47, disposed: 44 },
  { month: "May", filed: 63, disposed: 41 },
  { month: "Jun", filed: 58, disposed: 52 },
  { month: "Jul", filed: 71, disposed: 49 },
]

const filingsConfig = {
  filed: { label: "Filed", color: "var(--chart-1)" },
  disposed: { label: "Disposed", color: "var(--chart-2)" },
} satisfies ChartConfig

const pendency = [
  { month: "Feb", days: 186 },
  { month: "Mar", days: 179 },
  { month: "Apr", days: 171 },
  { month: "May", days: 168 },
  { month: "Jun", days: 154 },
  { month: "Jul", days: 149 },
]

const pendencyConfig = {
  days: { label: "Median pendency (days)", color: "var(--chart-3)" },
} satisfies ChartConfig

const acts = [
  "Negotiable Instruments Act, 1881 — S.138",
  "Negotiable Instruments Act, 1881 — S.139",
  "Negotiable Instruments Act, 1881 — S.142",
  "Code of Criminal Procedure, 1973 — S.200",
  "Code of Criminal Procedure, 1973 — S.202",
  "Indian Evidence Act, 1872 — S.65B",
  "Indian Penal Code, 1860 — S.420",
  "Information Technology Act, 2000 — S.4",
  "Kerala Court Fees Act, 1959 — Sch. II",
  "Limitation Act, 1963 — Art. 137",
]

export function GalleryExtra() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 7, 12))
  const [density, setDensity] = React.useState("comfortable")
  const [advancedOpen, setAdvancedOpen] = React.useState(false)

  return (
    <>
      <Section
        title="Disclosure — accordion"
        description="Progressive disclosure for citizen-facing help. Sentence case, one question per row, answers in plain language."
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what">
            <AccordionTrigger>What is a Section 138 complaint?</AccordionTrigger>
            <AccordionContent>
              It is a criminal complaint you can file when a cheque given to you
              is returned unpaid by the bank — usually for insufficient funds.
              You must send a demand notice within 30 days of the return memo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fee">
            <AccordionTrigger>What court fee will I pay?</AccordionTrigger>
            <AccordionContent>
              The fee is calculated from the cheque amount under the Kerala
              Court Fees Act. We show you the exact figure before you pay, and
              you can save the filing as a draft until then.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="time">
            <AccordionTrigger>How long does a hearing take to list?</AccordionTrigger>
            <AccordionContent>
              Most complaints are listed for first hearing within six weeks of
              scrutiny clearance. You will get an SMS and an entry in your
              hearings list as soon as a date is fixed.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Destructive confirmation — alert dialog"
        description="Names the object and the consequence in one sentence, per screen-craft §5. Never a bare 'Are you sure?'."
      >
        <Row>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Withdraw complaint</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Withdraw the complaint against Suresh Kumar?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The draft, its five uploaded documents, and the court fee
                  calculation will be deleted. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep the draft</AlertDialogCancel>
                <AlertDialogAction variant="destructive-solid">
                  Withdraw complaint
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className="text-caption text-muted-foreground">
            Confirm is the only strong colour in the view.
          </span>
        </Row>
      </Section>

      <Section
        title="Dates — calendar"
        description="Hearing and adjournment pickers. The selected day carries the brand tint; today is marked without colour alone."
      >
        <div className="flex flex-wrap gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
            className="rounded-xl border p-3"
          />
          <div className="space-y-2">
            <div className="text-caption text-muted-foreground">Selected</div>
            <div className="text-body font-medium">
              {date
                ? date.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "No date chosen"}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Data visualisation — charts"
        description="The categorical palette (chart-1…5), chosen for mutual distinction — never borrowed status colours. Legends and tooltips carry labels so the chart never depends on colour alone."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="text-body font-medium">Filed vs disposed</div>
            <ChartContainer config={filingsConfig} className="h-56 w-full">
              <BarChart data={filings}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="filed" fill="var(--color-filed)" radius={4} isAnimationActive={false} />
                <Bar
                  dataKey="disposed"
                  fill="var(--color-disposed)"
                  radius={4}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="space-y-3">
            <div className="text-body font-medium">Median pendency</div>
            <ChartContainer config={pendencyConfig} className="h-56 w-full">
              <LineChart data={pendency}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="days"
                  stroke="var(--color-days)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </Section>

      <Section
        title="Progressive disclosure — collapsible"
        description="Rare or advanced fields are hidden behind a trigger, never deleted. Critical information never lives only behind one."
      >
        <Collapsible
          open={advancedOpen}
          onOpenChange={setAdvancedOpen}
          className="max-w-md space-y-3"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-body font-medium">Advanced filing options</div>
              <p className="text-caption text-muted-foreground">
                Exemption applications and interim prayers.
              </p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {advancedOpen ? "Hide" : "Show"}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-surface-sunken p-4">
              <Checkbox id="exemption" className="mt-0.5" />
              <Label htmlFor="exemption" className="font-normal">
                Apply for exemption from personal appearance
              </Label>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-surface-sunken p-4">
              <Checkbox id="interim" className="mt-0.5" />
              <Label htmlFor="interim" className="font-normal">
                Seek interim compensation under S.143A
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section
        title="Search palette — command"
        description="Staff jump-to. Rendered inline here so it can be reviewed; in product it opens as a dialog on ⌘K."
      >
        <Command className="max-w-lg rounded-xl border">
          <CommandInput placeholder="Search cases, parties, or CNR…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Cases">
              <CommandItem>
                Ravi Menon v. Suresh Kumar
                <CommandShortcut>S.138</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Fathima Beevi v. Anil Thomas
                <CommandShortcut>S.138</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                File a new complaint
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Open today&apos;s cause list
                <CommandShortcut>⌘L</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Section>

      <Section
        title="Mobile overlay — drawer"
        description="The bottom-sheet counterpart to Sheet, for touch. Citizen flows on small screens reach for this."
      >
        <Row>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open hearing details</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Hearing on 12 August 2026</DrawerTitle>
                  <DrawerDescription>
                    Judicial First Class Magistrate Court-II, Ernakulam.
                    Reporting time 10:30 am.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Add to calendar</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </Row>
      </Section>

      <Section
        title="Composed fields — input group"
        description="Affixes and inline actions without breaking the field boundary or the focus ring."
      >
        <div className="grid max-w-xl gap-4">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search cases" aria-label="Search cases" />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>
              <IndianRupeeIcon />
            </InputGroupAddon>
            <InputGroupInput
              defaultValue="4,50,000"
              inputMode="numeric"
              aria-label="Cheque amount"
              className="tabular-nums"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>INR</InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              defaultValue="KLER01-000234-2026"
              readOnly
              aria-label="CNR number"
              className="font-mono"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Copy CNR">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </Section>

      <Section
        title="Verification — one-time code"
        description="e-filing OTP. Monospaced, grouped, and large enough to read aloud from an SMS."
      >
        <div className="space-y-3">
          <Label htmlFor="otp">Enter the code sent to ••••• 4821</Label>
          <InputOTP maxLength={6} id="otp">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-caption text-muted-foreground">
            The code expires in 10 minutes.
          </p>
        </div>
      </Section>

      <Section
        title="Application menus — menubar"
        description="Desktop-style command surface for the document workspace. Sentence case throughout."
      >
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New complaint <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Open draft <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Export as PDF</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>
                Show annotations
              </MenubarCheckboxItem>
              <MenubarCheckboxItem>Show OCR text layer</MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem>Fit to width</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Filing guide</MenubarItem>
              <MenubarItem>Contact the registry</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Section>

      <Section
        title="Top-level navigation — navigation menu"
        description="For public/citizen surfaces where the workspace sidebar isn't present."
      >
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>File a case</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[420px] gap-1 p-3">
                  {[
                    ["Cheque bounce (S.138)", "Criminal complaint for a dishonoured cheque."],
                    ["Civil suit", "Money recovery and contract disputes."],
                    ["Caveat", "Notice to be heard before an order is passed."],
                  ].map(([title, blurb]) => (
                    <li key={title}>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="block rounded-md p-3 hover:bg-accent"
                        >
                          <div className="text-body font-medium">{title}</div>
                          <p className="text-caption text-muted-foreground">
                            {blurb}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Track a case</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-1 p-3">
                  {[
                    ["By CNR number", "The 16-character case identifier."],
                    ["By party name", "Search hearings by who is involved."],
                  ].map(([title, blurb]) => (
                    <li key={title}>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="block rounded-md p-3 hover:bg-accent"
                        >
                          <div className="text-body font-medium">{title}</div>
                          <p className="text-caption text-muted-foreground">
                            {blurb}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Section>

      <Section
        title="Long lists — scroll area"
        description="Multi-select from many options, per screen-craft §5: checkboxes inside a bounded scroll region rather than a 40-item select."
      >
        <div className="max-w-md space-y-2">
          <div className="text-caption text-muted-foreground">
            Sections invoked
          </div>
          <ScrollArea className="h-56 rounded-xl border">
            <div className="space-y-1 p-3">
              {acts.map((act, i) => (
                <label
                  key={act}
                  className="flex items-start gap-3 rounded-md p-2 hover:bg-accent"
                >
                  <Checkbox defaultChecked={i < 2} className="mt-0.5" />
                  <span className="text-body-compact">{act}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Section>

      <Section
        title="Dividers — separator"
        description="A quiet hairline for meta rows and section breaks. Prefer dividers over density (design-guidelines §2)."
      >
        <div className="space-y-6">
          <div className="flex h-5 items-center gap-3 text-body-compact text-muted-foreground">
            <span>Filed 4 June 2026</span>
            <Separator orientation="vertical" />
            <span className="font-mono">KLER01-000234-2026</span>
            <Separator orientation="vertical" />
            <span>Ernakulam</span>
          </div>
          <Separator />
          <p className="text-body-compact text-muted-foreground">
            Horizontal separator above a following block.
          </p>
        </div>
      </Section>

      <Section
        title="Toggles — toggle and toggle group"
        description="≤5 mutually exclusive options stay visible as a toggle group rather than collapsing into a select."
      >
        <div className="space-y-6">
          <Row label="Single toggles — formatting">
            <Toggle aria-label="Bold">
              <BoldIcon />
            </Toggle>
            <Toggle aria-label="Italic">
              <ItalicIcon />
            </Toggle>
            <Toggle aria-label="Underline">
              <UnderlineIcon />
            </Toggle>
          </Row>

          <Row label="Single-select group — table density">
            <ToggleGroup
              type="single"
              value={density}
              onValueChange={(v) => v && setDensity(v)}
              variant="outline"
            >
              <ToggleGroupItem value="comfortable">
                <ListIcon />
                Comfortable
              </ToggleGroupItem>
              <ToggleGroupItem value="compact">
                <SlidersHorizontalIcon />
                Compact
              </ToggleGroupItem>
            </ToggleGroup>
            <span className="text-caption text-muted-foreground">
              Selected: {density}
            </span>
          </Row>

          <Row label="View switch">
            <ToggleGroup type="single" defaultValue="list" variant="outline">
              <ToggleGroupItem value="list" aria-label="List view">
                <ListIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGridIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="calendar" aria-label="Calendar view">
                <CalendarIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          </Row>
        </div>
      </Section>
    </>
  )
}
