import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Shield,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Send,
  Wallet,
  Building2,
  Bot,
  Bell,
  CircleDollarSign,
  LineChart,
  Users,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeDemo,
});

type Tier = "guest" | "beginner" | "connected" | "experienced";

const TIERS: { id: Tier; label: string; sub: string }[] = [
  { id: "guest", label: "Guest", sub: "not signed in" },
  { id: "beginner", label: "Beginner", sub: "auth, no data" },
  { id: "connected", label: "Connected", sub: "portfolios + bank" },
  { id: "experienced", label: "Experienced", sub: "+ AI analysis" },
];

function HomeDemo() {
  const [tier, setTier] = useState<Tier>("guest");

  return (
    <div className="min-h-screen bg-background">
      <TopBar tier={tier} setTier={setTier} />
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-10 md:py-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="space-y-3 lg:col-span-2">
            {tier === "guest" && <GuestLeft />}
            {tier === "beginner" && <BeginnerLeft />}
            {tier === "connected" && <InvestorLeft withAnalysis={false} />}
            {tier === "experienced" && <InvestorLeft withAnalysis />}
          </section>
          <aside className="space-y-3">
            <TopPerformers />
            {tier === "guest" || tier === "beginner" ? (
              <SavingsGoalCard />
            ) : (
              <IdleCashCard />
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- Top bar with tier switcher ---------- */

function TopBar({ tier, setTier }: { tier: Tier; setTier: (t: Tier) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 glass">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Copilot Invest</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Adaptive homepage · demo
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-border/70 bg-card p-1 shadow-soft">
          {TIERS.map((t) => {
            const active = tier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className={`group flex flex-col items-start rounded-xl px-3 py-1.5 text-left transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-[13px] font-semibold leading-tight">{t.label}</span>
                <span
                  className={`text-[10px] leading-tight ${
                    active ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {t.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

/* ---------- Shared building blocks ---------- */

function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/70 bg-card p-4 ${
        glow ? "shadow-glow" : "shadow-soft"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </div>
  );
}

function PillButton({
  children,
  variant = "primary",
  icon,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-glow hover:brightness-105"
      : "bg-secondary text-secondary-foreground hover:bg-muted";
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${styles}`}
    >
      {icon}
      {children}
    </button>
  );
}

function Sparkline({ up = true }: { up?: boolean }) {
  const path = up
    ? "M0,30 C10,28 20,25 30,22 C40,20 50,23 60,18 C70,14 80,10 90,6 L100,4"
    : "M0,10 C10,12 20,16 30,14 C40,12 50,18 60,22 C70,26 80,24 90,28 L100,30";
  const color = up ? "var(--primary)" : "var(--danger)";
  const id = up ? "sg-up" : "sg-down";
  return (
    <svg viewBox="0 0 100 36" className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L100,36 L0,36 Z`} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AiDock({ placeholder, chips }: { placeholder: string; chips: string[] }) {
  return (
    <Card className="gradient-mint">
      <div className="flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Bot className="size-4" />
        </div>
        <div className="text-sm font-semibold">Ask the AI copilot</div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-soft">
        <input
          className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
        />
        <button className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground hover:brightness-105">
          <Send className="size-4" />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <button
            key={c}
            className="rounded-lg border border-border bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-card"
          >
            {c}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ---------- TIER 1: GUEST ---------- */

function GuestLeft() {
  return (
    <>
      <Card className="gradient-mint" glow>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            AI copilot
          </span>
          <span className="text-[11px] text-muted-foreground">no signup required</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
          Investing, <span className="text-primary">explained by AI</span>.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Pick a starting point. We'll build a portfolio, analyze what you already own, or help
          you plan a goal — plain-English, no jargon.
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <StartTile
            title="I'm new to investing"
            body="Start with a guided path — risk, timeline, portfolio."
            icon={<Sparkles className="size-4" />}
          />
          <StartTile
            title="I already invest"
            body="Connect your brokerage for AI analysis."
            icon={<Wallet className="size-4" />}
          />
          <StartTile
            title="Build with AI"
            body="Type a goal, get a portfolio in seconds."
            icon={<Bot className="size-4" />}
          />
        </div>
      </Card>

      <AiDock
        placeholder="Explain ETFs like I'm 12…"
        chips={[
          "Explain ETFs like I'm 12",
          "Build me a retirement portfolio",
          "Is Apple a good buy right now?",
          "What is dollar-cost averaging?",
        ]}
      />

      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-soft">
        <div>
          <div className="text-sm font-semibold">Wanna learn how to deal with our copilot?</div>
          <div className="text-xs text-muted-foreground">
            Prompt library · 40+ battle-tested prompts
          </div>
        </div>
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80">
          Explore <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
}

function StartTile({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: ReactNode;
}) {
  return (
    <button className="group flex h-full flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:shadow-soft">
      <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{body}</div>
      <div className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
        Start <ArrowRight className="size-3" />
      </div>
    </button>
  );
}

/* ---------- TIER 2: BEGINNER ---------- */

function BeginnerLeft() {
  return (
    <>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Good morning</div>
            <h1 className="text-3xl font-bold leading-tight">Welcome back, Alex.</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Shield className="size-3.5" />
            AI Guard Active · 0 issues
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
          You haven't connected any accounts yet, so there's{" "}
          <span className="text-foreground">nothing at risk.</span> Take your time to explore.
        </div>
      </Card>

      <Card>
        <Label>While you were away</Label>
        <div className="mt-3 flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Zap className="size-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">
              AI scanned 50+ market opportunities overnight
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              S&amp;P 500 <span className="font-semibold text-primary">+0.42%</span> · NASDAQ{" "}
              <span className="font-semibold text-primary">+0.71%</span>
            </div>
          </div>
        </div>
      </Card>

      <Card glow className="gradient-mint">
        <div className="flex items-center justify-between">
          <Label>Your next step</Label>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-primary/25" />
          </div>
        </div>
        <h2 className="mt-3 text-2xl font-bold">Connect a bank account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          One 30-second link lets AI see your cash so it can spot idle money and inflation drag.
          Read-only. Never leaves your device.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <PillButton icon={<Building2 className="size-4" />}>Connect a bank</PillButton>
          <PillButton variant="secondary">Not now — browse portfolios</PillButton>
        </div>
      </Card>

      <SamplePortfolioCard />

      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="S&P 500" value="5,412.10" delta="+0.42%" up />
        <MiniStat label="NASDAQ" value="18,205.44" delta="+0.71%" up />
      </div>

      <AiDock
        placeholder="What should I do first?"
        chips={["Pick a starter portfolio", "Explain diversification", "How risky am I?"]}
      />
    </>
  );
}

function SamplePortfolioCard() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Label>Sample portfolio</Label>
          <div className="mt-1 text-lg font-semibold">Balanced Growth · AI</div>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          Beating cash +6.2%
        </span>
      </div>
      <div className="mt-3">
        <Sparkline up />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">1Y return</div>
          <div className="num text-base font-semibold text-primary">+14.8%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Risk</div>
          <div className="num text-base font-semibold">Moderate</div>
        </div>
        <div>
          <div className="text-muted-foreground">Holdings</div>
          <div className="num text-base font-semibold">12</div>
        </div>
      </div>
    </Card>
  );
}

function MiniStat({
  label,
  value,
  delta,
  up,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="num mt-1 text-lg font-semibold">{value}</div>
      <div
        className={`num text-xs font-semibold ${
          up ? "text-primary" : "text-[color:var(--danger)]"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}

/* ---------- TIER 3 & 4: INVESTOR COMMAND CENTER ---------- */

function InvestorLeft({ withAnalysis }: { withAnalysis: boolean }) {
  return (
    <>
      <PortfolioSnapshot withAnalysis={withAnalysis} />
      <ReassuranceBand />
      <MostImportantThing withAnalysis={withAnalysis} />
      <WhileYouWereAway withAnalysis={withAnalysis} />
      <MarketContext />
      <AiDock
        placeholder="Ask about your holdings…"
        chips={
          withAnalysis
            ? ["Explain my rebalance", "Why is NVDA down?", "Am I concentrated?"]
            : ["Run an analysis", "Am I diversified?", "What's my risk?"]
        }
      />
    </>
  );
}

function PortfolioSnapshot({ withAnalysis }: { withAnalysis: boolean }) {
  return (
    <Card glow>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold hover:bg-muted">
              Core Growth <ArrowRight className="size-3 rotate-90" />
            </button>
            <span className="text-[11px] text-muted-foreground">2 portfolios</span>
          </div>
          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Net worth
            </div>
            <div className="num text-4xl font-bold md:text-5xl">$248,412.30</div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <TrendingUp className="size-3" /> +$1,284 · +0.52%
              </span>
              <span className="text-xs text-muted-foreground">today</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Portfolio <span className="num text-foreground">$182,940</span> · Bank{" "}
              <span className="num text-foreground">$65,472</span>
            </div>
          </div>
        </div>

        {withAnalysis ? (
          <HealthRing score={82} />
        ) : (
          <div className="w-full max-w-[180px] rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center">
            <Bot className="mx-auto size-5 text-muted-foreground" />
            <div className="mt-2 text-xs text-muted-foreground">
              Run analysis for your health score
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <Sparkline up />
      </div>
    </Card>
  );
}

function HealthRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--muted)" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          transform="rotate(-90 44 44)"
        />
        <text
          x="44"
          y="49"
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontFamily: "Space Grotesk", fontSize: 20, fontWeight: 700 }}
        >
          {score}
        </text>
      </svg>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Health score
        </div>
        <div className="text-sm font-semibold text-primary">Strong · well-diversified</div>
      </div>
    </div>
  );
}

function ReassuranceBand() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
      <CheckCircle2 className="size-5 shrink-0 text-primary" />
      <div className="text-sm">
        <span className="font-semibold text-foreground">You're in a strong position.</span>{" "}
        <span className="text-muted-foreground">
          6 months of expenses in cash · risk aligned to your profile.
        </span>
      </div>
    </div>
  );
}

function MostImportantThing({ withAnalysis }: { withAnalysis: boolean }) {
  if (!withAnalysis) {
    return (
      <Card className="gradient-mint" glow>
        <Label>Most important thing</Label>
        <h3 className="mt-2 text-xl font-bold">Get your AI portfolio analysis</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Health score, concentration risk, rebalance suggestions and idle-cash drag — in 15
          seconds.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <PillButton icon={<Sparkles className="size-4" />}>Run analysis</PillButton>
          <PillButton variant="secondary" icon={<Building2 className="size-4" />}>
            Connect brokerage
          </PillButton>
        </div>
      </Card>
    );
  }
  return (
    <Card glow>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--warning)]/15 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--warning)]">
          <AlertTriangle className="size-3" /> Concentration · medium
        </span>
        <Label>Most important thing</Label>
      </div>
      <h3 className="mt-2 text-xl font-bold">
        Tech is 41% of your portfolio — consider trimming.
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A single-sector drawdown could hit your net worth harder than your risk profile allows.
        A small rebalance restores balance without triggering large tax events.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <PillButton icon={<Target className="size-4" />}>Review rebalance</PillButton>
        <PillButton variant="secondary" icon={<Bot className="size-4" />}>
          Ask AI
        </PillButton>
      </div>
    </Card>
  );
}

function WhileYouWereAway({ withAnalysis }: { withAnalysis: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>While you were away</Label>
        <span className="text-[11px] text-muted-foreground">Last 24h</span>
      </div>
      <ul className="mt-3 divide-y divide-border/70">
        <Alert
          icon={<Bell className="size-4" />}
          tint="info"
          title="NVDA hit your $145 alert"
          meta="Price now $146.30 · +0.9% today"
        />
        <Alert
          icon={<TrendingDown className="size-4" />}
          tint="danger"
          title="TSLA dropped -3.2% on delivery miss"
          meta="Weight in portfolio: 4.1%"
        />
        {withAnalysis && (
          <Alert
            icon={<Sparkles className="size-4" />}
            tint="primary"
            title="AI suggests trimming AAPL by 2%"
            meta="Reduces tech concentration from 41% → 39%"
          />
        )}
      </ul>
    </Card>
  );
}

function Alert({
  icon,
  title,
  meta,
  tint,
}: {
  icon: ReactNode;
  title: string;
  meta: string;
  tint: "info" | "danger" | "primary";
}) {
  const tintCls =
    tint === "info"
      ? "bg-[color:var(--info)]/10 text-[color:var(--info)]"
      : tint === "danger"
      ? "bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
      : "bg-primary/10 text-primary";
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div className={`grid size-8 place-items-center rounded-lg ${tintCls}`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{meta}</div>
      </div>
      <button className="text-xs font-semibold text-primary hover:opacity-80">View</button>
    </li>
  );
}

function MarketContext() {
  const rows = [
    { label: "S&P 500", value: "5,412.10", delta: "+0.42%", up: true },
    { label: "NASDAQ", value: "18,205.44", delta: "+0.71%", up: true },
    { label: "BTC", value: "$68,124", delta: "-1.14%", up: false },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Market context</Label>
        <LineChart className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-border/70 bg-muted/30 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {r.label}
            </div>
            <div className="num mt-1 text-base font-semibold">{r.value}</div>
            <div
              className={`num text-xs font-semibold ${
                r.up ? "text-primary" : "text-[color:var(--danger)]"
              }`}
            >
              {r.delta}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- RIGHT PANEL WIDGETS ---------- */

function TopPerformers() {
  const rows = [
    { name: "Emerald Growth", by: "@nadia", ret: "+34.2%" },
    { name: "Dividend Machine", by: "@marco", ret: "+22.8%" },
    { name: "Tech Bets 2026", by: "@juno", ret: "+19.4%" },
    { name: "Defensive Blend", by: "@sara", ret: "+11.6%" },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <Label>Top performers</Label>
          <div className="mt-1 text-sm font-semibold">Public portfolios · 30d</div>
        </div>
        <Users className="size-4 text-muted-foreground" />
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5 hover:bg-muted/50"
          >
            <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.by}</div>
            </div>
            <div className="num text-sm font-semibold text-primary">{r.ret}</div>
          </li>
        ))}
      </ul>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80">
        See all <ArrowRight className="size-3" />
      </button>
    </Card>
  );
}

function SavingsGoalCard() {
  const pct = 49;
  return (
    <Card className="gradient-mint">
      <div className="flex items-center justify-between">
        <Label>Savings goal</Label>
        <CircleDollarSign className="size-4 text-primary" />
      </div>
      <div className="mt-2 text-sm font-semibold">House deposit</div>
      <div className="num mt-1 text-2xl font-bold">
        $24,500 <span className="text-sm font-medium text-muted-foreground">/ $50,000</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{pct}% funded</span>
        <span className="font-semibold text-primary">On track</span>
      </div>
    </Card>
  );
}

function IdleCashCard() {
  return (
    <Card glow>
      <div className="flex items-center justify-between">
        <Label>Idle cash</Label>
        <span className="rounded-full bg-[color:var(--warning)]/15 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--warning)]">
          Losing to inflation
        </span>
      </div>
      <div className="num mt-2 text-3xl font-bold">$18,240</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Sitting in checking at 0.01% APY. Inflation drag ≈{" "}
        <span className="num text-foreground">$547/yr</span>.
      </p>
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
        <div className="text-xs font-semibold text-primary">If moved to AI Portfolio</div>
        <div className="num mt-1 text-lg font-semibold">
          +$1,824 <span className="text-xs font-medium text-muted-foreground">est. 12mo</span>
        </div>
      </div>
      <div className="mt-4">
        <PillButton icon={<ArrowRight className="size-4" />}>Move to AI Portfolio</PillButton>
      </div>
    </Card>
  );
}
