"use client"

import * as React from "react"
import {
  CalendarPlusIcon,
  ChevronLeftIcon,
  FileTextIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const facts = [
  { label: "Case type", value: "S.138 NI Act" },
  { label: "Court", value: "JFCM-II, Kochi" },
  { label: "Filed", value: "12 Mar 2024" },
  { label: "Next hearing", value: "8 Jul 2026" },
  { label: "Claim amount", value: "₹2,40,000" },
  { label: "Stage", value: "Evidence" },
]

const timeline = [
  { date: "8 Jul 2026", purpose: "Evidence", note: "Complainant evidence to be recorded.", upcoming: true },
  { date: "15 May 2026", purpose: "Framing of charges", note: "Charges framed; posted for evidence." },
  { date: "2 Apr 2026", purpose: "Appearance", note: "Accused appeared; bail continued." },
  { date: "12 Mar 2024", purpose: "Registration", note: "Complaint registered under Section 138." },
]

const documents = [
  { name: "Dishonoured cheque (copy)", kind: "PDF · 240 KB" },
  { name: "Bank return memo", kind: "PDF · 88 KB" },
  { name: "Statutory demand notice", kind: "PDF · 132 KB" },
  { name: "Vakalatnama", kind: "PDF · 64 KB" },
]

export default function CaseDetailPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <ChevronLeftIcon />
          Cases
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-heading text-title-l tracking-tight">Rajini K. v. State</h1>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-body-compact text-muted-foreground">
                KLKM01-001234/2024
              </p>
              <Badge variant="info">Under hearing</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <PlusIcon />
              Add note
            </Button>
            <Button>
              <CalendarPlusIcon />
              Schedule hearing
            </Button>
          </div>
        </div>
      </div>

      {/* Key facts */}
      <Card>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-caption text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-body-compact font-medium tabular-nums">{f.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Main + rail */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="hearings">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hearings">Hearings</TabsTrigger>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-6">
              <Card>
                <CardContent className="text-body text-muted-foreground">
                  A complaint under Section 138 of the Negotiable Instruments Act
                  concerning a dishonoured cheque of ₹2,40,000. The matter is at the
                  evidence stage; complainant evidence is scheduled for the next hearing.
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hearings" className="pt-6">
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    {timeline.map((h) => (
                      <li key={h.date} className="flex gap-4 px-6 py-4">
                        <div className="flex flex-col items-center pt-1">
                          <span
                            className={cn(
                              "size-2.5 rounded-full",
                              h.upcoming ? "bg-primary" : "bg-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-body-compact font-medium">{h.purpose}</span>
                            {h.upcoming ? <Badge variant="success">Upcoming</Badge> : null}
                          </div>
                          <p className="text-body-compact text-muted-foreground">{h.note}</p>
                        </div>
                        <div className="shrink-0 text-caption tabular-nums text-muted-foreground">
                          {h.date}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parties" className="pt-6 text-body-compact text-muted-foreground">
              Complainant, respondent and advocates — see the panel on the right.
            </TabsContent>
            <TabsContent value="documents" className="pt-6 text-body-compact text-muted-foreground">
              Case documents — see the panel on the right.
            </TabsContent>
          </Tabs>
        </div>

        {/* Rail */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-brand-muted text-caption text-brand-muted-foreground">RK</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-body-compact font-medium">Rajini K.</div>
                  <div className="text-caption text-muted-foreground">Complainant · Adv. Meera Nair</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-caption">St</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-body-compact font-medium">State of Kerala</div>
                  <div className="text-caption text-muted-foreground">Respondent · Public Prosecutor</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {documents.map((d) => (
                <a
                  key={d.name}
                  href="#"
                  className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileTextIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-body-compact font-medium">{d.name}</div>
                    <div className="text-caption text-muted-foreground">{d.kind}</div>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
