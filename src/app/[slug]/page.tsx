import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InitiativeSection } from "@/components/InitiativeSection";
import { ctaData } from "@/lib/gtm-data";
import type { GTMData, Assumption } from "@/lib/gtm-data";
import Link from "next/link";
import { VideoPlayer } from "@/components/VideoPlayer";
import { computeFinancials as computeFinancialsShared, financialsAreEmpty } from "@/lib/compute-financials";
import { buildFallbackScript } from "@/lib/video-agent";

const S3_BASE =
  "https://bayescase-dev-hackathonbucketbucket-cbsuchsr.s3.eu-central-1.amazonaws.com";

function slugToDataUrl(slug: string): string {
  return `${S3_BASE}/${slug}.json`;
}

const cta = ctaData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatEuro(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value}`;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toLocaleString();
}

function formatAssumptionValue(value: number): string {
  if (value > 0 && value < 1) return `${(value * 100).toFixed(0)}%`;
  if (value >= 1_000_000) return formatEuro(value);
  if (value >= 1_000) return formatNumber(value);
  if (value >= 10) return `€${value}`;
  return String(value);
}

const computeFinancials = computeFinancialsShared;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection({ data }: { data: GTMData }) {
  return (
    <section className="text-center space-y-6">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Badge variant="outline" className="text-sm px-3 py-1">{data.seller.name}</Badge>
        <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <Badge variant="outline" className="text-sm px-3 py-1">{data.buyer.name}</Badge>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        {data.product.name}
      </h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {data.product.description}
      </p>
      <div className="pt-2">
        <Badge className="bg-blue-600 text-white text-sm px-4 py-1">
          Initiative: {data.initiative.name}
        </Badge>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// KPI cards
// ---------------------------------------------------------------------------

function KPISection({ data }: { data: GTMData }) {
  const kpis = [
    {
      label: "Expected ROI",
      value: `${data.financials.roi.expected}x`,
      sub: `${data.financials.roi.low}x – ${data.financials.roi.high}x range`,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-100 dark:border-blue-900/40",
    },
    {
      label: "Net Present Value",
      value: formatEuro(data.financials.npv.expected),
      sub: `${formatEuro(data.financials.npv.low)} – ${formatEuro(data.financials.npv.high)} range`,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-100 dark:border-green-900/40",
    },
    {
      label: "Payback Period",
      value: `${data.financials.paybackPeriodMonths.expected} mo`,
      sub: `${data.financials.paybackPeriodMonths.low} – ${data.financials.paybackPeriodMonths.high} months range`,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-100 dark:border-purple-900/40",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className={`hover:shadow-lg transition-shadow ${kpi.bg} ${kpi.border}`}>
          <CardContent className="pt-6 pb-6">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{kpi.label}</p>
            <p className={`text-5xl font-bold mt-2 mb-1 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.sub}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Scenario comparison
// ---------------------------------------------------------------------------

function ScenarioSection({ data }: { data: GTMData }) {
  const scenarios = [
    {
      label: "Conservative",
      icon: "⚠️",
      accentBorder: "border-t-4 border-t-amber-500",
      bg: "bg-amber-50/50 dark:bg-amber-950/20",
      textColor: "text-amber-700 dark:text-amber-400",
      roi: `${data.financials.roi.low}x`,
      npv: formatEuro(data.financials.npv.low),
      payback: `${data.financials.paybackPeriodMonths.high} mo`,
      note: "Worst-case assumptions",
      featured: false,
    },
    {
      label: "Expected",
      icon: "✅",
      accentBorder: "border-t-4 border-t-blue-500",
      bg: "bg-blue-50/50 dark:bg-blue-950/20",
      textColor: "text-blue-700 dark:text-blue-400",
      roi: `${data.financials.roi.expected}x`,
      npv: formatEuro(data.financials.npv.expected),
      payback: `${data.financials.paybackPeriodMonths.expected} mo`,
      note: "Base case",
      featured: true,
    },
    {
      label: "Optimistic",
      icon: "🚀",
      accentBorder: "border-t-4 border-t-green-500",
      bg: "bg-green-50/50 dark:bg-green-950/20",
      textColor: "text-green-700 dark:text-green-400",
      roi: `${data.financials.roi.high}x`,
      npv: formatEuro(data.financials.npv.high),
      payback: `${data.financials.paybackPeriodMonths.low} mo`,
      note: "Best-case assumptions",
      featured: false,
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-2">Financial Scenarios</Badge>
        <h2 className="text-2xl font-bold">Business Case Outcomes</h2>
        <p className="text-muted-foreground mt-1">Three scenarios based on assumption ranges</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {scenarios.map((s) => (
          <Card
            key={s.label}
            className={`${s.accentBorder} ${s.bg} hover:shadow-lg transition-all ${
              s.featured ? "shadow-xl ring-2 ring-blue-400/40 scale-105 z-10" : ""
            }`}
          >
            <CardContent className={s.featured ? "pt-7 pb-7" : "pt-6 pb-6"}>
              <div className="flex items-center gap-2 mb-5">
                <span className={s.featured ? "text-3xl" : "text-2xl"}>{s.icon}</span>
                <div>
                  <p className={`font-bold ${s.featured ? "text-lg" : "text-base"} ${s.textColor}`}>{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.note}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center py-3 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">ROI</span>
                  <span className={`font-bold ${s.featured ? "text-2xl" : "text-xl"} ${s.textColor}`}>{s.roi}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Net Present Value</span>
                  <span className={`font-bold ${s.featured ? "text-2xl" : "text-xl"} ${s.textColor}`}>{s.npv}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-muted-foreground">Payback Period</span>
                  <span className={`font-bold ${s.featured ? "text-2xl" : "text-xl"} ${s.textColor}`}>{s.payback}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Assumptions
// ---------------------------------------------------------------------------

function AssumptionsSection({ data }: { data: GTMData }) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-2">Model Assumptions</Badge>
        <h2 className="text-2xl font-bold">Key Assumptions</h2>
        <p className="text-muted-foreground mt-1">Ranges driving the probabilistic business case</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table className="table-fixed w-full">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[40%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>Assumption</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Conservative</TableHead>
                <TableHead className="text-center">Range</TableHead>
                <TableHead>Optimistic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.assumptions.map((a: Assumption, i: number) => {
                const lowFmt = formatAssumptionValue(a.range.low);
                const highFmt = formatAssumptionValue(a.range.high);
                return (
                  <TableRow key={i}>
                    <TableCell className="font-semibold align-top py-4">{a.name}</TableCell>
                    <TableCell className="align-top py-4 max-w-0">
                      <div className="group relative">
                        <span className="block text-muted-foreground text-sm truncate cursor-default">{a.description}</span>
                        <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-0 top-0 z-50 w-[480px] max-w-[60vw] rounded-lg border bg-popover text-popover-foreground shadow-lg p-3 text-sm leading-relaxed whitespace-normal break-words">
                          {a.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-amber-600 font-semibold align-top py-4">{lowFmt}</TableCell>
                    <TableCell className="align-middle py-4 px-4">
                      <div className="h-2 rounded-full bg-linear-to-r from-amber-400 via-blue-400 to-green-500" />
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold align-top py-4">{highFmt}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

function EmailCapture() {
  const bullets = [
    { icon: "📊", text: "Live probabilistic business case from your deal data — in minutes, not weeks" },
    { icon: "🎯", text: "Data-backed narrative that speaks your buyer's CFO language and accelerates sign-off" },
    { icon: "⚡", text: "No more bespoke spreadsheet ROI models — Bayes Case generates them automatically" },
    { icon: "🔒", text: "Enterprise-grade security and privacy built in from day one" },
  ];

  return (
    <section>
      <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white border-0 overflow-hidden">
        <CardContent className="py-14 px-8 md:px-14">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Ready to close faster?</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{cta.headline}</h2>
            <p className="text-slate-300 text-lg">{cta.subheadline}</p>
          </div>
          <ul className="max-w-lg mx-auto space-y-4 mb-10">
            {bullets.map((b) => (
              <li key={b.text} className="flex items-start gap-3 text-slate-200 text-base">
                <span className="text-lg mt-0.5 shrink-0">{b.icon}</span>
                <span className="leading-relaxed">{b.text}</span>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 text-base font-semibold rounded-xl shadow-lg shadow-blue-900/40"
            >
              <Link href={cta.demoUrl}>Book a Demo</Link>
            </Button>
            <p className="text-xs text-slate-500 mt-4">No credit card required · Setup in under 5 minutes</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page — server component, derives S3 URL from slug
// ---------------------------------------------------------------------------

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = slugToDataUrl(slug);

  let raw: GTMData;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) notFound();
    raw = await res.json();
  } catch {
    notFound();
  }

  if (!raw!.seller?.name || !raw!.product?.name) notFound();

  const data: GTMData = financialsAreEmpty(raw!.financials)
    ? { ...raw!, financials: computeFinancials(raw!.assumptions) }
    : raw!;

  // Build script instantly from GTM data — no LLM call
  const initialScript = buildFallbackScript(data);

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#3B82F6" />
              <path d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="20" r="3" fill="white" />
            </svg>
            <span className="text-lg font-bold">Bayes Case</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="https://app.bayescase.com/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="https://app.bayescase.com/signup">Start free trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl space-y-16">
        <HeroSection data={data} />

        {/* ---- Remotion Video — auto-generates on page load ---- */}
        <section className="space-y-4">
          <div className="text-center space-y-2">
            <Badge className="bg-blue-600/15 text-blue-400 border-blue-600/30">
              Powered by Bayes Case
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              GTM Assessment in Motion
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Watch how Bayes Case transforms raw deal data into a probabilistic
              business case — generated directly from the {data.seller.name} ×{" "}
              {data.buyer.name} assessment.
            </p>
          </div>
          <VideoPlayer data={data} initialScript={initialScript} />
        </section>

        <KPISection data={data} />
        <ScenarioSection data={data} />
        <InitiativeSection
          initiative={data.initiative}
          sellerName={data.seller.name}
          buyerName={data.buyer.name}
        />
        <AssumptionsSection data={data} />
        <EmailCapture />
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#3B82F6" />
                <path d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="20" r="3" fill="white" />
              </svg>
              <span className="text-sm font-semibold">Bayes Case</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Probabilistic Business Cases for Strategic Decisions
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="https://www.bayescase.com/terms" className="hover:text-foreground">Terms</Link>
              <Link href="https://www.bayescase.com/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
