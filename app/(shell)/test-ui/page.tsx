import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CreditCardIcon,
  FileStackIcon,
  ScanSearchIcon,
  UserRoundIcon,
} from "lucide-react"

const tests = [
  {
    href: "/test-ui/profile",
    icon: UserRoundIcon,
    title: "Complete your profile",
    description:
      "Onboarding modal — profile setup fields, redesigned from Figma to the Pucar system.",
    opens: "Opens in the workspace",
    fullScreen: false,
  },
  {
    href: "/test-ui/payment",
    icon: CreditCardIcon,
    title: "Pending payment dialog",
    description:
      "Payment-under-verification modal — amount receipt, one calm note, progressive disclosure.",
    opens: "Opens in the workspace",
    fullScreen: false,
  },
  {
    href: "/filing/documents",
    icon: FileStackIcon,
    title: "Document upload step",
    description:
      "Step 3 of the filing flow — grouped document slots, OCR read-back, focused full-screen layout.",
    opens: "Opens full screen · exit returns here",
    fullScreen: true,
  },
  {
    href: "/scrutiny",
    icon: ScanSearchIcon,
    title: "Scrutiny review workspace",
    description:
      "Officer review of a S.138 filing — document viewer with evidence marking, AI mismatch callouts, flag composer, review summary.",
    opens: "Opens full screen · exit returns here",
    fullScreen: true,
  },
]

export default function TestUIPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-title-l">Test UI</h1>
        <p className="text-body text-muted-foreground">
          A scratch surface for trying screens against the Pucar design system.
        </p>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <Link
            key={test.href}
            href={test.href}
            className="group flex items-start gap-4 rounded-xl border bg-card p-5 transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <test.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-body font-medium">{test.title}</div>
              <p className="mt-0.5 text-body-compact text-muted-foreground">
                {test.description}
              </p>
              <div className="mt-2 text-caption text-muted-foreground">
                {test.opens}
              </div>
            </div>
            {test.fullScreen ? (
              <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            ) : (
              <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
