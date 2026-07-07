import { cn } from "@/lib/utils"

import { FieldSpan } from "./field-span"

export type DocId =
  | "aadhaar"
  | "rental"
  | "chqf"
  | "chqb"
  | "notice"
  | "postal"
  | "vakala"

export type DocMeta = {
  id: DocId
  name: string
  pages: number
  section: string
}

export const DOCS: DocMeta[] = [
  { id: "aadhaar", name: "Aadhaar – complainant", pages: 1, section: "Complainant documents" },
  { id: "rental", name: "Rental agreement", pages: 2, section: "Complainant documents" },
  { id: "chqf", name: "Cheque (front)", pages: 1, section: "Cheque documents" },
  { id: "chqb", name: "Cheque (back)", pages: 1, section: "Cheque documents" },
  { id: "notice", name: "Legal notice", pages: 2, section: "Notice documents" },
  { id: "postal", name: "Postal receipt", pages: 1, section: "Notice documents" },
  { id: "vakala", name: "Vakalatnama", pages: 1, section: "Other" },
]

export type SectionId = "complainant" | "respondent" | "cheque"

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "complainant", label: "Complainant details" },
  { id: "respondent", label: "Respondent details" },
  { id: "cheque", label: "Cheque details" },
]

export type AiIssue = {
  kind: "mismatch" | "lowconf"
  extracted: string
  srcDoc: DocId
  note: string
}

export type FieldDef = {
  id: string
  section: SectionId
  label: string
  value: string
  ai?: AiIssue
  verified?: DocId
  nodoc?: boolean
  docIds: DocId[]
}

export const FIELDS: FieldDef[] = [
  {
    id: "name",
    section: "complainant",
    label: "Complainant name",
    value: "OM",
    ai: {
      kind: "mismatch",
      extracted: "Om Kumar",
      srcDoc: "aadhaar",
      note: "Name in the document differs from the filed value",
    },
    docIds: ["aadhaar"],
  },
  {
    id: "father",
    section: "complainant",
    label: "Father's name",
    value: "S/o Rajesh Kumar",
    verified: "aadhaar",
    docIds: ["aadhaar"],
  },
  {
    id: "aano",
    section: "complainant",
    label: "Aadhaar number",
    value: "XXXX-XXXX-4821",
    verified: "aadhaar",
    docIds: ["aadhaar"],
  },
  {
    id: "address",
    section: "complainant",
    label: "Address",
    value: "14/2 Gandhi Nagar, Bengaluru – 560032",
    ai: {
      kind: "mismatch",
      extracted: "No. 21, 4th Cross, Jayanagar, Bengaluru – 560041",
      srcDoc: "rental",
      note: "Address differs across documents (Aadhaar vs rental agreement)",
    },
    docIds: ["aadhaar", "rental"],
  },
  {
    id: "mobile",
    section: "complainant",
    label: "Mobile number",
    value: "98XXXXXX21",
    nodoc: true,
    docIds: [],
  },
  {
    id: "rname",
    section: "respondent",
    label: "Respondent name",
    value: "Rakesh Sharma",
    verified: "notice",
    docIds: ["notice"],
  },
  {
    id: "raddr",
    section: "respondent",
    label: "Address",
    value: "Shop 4, KR Market Road, Bengaluru – 560002",
    verified: "notice",
    docIds: ["notice"],
  },
  {
    id: "rocc",
    section: "respondent",
    label: "Occupation",
    value: "Trader",
    nodoc: true,
    docIds: [],
  },
  {
    id: "chqno",
    section: "cheque",
    label: "Cheque number",
    value: "004512",
    verified: "chqf",
    docIds: ["chqf"],
  },
  {
    id: "amount",
    section: "cheque",
    label: "Amount",
    value: "₹2,40,000",
    verified: "chqf",
    docIds: ["chqf"],
  },
  {
    id: "chqdate",
    section: "cheque",
    label: "Cheque date",
    value: "12/03/2026",
    ai: {
      kind: "lowconf",
      extracted: "1?/03/2026",
      srcDoc: "chqf",
      note: "Handwriting unclear — could not read the date confidently",
    },
    docIds: ["chqf"],
  },
  {
    id: "bank",
    section: "cheque",
    label: "Bank and branch",
    value: "Canara Bank, Jayanagar branch",
    verified: "chqf",
    docIds: ["chqf"],
  },
  {
    id: "drawer",
    section: "cheque",
    label: "Drawer name",
    value: "Rakesh Sharma",
    verified: "chqf",
    docIds: ["chqf"],
  },
]

export const CANNED_TRANSCRIPT =
  "The address on the rental agreement does not match the Aadhaar — please confirm the complainant's current address and re-upload proof if it has changed."

// ── mock document presentation primitives ──────────────────────────────
function DocHeading({ children }: { children: React.ReactNode }) {
  return <div className="text-[15px] font-semibold tracking-wide">{children}</div>
}
function DocSub({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 mt-1 text-caption text-muted-foreground">{children}</div>
}
function DocLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm leading-[27px] text-foreground/85", className)}>{children}</div>
}
function DocBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("my-4 rounded-lg border p-4", className)}>{children}</div>
}
function DocSignature({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-10 font-serif text-xl italic text-foreground/70", className)}>
      {children}
    </div>
  )
}
function DocStamp({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 inline-block -rotate-3 rounded-md border-2 border-muted-foreground/40 px-3 py-1 text-caption font-semibold text-muted-foreground/70">
      {children}
    </div>
  )
}
function DocPhoto() {
  return (
    <div className="float-left mr-5 flex h-24 w-20 items-center justify-center rounded border bg-muted text-caption text-muted-foreground">
      Photo
    </div>
  )
}
function DocEmblem() {
  return (
    <div className="float-right flex size-9 items-center justify-center rounded-full border bg-muted text-[9px] text-muted-foreground">
      GoI
    </div>
  )
}
export const DOC_CONTENT: Record<DocId, React.FC> = {
  aadhaar: function AadhaarDoc() {
    return (
      <>
        <DocEmblem />
        <DocHeading>Government of India</DocHeading>
        <DocSub>Unique Identification Authority of India</DocSub>
        <DocBox>
          <DocPhoto />
          <DocLine>
            Name: <b><FieldSpan id="name">OM KUMAR</FieldSpan></b>
          </DocLine>
          <DocLine>
            <FieldSpan id="father">S/O: RAJESH KUMAR</FieldSpan>
          </DocLine>
          <DocLine>DOB: 14/06/1988 &nbsp;·&nbsp; Male</DocLine>
          <DocLine>
            Address:{" "}
            <FieldSpan id="address">14/2 Gandhi Nagar, Bengaluru, Karnataka – 560032</FieldSpan>
          </DocLine>
          <DocLine className="clear-both mt-4">
            Aadhaar no: <b className="font-mono"><FieldSpan id="aano">XXXX XXXX 4821</FieldSpan></b>
          </DocLine>
        </DocBox>
        <DocStamp>Self-attested copy</DocStamp>
      </>
    )
  },
  rental: function RentalDoc() {
    return (
      <>
        <DocHeading>Rental agreement</DocHeading>
        <DocSub>Executed on 02/01/2026 · Bengaluru</DocSub>
        <DocLine>
          This agreement is made between Sri Venkatesh Rao (lessor) and <b>Om Kumar</b> (lessee),
          residing at{" "}
          <FieldSpan id="address">No. 21, 4th Cross, Jayanagar, Bengaluru – 560041</FieldSpan>, for
          the premises described herein…
        </DocLine>
        <DocLine className="mt-4">
          2. The lessee shall pay a monthly rent of ₹18,000 on or before the 5th day of each
          month…
        </DocLine>
        <DocLine className="mt-4">
          3. The term of this agreement is eleven months commencing 05/01/2026…
        </DocLine>
        <DocSignature>Om Kumar</DocSignature>
      </>
    )
  },
  chqf: function ChequeFrontDoc() {
    return (
      <DocBox className="p-6">
        <DocLine className="flex items-baseline justify-between">
          <b><FieldSpan id="bank">Canara Bank · Jayanagar branch</FieldSpan></b>
          <span>
            Date: <b className="font-mono blur-[0.4px] tracking-wide"><FieldSpan id="chqdate">12/03/2026</FieldSpan></b>
          </span>
        </DocLine>
        <DocLine className="mt-6">Pay: <b>Om Kumar</b></DocLine>
        <DocLine className="flex items-baseline justify-between">
          <span>Rupees: <FieldSpan id="amount">Two lakh forty thousand only</FieldSpan></span>
          <span className="rounded border px-2.5 py-0.5">
            ₹ <b className="font-mono"><FieldSpan id="amount2">2,40,000</FieldSpan></b>
          </span>
        </DocLine>
        <DocLine className="mt-8">A/c no: <span className="font-mono">XXXXXX8890</span></DocLine>
        <DocSignature><FieldSpan id="drawer">Rakesh Sharma</FieldSpan></DocSignature>
        <DocLine className="mt-6 font-mono tracking-[4px]">
          ⑈ <FieldSpan id="chqno">004512</FieldSpan> ⑈ 560015002 ⑈
        </DocLine>
      </DocBox>
    )
  },
  chqb: function ChequeBackDoc() {
    return (
      <>
        <DocHeading>Cheque (back)</DocHeading>
        <DocSub>Bank endorsements</DocSub>
        <DocBox>
          <DocLine className="font-mono">RETURN MEMO · 16/03/2026</DocLine>
          <DocLine>Reason: Funds insufficient</DocLine>
        </DocBox>
        <DocStamp>Canara Bank · Jayanagar</DocStamp>
      </>
    )
  },
  notice: function NoticeDoc() {
    return (
      <>
        <DocHeading>Legal notice</DocHeading>
        <DocSub>Under section 138 of the Negotiable Instruments Act, 1881 · Dated 28/03/2026</DocSub>
        <DocLine>
          To,
          <br />
          <b><FieldSpan id="rname">Rakesh Sharma</FieldSpan></b>
          <br />
          <FieldSpan id="raddr">Shop 4, KR Market Road, Bengaluru – 560002</FieldSpan>
        </DocLine>
        <DocLine className="mt-4">
          Under instructions from my client, Om Kumar, I hereby call upon you to make payment of
          ₹2,40,000 being the amount of the dishonoured cheque no. 004512 dated 12/03/2026, within
          fifteen days of receipt of this notice…
        </DocLine>
        <DocSignature>Priya Nair, Advocate</DocSignature>
      </>
    )
  },
  postal: function PostalDoc() {
    return (
      <>
        <DocHeading>Postal receipt</DocHeading>
        <DocSub>India Post · Registered</DocSub>
        <DocBox>
          <DocLine className="font-mono">RL 4471 2209 88 IN</DocLine>
          <DocLine>Booked: 29/03/2026 · Jayanagar PO</DocLine>
          <DocLine>To: Rakesh Sharma, Bengaluru 560002</DocLine>
        </DocBox>
      </>
    )
  },
  vakala: function VakalatnamaDoc() {
    return (
      <>
        <DocHeading>Vakalatnama</DocHeading>
        <DocSub>Court of the Judicial Magistrate, Bengaluru</DocSub>
        <DocLine>
          I, Om Kumar, do hereby appoint and retain Adv. Priya Nair to appear for me in the above
          matter and to conduct and prosecute the same…
        </DocLine>
        <DocSignature>Om Kumar</DocSignature>
        <DocSignature className="text-base">Priya Nair</DocSignature>
      </>
    )
  },
}
