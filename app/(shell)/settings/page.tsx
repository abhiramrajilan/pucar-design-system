"use client"

import * as React from "react"
import { UploadCloudIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-caption text-destructive-ink">{error}</p>
      ) : hint ? (
        <p className="text-caption text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-8">
      <div className="md:col-span-1">
        <h2 className="text-title-s tracking-tight">{title}</h2>
        <p className="mt-1 text-body-compact text-muted-foreground">{description}</p>
      </div>
      <Card className="md:col-span-2">
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  )
}

const documents = [
  { id: "doc-cheque", label: "Dishonoured cheque (copy)", checked: true },
  { id: "doc-memo", label: "Bank return memo", checked: true },
  { id: "doc-notice", label: "Statutory demand notice", checked: false },
  { id: "doc-postal", label: "Postal receipt / acknowledgement", checked: false },
]

export default function NewCasePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-title-l tracking-tight">New case</h1>
          <p className="text-body-compact text-muted-foreground">
            File a complaint under Section 138, NI Act
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button variant="outline">Save draft</Button>
          <Button>File case</Button>
        </div>
      </div>

      <Separator />

      <Section
        title="Case details"
        description="The court and category this complaint is filed under."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Case type" htmlFor="case-type">
            <Select defaultValue="s138">
              <SelectTrigger id="case-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s138">S.138 NI Act (cheque bounce)</SelectItem>
                <SelectItem value="civil">Civil suit</SelectItem>
                <SelectItem value="crlmc">Crl.M.C.</SelectItem>
                <SelectItem value="maint">Maintenance (M.C.)</SelectItem>
                <SelectItem value="exec">Execution petition</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Court" htmlFor="court">
            <Select>
              <SelectTrigger id="court" className="w-full">
                <SelectValue placeholder="Select a court" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jfcm2-kochi">JFCM-II, Kochi</SelectItem>
                <SelectItem value="munsiff-kollam">Munsiff Court, Kollam</SelectItem>
                <SelectItem value="sessions-ekm">Sessions Court, Ernakulam</SelectItem>
                <SelectItem value="jfcm1-kkd">JFCM-I, Kozhikode</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Filing date" htmlFor="filing-date">
            <Input id="filing-date" type="date" defaultValue="2026-07-01" />
          </Field>
          <Field
            label="CNR number"
            htmlFor="cnr"
            hint="Auto-assigned on registration — leave blank if new."
          >
            <Input id="cnr" placeholder="KLKM01-XXXXXX/2026" className="font-mono" />
          </Field>
        </div>
      </Section>

      <Section
        title="Parties"
        description="Complainant and the accused/respondent to the case."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Complainant name" htmlFor="comp-name">
            <Input id="comp-name" placeholder="Full legal name" />
          </Field>
          <Field label="Phone" htmlFor="comp-phone">
            <Input id="comp-phone" type="tel" placeholder="+91 ‧‧‧‧‧ ‧‧‧‧‧" />
          </Field>
          <Field label="Respondent / accused" htmlFor="resp-name">
            <Input id="resp-name" placeholder="Full legal name" />
          </Field>
          <Field label="Respondent phone" htmlFor="resp-phone" hint="If known.">
            <Input id="resp-phone" type="tel" placeholder="+91 ‧‧‧‧‧ ‧‧‧‧‧" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Respondent address" htmlFor="resp-addr">
              <Textarea id="resp-addr" placeholder="For service of summons…" />
            </Field>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Filing on behalf of</Label>
            <RadioGroup defaultValue="advocate" className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="self" id="f-self" />
                <Label htmlFor="f-self" className="font-normal">Self</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="advocate" id="f-adv" />
                <Label htmlFor="f-adv" className="font-normal">Advocate</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="poa" id="f-poa" />
                <Label htmlFor="f-poa" className="font-normal">Power of attorney</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Section>

      <Section
        title="Cheque & demand"
        description="Details of the dishonoured instrument and statutory notice."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cheque number" htmlFor="cheque-no">
            <Input id="cheque-no" className="font-mono" placeholder="000000" />
          </Field>
          <Field
            label="Cheque amount (₹)"
            htmlFor="amount"
            error="Amount is required to compute court fee."
          >
            <Input id="amount" aria-invalid inputMode="numeric" placeholder="2,40,000" />
          </Field>
          <Field label="Drawee bank" htmlFor="bank">
            <Input id="bank" placeholder="e.g. SBI, Ernakulam branch" />
          </Field>
          <Field label="Return reason" htmlFor="reason">
            <Select>
              <SelectTrigger id="reason" className="w-full">
                <SelectValue placeholder="Reason on memo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funds">Insufficient funds</SelectItem>
                <SelectItem value="closed">Account closed</SelectItem>
                <SelectItem value="sign">Signature mismatch</SelectItem>
                <SelectItem value="stop">Payment stopped</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cheque date" htmlFor="cheque-date">
            <Input id="cheque-date" type="date" />
          </Field>
          <Field label="Demand notice date" htmlFor="notice-date">
            <Input id="notice-date" type="date" />
          </Field>
        </div>
      </Section>

      <Section
        title="Documents & options"
        description="Attach supporting documents and set hearing preferences."
      >
        <div className="space-y-6">
          <div className="rounded-lg border border-dashed p-6 text-center">
            <UploadCloudIcon className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-body-compact font-medium">Drop files or browse</p>
            <p className="text-caption text-muted-foreground">PDF or JPG, up to 10 MB each</p>
          </div>
          <div className="space-y-2.5">
            {documents.map((d) => (
              <div key={d.id} className="flex items-center gap-2.5">
                <Checkbox id={d.id} defaultChecked={d.checked} />
                <Label htmlFor={d.id} className="font-normal">{d.label}</Label>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="early">Seek early hearing</Label>
              <p className="text-caption text-muted-foreground">
                Flag for the registrar as time-sensitive.
              </p>
            </div>
            <Switch id="early" />
          </div>
        </div>
      </Section>

      <Separator />

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button variant="outline">Save draft</Button>
        <Button>File case</Button>
      </div>
    </div>
  )
}
