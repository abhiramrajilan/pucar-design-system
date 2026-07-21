"use client"

import * as React from "react"
import { Bar, BarChart, Cell, XAxis } from "recharts"
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CircleCheckIcon,
  ClockIcon,
  DownloadIcon,
  FolderIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Tone = "pos" | "neg"
const stats: {
  label: string
  value: string
  delta: string
  arrow: "up" | "down"
  tone: Tone
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { label: "Cases filed", value: "1,284", delta: "8.2%", arrow: "up", tone: "pos", icon: FolderIcon },
  { label: "Pending hearings", value: "327", delta: "3.1%", arrow: "down", tone: "neg", icon: CalendarIcon },
  { label: "Disposed", value: "96", delta: "12.4%", arrow: "up", tone: "pos", icon: CircleCheckIcon },
  { label: "Avg. disposal", value: "34 d", delta: "2 days", arrow: "down", tone: "pos", icon: ClockIcon },
]

const chartData = [
  { month: "J", filings: 82 }, { month: "F", filings: 96 }, { month: "M", filings: 88 },
  { month: "A", filings: 120 }, { month: "M", filings: 132 }, { month: "J", filings: 110 },
  { month: "J", filings: 118 }, { month: "A", filings: 124 }, { month: "S", filings: 116 },
  { month: "O", filings: 128 }, { month: "N", filings: 134 }, { month: "D", filings: 142 },
]
const chartConfig = { filings: { label: "Filings", color: "var(--chart-1)" } } satisfies ChartConfig

const caseStatus = [
  { label: "Filed / registered", pct: 38, color: "var(--chart-1)" },
  { label: "Under hearing", pct: 29, color: "var(--chart-2)" },
  { label: "Reserved for orders", pct: 18, color: "var(--chart-4)" },
  { label: "Disposed", pct: 15, color: "var(--chart-3)" },
]

type Status = "Ready" | "Awaiting docs" | "Adjourn req."
// Status → the one chip's status variants (chip merge, 2026-07-21).
const statusVariant: Record<Status, "success" | "warning" | "destructive"> = {
  Ready: "success",
  "Awaiting docs": "warning",
  "Adjourn req.": "destructive",
}
const hearings: { time: string; cnr: string; parties: string; stage: string; status: Status }[] = [
  { time: "10:00", cnr: "KLKM01001234/2024", parties: "Rajini K. v. State", stage: "Bail", status: "Ready" },
  { time: "11:30", cnr: "KLKM02310098/2024", parties: "Meera D. v. K. Menon", stage: "Evidence", status: "Awaiting docs" },
  { time: "12:15", cnr: "KLKM04890231/2023", parties: "State v. Anwar S.", stage: "Arguments", status: "Ready" },
  { time: "14:00", cnr: "KLKM05120442/2024", parties: "T. Varghese v. KSEB", stage: "Hearing", status: "Adjourn req." },
]

function StatusPill({ status }: { status: Status }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Stat cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-caption text-muted-foreground">{s.label}</span>
                <s.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-2 font-heading text-title-l tabular-nums">{s.value}</div>
              <div
                className={cn(
                  "mt-1 flex items-center gap-1 text-caption font-medium",
                  s.tone === "pos" ? "text-success-ink" : "text-destructive-ink"
                )}
              >
                {s.arrow === "up" ? (
                  <ArrowUpRightIcon className="size-3.5" />
                ) : (
                  <ArrowDownRightIcon className="size-3.5" />
                )}
                {s.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + share of docket */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Filings by month</CardTitle>
                <CardDescription>New cases registered · last 12 months</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart data={chartData} margin={{ top: 8 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="filings" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i === chartData.length - 1
                          ? "var(--chart-1)"
                          : "color-mix(in oklch, var(--chart-1) 22%, var(--card))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case status</CardTitle>
            <CardDescription>Share of active docket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {caseStatus.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-body-compact">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-medium tabular-nums">{s.pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-track">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Today's hearings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Today&apos;s hearings</CardTitle>
              <CardDescription>Cause list · 4 of 27 shown</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View cause list
              <ArrowUpRightIcon />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Time</TableHead>
                <TableHead>CNR</TableHead>
                <TableHead>Parties</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hearings.map((h) => (
                <TableRow key={h.cnr}>
                  <TableCell className="pl-6 font-medium tabular-nums">{h.time}</TableCell>
                  <TableCell className="font-mono text-caption text-muted-foreground">{h.cnr}</TableCell>
                  <TableCell className="font-medium">{h.parties}</TableCell>
                  <TableCell className="text-muted-foreground">{h.stage}</TableCell>
                  <TableCell className="pr-6">
                    <StatusPill status={h.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
