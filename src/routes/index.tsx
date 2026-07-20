import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  BookOpen,
  Flame,
  Eye,
  CalendarClock,
  Newspaper,
  Radar,
  Vote,
  Crown,
  BellRing,
  HandCoins,
  PiggyBank,
  Home,
  Car,
  Plane,
  GraduationCap,
  Check,
  Landmark,
  Search,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeDemo,
});

type Tier = "guest" | "beginner" | "connected" | "experienced";

const TIERS: { id: Tier; label: string; sub: string }[] = [
  { id: "guest", label: "First-time login", sub: "signed in, no history" },
  { id: "beginner", label: "Beginner", sub: "auth, no data" },
  { id: "connected", label: "Connected", sub: "portfolios + bank" },
  { id: "experienced", label: "Experienced", sub: "+ AI analysis" },
];

function HomeDemo() {
  const [tier, setTier] = useState<Tier>("guest");
  const [starter, setStarter] = useState<StarterKind | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <TopBar tier={tier} setTier={setTier} onOpenStarter={setStarter} />
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-10 md:py-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="space-y-3 lg:col-span-2">
            {tier === "guest" && <GuestLeft onOpenStarter={setStarter} />}
            {tier === "beginner" && <BeginnerLeft />}
            {tier === "connected" && <InvestorLeft withAnalysis={false} />}
            {tier === "experienced" && <InvestorLeft withAnalysis />}
          </section>
          <aside className="space-y-3">
            {tier === "guest" && <GuestRight />}
            {tier === "beginner" && <BeginnerRight />}
            {tier === "connected" && <InvestorRight withAnalysis={false} />}
            {tier === "experienced" && <InvestorRight withAnalysis />}
          </aside>
        </div>
      </main>
      <StarterSimulator kind={starter} onClose={() => setStarter(null)} />
    </div>
  );
}


/* ---------- Top bar with tier switcher ---------- */

function TopBar({
  tier,
  setTier,
  onOpenStarter,
}: {
  tier: Tier;
  setTier: (t: Tier) => void;
  onOpenStarter: (k: StarterKind) => void;
}) {
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
        <nav className="flex items-center gap-1 rounded-2xl border border-border/70 bg-card p-1 shadow-soft">
          <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary">Home</span>
          <Link
            to="/heatmap"
            className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
          >
            Heatmap
          </Link>
          <Link
            to="/fantasy"
            className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
          >
            Fantasy
          </Link>
          {tier !== "guest" && <NewPlanNavButton onOpenStarter={onOpenStarter} />}
        </nav>

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

function NewPlanNavButton({ onOpenStarter }: { onOpenStarter: (k: StarterKind) => void }) {
  const [open, setOpen] = useState(false);
  const items: { kind: StarterKind; title: string; sub: string; icon: ReactNode }[] = [
    {
      kind: "loan",
      title: "Handle a loan",
      sub: "Payoff plan + smart investing",
      icon: <HandCoins className="size-4" />,
    },
    {
      kind: "invest",
      title: "Save & invest",
      sub: "Grow spare cash on a horizon",
      icon: <PiggyBank className="size-4" />,
    },
    {
      kind: "goal",
      title: "Plan a goal",
      sub: "House, car, trip, school…",
      icon: <Target className="size-4" />,
    },
  ];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary transition hover:bg-primary/15"
          aria-label="Start a new plan"
        >
          <Sparkles className="size-3.5" />
          New plan
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="w-72 p-2">
        <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Start a new plan
        </div>
        <div className="flex flex-col gap-1">
          {items.map((it) => (
            <button
              key={it.kind}
              onClick={() => {
                setOpen(false);
                onOpenStarter(it.kind);
              }}
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-muted"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                {it.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-tight">{it.title}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{it.sub}</span>
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
        <div className="mt-1 border-t border-border/60 px-2 py-1.5 text-[10px] text-muted-foreground">
          Same simulator you saw when you first joined.
        </div>
      </PopoverContent>
    </Popover>
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
  size = "md",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  size?: "md" | "sm";
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-glow hover:brightness-105"
      : "bg-secondary text-secondary-foreground hover:bg-muted";
  const pad = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition ${pad} ${styles}`}
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

function DualSparkline() {
  // Portfolio (up) vs S&P (flatter up)
  const port = "M0,32 C10,29 20,24 30,22 C40,19 50,20 60,15 C70,11 80,8 90,5 L100,3";
  const bench = "M0,30 C10,28 20,27 30,25 C40,23 50,22 60,20 C70,18 80,17 90,15 L100,13";
  return (
    <svg viewBox="0 0 100 36" className="h-12 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="port-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${port} L100,36 L0,36 Z`} fill="url(#port-g)" />
      <path d={bench} fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d={port} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
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

function AiMonitoringBadge({ issues = 0 }: { issues?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      AI monitoring · {issues} issues
    </div>
  );
}

/* ---------- TIER 1: GUEST ---------- */

type StarterKind = "loan" | "invest" | "goal";

function GuestLeft({ onOpenStarter }: { onOpenStarter: (k: StarterKind) => void }) {
  const setOpen = onOpenStarter;

  return (
    <>
      <Card className="gradient-mint" glow>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            Welcome to InvestWhat
          </span>
          <span className="text-[11px] text-muted-foreground">you're in the right place</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
          Whatever you're after, <span className="text-primary">we'll take it from here</span>.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          A loan hanging over you, money to grow, or a real-life goal — pick one and we'll show
          you exactly how we'd handle it, with a real plan and a real portfolio.
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <StartTile
            title="I have a loan to handle"
            body="See a payoff plan + portfolio that balances debt and growth."
            icon={<HandCoins className="size-4" />}
            onClick={() => setOpen("loan")}
          />
          <StartTile
            title="I want to save & invest"
            body="Watch $300/mo turn into a 3-year plan with real portfolios."
            icon={<PiggyBank className="size-4" />}
            onClick={() => setOpen("invest")}
          />
          <StartTile
            title="I have a goal in mind"
            body="Car, house, trip — see exactly how we'd get you there."
            icon={<Home className="size-4" />}
            onClick={() => setOpen("goal")}
          />
        </div>
      </Card>

      <AiVsBenchmarkCard />

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

function GuestRight() {
  return (
    <>
      <ConnectBankCard />
      <ConnectBrokerageCard />
      <GuestUsageMeter />
      <TopPerformers />
      <BlogTeaserCard />
      <SavingsGoalCard />
    </>
  );
}

/* ---------- Compact connect cards (SnapTrade preview) ---------- */

type LogoChip = { n: string; s: string; c: string };

const BANKS_BY_COUNTRY: Record<"SG" | "AE" | "SA", { flag: string; label: string; total: number; items: LogoChip[] }> = {
  SG: {
    flag: "🇸🇬",
    label: "Singapore",
    total: 42,
    items: [
      { n: "DBS Bank", s: "DBS", c: "#c8102e" },
      { n: "OCBC Bank", s: "OC", c: "#e30613" },
      { n: "UOB", s: "UOB", c: "#0b3d91" },
      { n: "Standard Chartered", s: "SC", c: "#0473ea" },
      { n: "HSBC", s: "HS", c: "#db0011" },
      { n: "CIMB", s: "CI", c: "#7a1e2b" },
    ],
  },
  AE: {
    flag: "🇦🇪",
    label: "UAE",
    total: 28,
    items: [
      { n: "Emirates NBD", s: "EN", c: "#004990" },
      { n: "ADCB", s: "AD", c: "#8b1f2f" },
      { n: "FAB", s: "FA", c: "#003b71" },
      { n: "Mashreq", s: "MA", c: "#f47b20" },
      { n: "ADIB", s: "AI", c: "#00674a" },
      { n: "RAKBANK", s: "RA", c: "#c8102e" },
    ],
  },
  SA: {
    flag: "🇸🇦",
    label: "Saudi Arabia",
    total: 24,
    items: [
      { n: "Saudi National Bank", s: "SNB", c: "#005c3c" },
      { n: "Al Rajhi Bank", s: "AR", c: "#004a2f" },
      { n: "Riyad Bank", s: "RB", c: "#0a3d91" },
      { n: "ANB", s: "AN", c: "#8b1f2f" },
      { n: "Alinma", s: "AL", c: "#f0a419" },
      { n: "SAB", s: "SA", c: "#0b6cb5" },
    ],
  },
};

const BROKERAGES: { total: number; items: LogoChip[] } = {
  total: 18,
  items: [
    { n: "Robinhood", s: "RH", c: "#00c805" },
    { n: "Fidelity", s: "FI", c: "#00854a" },
    { n: "Interactive Brokers", s: "IB", c: "#d31145" },
    { n: "Coinbase", s: "CB", c: "#0052ff" },
    { n: "Alpaca", s: "AP", c: "#f5c518" },
    { n: "Schwab", s: "SC", c: "#00a0df" },
  ],
};

function LogoDot({ n, s, c, size = 22 }: LogoChip & { size?: number }) {
  return (
    <span
      title={n}
      className="grid shrink-0 place-items-center rounded-full text-[9px] font-bold text-white ring-1 ring-white/60"
      style={{ background: c, width: size, height: size }}
    >
      {s}
    </span>
  );
}

function useHoverExpand() {
  const [open, setOpen] = useState(false);
  return {
    open,
    setOpen,
    bind: {
      onMouseEnter: () => setOpen(true),
      onMouseLeave: () => setOpen(false),
      onFocus: () => setOpen(true),
      onBlur: (e: React.FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      },
    },
  };
}

function startConnect(kind: "bank" | "brokerage", name: string) {
  // Demo: simulate direct connection kickoff (no SnapTrade redirect)
  alert(`Starting secure connection to ${name}…\n(${kind === "bank" ? "Open Banking" : "SnapTrade OAuth"} handshake begins in-app)`);
}

function ConnectBankCard() {
  const [country, setCountry] = useState<"SG" | "AE" | "SA">("SG");
  const { open, bind } = useHoverExpand();
  const data = BANKS_BY_COUNTRY[country];
  const shown = data.items.slice(0, 5);
  const totalAll = BANKS_BY_COUNTRY.SG.total + BANKS_BY_COUNTRY.AE.total + BANKS_BY_COUNTRY.SA.total;
  return (
    <Card>
      <div {...bind} tabIndex={0} className="outline-none">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold">
              <Landmark className="size-3.5 text-primary" /> Connect a bank
            </div>
            <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
              Balances & net worth · {totalAll}+ banks
            </p>
          </div>
          <button
            onClick={() => startConnect("bank", "your bank")}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            Connect <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div
          className={`grid transition-all duration-200 ease-out ${
            open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex gap-1">
              {(Object.keys(BANKS_BY_COUNTRY) as Array<"SG" | "AE" | "SA">).map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold transition ${
                    country === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {BANKS_BY_COUNTRY[c].flag} {c === "AE" ? "UAE" : c === "SA" ? "KSA" : "SG"}
                </button>
              ))}
            </div>
            <ul className="mt-1.5 divide-y divide-border/60 rounded-lg border border-border/60 bg-surface-container-low/60">
              {shown.map((b) => (
                <li key={b.n}>
                  <button
                    onClick={() => startConnect("bank", b.n)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] font-medium hover:bg-primary/5"
                  >
                    <LogoDot {...b} size={18} />
                    <span className="flex-1 truncate">{b.n}</span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert(`Opening full list of ${data.total} ${data.label} banks…`)}
              className="mt-1 flex w-full items-center justify-center gap-1 rounded-md py-1 text-[10px] font-medium text-primary hover:bg-primary/5"
            >
              <Search className="size-3" /> Search all {data.total} {data.label} banks
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ConnectBrokerageCard() {
  const { open, bind } = useHoverExpand();
  const shown = BROKERAGES.items.slice(0, 5);
  return (
    <Card>
      <div {...bind} tabIndex={0} className="outline-none">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold">
              <Building2 className="size-3.5 text-primary" /> Connect brokerage
            </div>
            <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
              Auto-sync holdings · {BROKERAGES.total}+ platforms
            </p>
          </div>
          <button
            onClick={() => startConnect("brokerage", "your brokerage")}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            Connect <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div
          className={`grid transition-all duration-200 ease-out ${
            open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="divide-y divide-border/60 rounded-lg border border-border/60 bg-surface-container-low/60">
              {shown.map((b) => (
                <li key={b.n}>
                  <button
                    onClick={() => startConnect("brokerage", b.n)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] font-medium hover:bg-primary/5"
                  >
                    <LogoDot {...b} size={18} />
                    <span className="flex-1 truncate">{b.n}</span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert(`Opening full list of ${BROKERAGES.total} supported brokerages…`)}
              className="mt-1 flex w-full items-center justify-center gap-1 rounded-md py-1 text-[10px] font-medium text-primary hover:bg-primary/5"
            >
              <Search className="size-3" /> Search all {BROKERAGES.total} brokerages
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StartTile({
  title,
  body,
  icon,
  onClick,
}: {
  title: string;
  body: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex h-full flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:shadow-soft"
    >
      <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{body}</div>
      <div className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-70 transition group-hover:opacity-100">
        See how <ArrowRight className="size-3" />
      </div>
    </button>
  );
}

/* ---------- Starter simulator (Guest / first-time login) ---------- */

const STARTER_META: Record<
  StarterKind,
  { title: string; sub: string; icon: ReactNode }
> = {
  loan: {
    title: "Loan handling plan",
    sub: "See what pay-down + smart investing looks like side by side",
    icon: <HandCoins className="size-4" />,
  },
  invest: {
    title: "Save & invest plan",
    sub: "$300/mo · 3 years · what you'd actually end up with",
    icon: <PiggyBank className="size-4" />,
  },
  goal: {
    title: "Goal-based plan",
    sub: "Pick what you want — we'll show the shortest path to it",
    icon: <Target className="size-4" />,
  },
};

function StarterSimulator({
  kind,
  onClose,
}: {
  kind: StarterKind | null;
  onClose: () => void;
}) {
  const meta = kind ? STARTER_META[kind] : null;
  return (
    <Dialog open={!!kind} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {meta && (
          <>
            <DialogHeader className="border-b border-border/70 bg-secondary/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  {meta.icon}
                </div>
                <div>
                  <DialogTitle className="text-base">{meta.title}</DialogTitle>
                  <DialogDescription className="text-xs">{meta.sub}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {kind === "loan" && <LoanSimulator />}
              {kind === "invest" && <InvestSimulator />}
              {kind === "goal" && <GoalSimulator />}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-border/70 bg-secondary/40 p-3">
                <div className="text-xs text-muted-foreground">
                  Numbers are illustrative. Sign up to run this with your real balances.
                </div>
                <PillButton size="sm" icon={<ArrowRight className="size-3.5" />}>
                  Start this plan
                </PillButton>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatBlock({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "primary" | "danger";
}) {
  const toneCls =
    tone === "primary"
      ? "text-primary"
      : tone === "danger"
        ? "text-[color:var(--danger)]"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-lg font-bold ${toneCls}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function AllocBar({ parts }: { parts: { label: string; pct: number; color: string }[] }) {
  return (
    <div className="space-y-1.5">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${p.pct}%`, background: p.color }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {parts.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full" style={{ background: p.color }} />
            {p.label} {p.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function LoanSimulator() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <StatBlock label="Loan balance" value="$18,500" sub="6.9% APR · 60 mo left" />
        <StatBlock label="Monthly you can spare" value="$620" sub="after essentials" />
        <StatBlock label="Interest you'd save" value="$2,140" tone="primary" sub="vs. minimums" />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Plan A · Aggressive payoff</div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
              Debt-free faster
            </span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Loan gone in</span><span className="font-semibold text-foreground">42 months</span></div>
            <div className="flex justify-between"><span>Invested on the side</span><span className="font-semibold text-foreground">$0</span></div>
            <div className="flex justify-between"><span>Net worth in 5 yrs</span><span className="font-semibold text-foreground">+$4,900</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Plan B · Pay + invest</div>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
              We recommend
            </span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Loan gone in</span><span className="font-semibold text-foreground">54 months</span></div>
            <div className="flex justify-between"><span>Invested on the side</span><span className="font-semibold text-foreground">$220/mo</span></div>
            <div className="flex justify-between"><span>Net worth in 5 yrs</span><span className="font-semibold text-primary">+$11,300</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Recommended portfolio</Label>
            <div className="mt-0.5 text-sm font-semibold">Debt-Smart Balanced · 5.8% avg</div>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">Low volatility · liquid</div>
        </div>
        <div className="mt-2">
          <AllocBar
            parts={[
              { label: "Bond ETF (BND)", pct: 45, color: "var(--primary)" },
              { label: "US Stocks (VTI)", pct: 30, color: "#0ea5e9" },
              { label: "Intl (VXUS)", pct: 15, color: "#8b5cf6" },
              { label: "Cash", pct: 10, color: "#64748b" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function InvestSimulator() {
  const options = [
    { name: "Conservative", ret: "4.2%", end: "$11,540", note: "capital protection" },
    { name: "Balanced", ret: "6.8%", end: "$12,850", note: "we recommend", recommended: true },
    { name: "Growth", ret: "9.4%", end: "$14,120", note: "higher swings" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <StatBlock label="You put in" value="$300/mo" sub="$10,800 over 3 yrs" />
        <StatBlock label="Projected value" value="$12,850" tone="primary" sub="Balanced · 6.8% avg" />
        <StatBlock label="Vs plain savings" value="+$2,050" sub="1.5% APY comparison" />
      </div>

      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <Label>3-year projection</Label>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> Invested</span>
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-muted-foreground/60" /> Savings</span>
          </div>
        </div>
        <div className="mt-1"><DualSparkline /></div>
      </div>

      <div>
        <Label>Pick a starting portfolio</Label>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {options.map((o) => (
            <div
              key={o.name}
              className={`rounded-xl border p-3 ${
                o.recommended ? "border-primary/40 bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{o.name}</div>
                {o.recommended && (
                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Pick
                  </span>
                )}
              </div>
              <div className="mt-1 text-lg font-bold text-primary">{o.ret}</div>
              <div className="text-[11px] text-muted-foreground">→ {o.end} in 3y</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{o.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalSimulator() {
  const goals = [
    { id: "car", label: "New car", icon: <Car className="size-3.5" />, target: 28000, months: 24 },
    { id: "house", label: "House down-pmt", icon: <Home className="size-3.5" />, target: 45000, months: 48 },
    { id: "trip", label: "Big trip", icon: <Plane className="size-3.5" />, target: 6500, months: 12 },
    { id: "school", label: "School", icon: <GraduationCap className="size-3.5" />, target: 18000, months: 36 },
  ];
  const [pick, setPick] = useState(goals[0]);
  const monthlySave = Math.round(pick.target / pick.months);
  const monthlyInvest = Math.round(pick.target / (pick.months * 1.14));
  return (
    <div className="space-y-4">
      <div>
        <Label>What are you saving for?</Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {goals.map((g) => {
            const active = g.id === pick.id;
            return (
              <button
                key={g.id}
                onClick={() => setPick(g)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {g.icon}
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <StatBlock label="Target" value={`$${pick.target.toLocaleString()}`} sub={`in ${pick.months} months`} />
        <StatBlock label="Just saving" value={`$${monthlySave}/mo`} sub="0% return" />
        <StatBlock label="Investing" value={`$${monthlyInvest}/mo`} tone="primary" sub="Goal-Track Balanced" />
      </div>

      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Sample portfolio for this goal</Label>
            <div className="mt-0.5 text-sm font-semibold">Goal-Track Balanced · 6.4% avg</div>
          </div>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Auto-rebalanced
          </span>
        </div>
        <div className="mt-2">
          <AllocBar
            parts={[
              { label: "VTI", pct: 40, color: "var(--primary)" },
              { label: "BND", pct: 35, color: "#0ea5e9" },
              { label: "VXUS", pct: 15, color: "#8b5cf6" },
              { label: "Cash", pct: 10, color: "#64748b" },
            ]}
          />
        </div>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          <li className="flex items-start gap-1.5">
            <Check className="mt-0.5 size-3.5 text-primary" />
            AI shifts to safer assets as you get within 6 months of your goal.
          </li>
          <li className="flex items-start gap-1.5">
            <Check className="mt-0.5 size-3.5 text-primary" />
            Weekly nudges if you fall behind — we tell you exactly what to top up.
          </li>
        </ul>
      </div>
    </div>
  );
}

function AiVsBenchmarkCard() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>AI portfolio vs S&P 500</Label>
          <div className="mt-1 text-sm font-semibold">Trailing 12 months</div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            <span className="font-semibold text-primary">AI +12.4%</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 rounded-full border border-muted-foreground" />
            S&amp;P +8.2%
          </span>
        </div>
      </div>
      <div className="mt-2">
        <DualSparkline />
      </div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">
        AI Balanced Growth outperformed by <span className="font-semibold text-primary">+4.2%</span> · lower drawdown
      </div>
    </Card>
  );
}

function GuestUsageMeter() {
  const used = 2;
  const total = 5;
  const pct = (used / total) * 100;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Free AI today</Label>
        <span className="text-[11px] font-semibold text-primary">New here</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="num text-xl font-bold">{total - used}</span>
        <span className="text-xs text-muted-foreground">of {total} messages left</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80">
        Sign up for unlimited <ArrowRight className="size-3" />
      </button>
    </Card>
  );
}

function BlogTeaserCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>From the blog</Label>
        <BookOpen className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-2 space-y-2">
        <a className="block rounded-xl border border-border/70 bg-muted/30 p-2.5 hover:bg-muted/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Beginner · 4 min
          </div>
          <div className="mt-0.5 text-sm font-semibold leading-tight">
            The 3 numbers that matter more than picking stocks
          </div>
        </a>
        <a className="block rounded-xl border border-border/70 bg-muted/30 p-2.5 hover:bg-muted/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Explainer · 2 min
          </div>
          <div className="mt-0.5 text-sm font-semibold leading-tight">
            Why AI beats gut-feel: the boring math behind it
          </div>
        </a>
      </div>
    </Card>
  );
}

/* ---------- TIER 2: BEGINNER ---------- */

function BeginnerLeft() {
  return (
    <>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Good morning</div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--warning)]/15 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--warning)]">
                <Flame className="size-3" /> 3-day streak
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">Welcome back, Alex.</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Shield className="size-3.5" />
            AI Guard Active · 0 issues
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
          You haven't connected any accounts yet, so there's{" "}
          <span className="text-foreground">nothing at risk.</span> Take your time to explore.
        </div>
      </Card>

      <DailyLessonCard />

      <Card>
        <div className="flex items-center justify-between">
          <Label>While you were away</Label>
          <span className="text-[11px] text-muted-foreground">Overnight</span>
        </div>
        <ul className="mt-2 divide-y divide-border/70">
          <Alert
            icon={<Newspaper className="size-4" />}
            tint="info"
            title="Fed holds rates; signals 2 cuts in 2026"
            meta="Bond yields ease · S&P futures +0.4%"
          />
          <Alert
            icon={<TrendingUp className="size-4" />}
            tint="primary"
            title="NVDA lifts chip sector on earnings beat"
            meta="Semiconductors +2.1% · AI-adjacent names rally"
          />
          <Alert
            icon={<Zap className="size-4" />}
            tint="primary"
            title="AI scanned 50+ opportunities overnight"
            meta="3 flagged for beginner-friendly portfolios"
          />
        </ul>
      </Card>

      <Card glow className="gradient-mint">
        <div className="flex items-center justify-between">
          <Label>Your goal · Your next step</Label>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-primary/25" />
          </div>
        </div>
        <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          $50k house deposit · 4 years
        </div>
        <h2 className="mt-0.5 text-xl font-bold">Connect a bank account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One 30-second link lets AI see your cash so it can spot idle money and inflation drag.
          Read-only. Never leaves your device.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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

function BeginnerRight() {
  return (
    <>
      <TrialStatusCard />
      <TopPerformers />
      <SavingsGoalCard />
      <PushPromptCard />
    </>
  );
}

function DailyLessonCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Today's lesson · 2 min</Label>
        <BookOpen className="size-4 text-primary" />
      </div>
      <div className="mt-1.5 text-base font-semibold leading-tight">
        What is a portfolio, really?
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        A mix of investments that spreads risk. Think of it as a shopping basket for your future
        self — not a bet on a single stock.
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Day 3 of your 7-day starter
        </span>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80">
          Read now <ArrowRight className="size-3" />
        </button>
      </div>
    </Card>
  );
}

function TrialStatusCard() {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 shadow-soft">
      <Crown className="size-4 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold">Pro trial · 12 days left</div>
        <div className="text-[11px] text-muted-foreground">Unlimited AI · full analysis</div>
      </div>
      <button className="text-xs font-semibold text-primary hover:opacity-80">Upgrade</button>
    </div>
  );
}

function PushPromptCard() {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <BellRing className="size-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Get your next step tomorrow</div>
          <div className="text-[11px] text-muted-foreground">
            One tap · we'll only ping for things that matter
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <PillButton size="sm">Turn on</PillButton>
        <PillButton size="sm" variant="secondary">Later</PillButton>
      </div>
    </Card>
  );
}

function SamplePortfolioCard() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Label>Sample portfolio</Label>
          <div className="mt-0.5 text-base font-semibold">Balanced Growth · AI</div>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
          Beating cash +6.2%
        </span>
      </div>
      <div className="mt-2">
        <Sparkline up />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">1Y return</div>
          <div className="num text-sm font-semibold text-primary">+14.8%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Risk</div>
          <div className="num text-sm font-semibold">Moderate</div>
        </div>
        <div>
          <div className="text-muted-foreground">Holdings</div>
          <div className="num text-sm font-semibold">12</div>
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
    <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="num mt-0.5 text-base font-semibold">{value}</div>
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
      <BenchmarkStrip />
      <AllocationBreakdown />
      <MostImportantThing withAnalysis={withAnalysis} />
      {withAnalysis && <DriftLedger />}
      <WhileYouWereAway withAnalysis={withAnalysis} />
      <EarningsStrip />
      {withAnalysis && <NewsImpactCard />}
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

function InvestorRight({ withAnalysis }: { withAnalysis: boolean }) {
  return (
    <>
      <WatchlistStrip />
      <TopPerformers />
      <IdleCashCard />
      {withAnalysis && <PolymarketCard />}
      {withAnalysis && <ScannerOpportunitiesCard />}
      {!withAnalysis && <UpgradePreviewCard />}
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
            <AiMonitoringBadge issues={withAnalysis ? 2 : 0} />
          </div>
          <div className="mt-2">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Net worth
            </div>
            <div className="num text-3xl font-bold md:text-4xl">$248,412.30</div>
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
          <div className="w-full max-w-[180px] rounded-xl border border-dashed border-border bg-muted/40 p-3 text-center">
            <Bot className="mx-auto size-5 text-muted-foreground" />
            <div className="mt-1 text-xs text-muted-foreground">
              Run analysis for your health score
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <DualSparkline />
      </div>
    </Card>
  );
}

function HealthRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2">
      <svg width="72" height="72" viewBox="0 0 88 88">
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
    <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5">
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

function BenchmarkStrip() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>You vs benchmark · 1W</Label>
        <LineChart className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border border-border/70 bg-primary/5 p-2.5">
          <div className="text-muted-foreground">Your portfolio</div>
          <div className="num mt-0.5 text-sm font-semibold text-primary">+1.24%</div>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5">
          <div className="text-muted-foreground">S&amp;P 500</div>
          <div className="num mt-0.5 text-sm font-semibold">+0.82%</div>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5">
          <div className="text-muted-foreground">Alpha</div>
          <div className="num mt-0.5 text-sm font-semibold text-primary">+0.42%</div>
        </div>
      </div>
    </Card>
  );
}

function AllocationBreakdown() {
  const rows = [
    { name: "Tech", pct: 41, color: "var(--primary)" },
    { name: "Financials", pct: 18, color: "var(--info)" },
    { name: "Healthcare", pct: 14, color: "var(--warning)" },
    { name: "Consumer", pct: 12, color: "var(--accent-foreground)" },
    { name: "Other", pct: 15, color: "var(--muted-foreground)" },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Allocation · top sectors</Label>
        <span className="text-[11px] text-muted-foreground">28 holdings</span>
      </div>
      <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full">
        {rows.map((r) => (
          <div key={r.name} style={{ width: `${r.pct}%`, background: r.color }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5 text-[11px]">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: r.color }} />
            <span className="truncate">
              <span className="font-semibold">{r.name}</span>{" "}
              <span className="num text-muted-foreground">{r.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MostImportantThing({ withAnalysis }: { withAnalysis: boolean }) {
  if (!withAnalysis) {
    return (
      <Card className="gradient-mint" glow>
        <Label>Most important thing</Label>
        <h3 className="mt-1.5 text-lg font-bold">Get your AI portfolio analysis</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Health score, concentration risk, rebalance suggestions and idle-cash drag — in 15
          seconds.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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
      <h3 className="mt-1.5 text-lg font-bold">
        Tech is 41% of your portfolio — consider trimming.
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A single-sector drawdown could hit your net worth harder than your risk profile allows.
        A small rebalance restores balance without triggering large tax events.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <PillButton icon={<CheckCircle2 className="size-4" />}>Approve rebalance</PillButton>
        <PillButton variant="secondary" icon={<Target className="size-4" />}>
          Review details
        </PillButton>
        <PillButton variant="secondary" icon={<Bot className="size-4" />}>
          Ask AI
        </PillButton>
      </div>
    </Card>
  );
}

function DriftLedger() {
  const rows = [
    { title: "Tech sector 41% (target 25%)", meta: "Trim AAPL 2%, NVDA 1%", severity: "high" },
    { title: "Cash drag 8.4% idle", meta: "$15,240 in checking", severity: "medium" },
    { title: "US equity 82% (target 70%)", meta: "Add 5% international ETF", severity: "medium" },
    { title: "Bond weight 4% (target 10%)", meta: "Underweight defensive", severity: "low" },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Drift & rebalance ledger</Label>
        <span className="text-[11px] text-muted-foreground">4 actions</span>
      </div>
      <ul className="mt-2 divide-y divide-border/70">
        {rows.map((r) => (
          <li key={r.title} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            <span
              className={`size-2 rounded-full ${
                r.severity === "high"
                  ? "bg-[color:var(--danger)]"
                  : r.severity === "medium"
                  ? "bg-[color:var(--warning)]"
                  : "bg-primary"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{r.title}</div>
              <div className="text-[11px] text-muted-foreground">{r.meta}</div>
            </div>
            <button className="rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/15">
              Approve
            </button>
            <button className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
              Review
            </button>
          </li>
        ))}
      </ul>
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
      <ul className="mt-2 divide-y divide-border/70">
        <Alert
          icon={<Bell className="size-4" />}
          tint="info"
          title="NVDA hit your $145 alert"
          meta="Price now $146.30 · +0.9% today"
        />
        <Alert
          icon={<Newspaper className="size-4" />}
          tint="info"
          title="Fed signals 2 cuts in 2026 — yields ease"
          meta="Bond ETFs +0.6% · growth-friendly setup"
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

function EarningsStrip() {
  const rows = [
    { sym: "AAPL", day: "Tue", when: "AMC" },
    { sym: "MSFT", day: "Thu", when: "AMC" },
    { sym: "NVDA", day: "Wed", when: "AMC" },
    { sym: "GOOGL", day: "Thu", when: "AMC" },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Earnings this week</Label>
        <CalendarClock className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {rows.map((r) => (
          <div
            key={r.sym}
            className="rounded-xl border border-border/70 bg-muted/30 p-2 text-center"
          >
            <div className="text-sm font-semibold">{r.sym}</div>
            <div className="text-[11px] text-muted-foreground">
              {r.day} · {r.when}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NewsImpactCard() {
  const rows = [
    { title: "NVDA guidance beat lifts AI names", impact: "+$1,240", affects: 4, up: true },
    { title: "Regulator fines META $520M", impact: "-$180", affects: 1, up: false },
    { title: "Oil -2.8% on OPEC+ output hike", impact: "-$310", affects: 2, up: false },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>News impact on your holdings</Label>
        <Newspaper className="size-4 text-muted-foreground" />
      </div>
      <ul className="mt-2 divide-y divide-border/70">
        {rows.map((r) => (
          <li key={r.title} className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
            <div
              className={`grid size-7 place-items-center rounded-lg ${
                r.up
                  ? "bg-primary/10 text-primary"
                  : "bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
              }`}
            >
              {r.up ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-tight">{r.title}</div>
              <div className="text-[11px] text-muted-foreground">
                Affects {r.affects} holding{r.affects > 1 ? "s" : ""}
              </div>
            </div>
            <div
              className={`num text-sm font-semibold ${
                r.up ? "text-primary" : "text-[color:var(--danger)]"
              }`}
            >
              {r.impact}
            </div>
          </li>
        ))}
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
    <li className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
      <div className={`grid size-7 place-items-center rounded-lg ${tintCls}`}>{icon}</div>
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
      <div className="mt-2 grid grid-cols-3 gap-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-border/70 bg-muted/30 p-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {r.label}
            </div>
            <div className="num mt-0.5 text-sm font-semibold">{r.value}</div>
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

function WatchlistStrip() {
  const rows = [
    { sym: "NVDA", price: "146.30", delta: "+0.9%", up: true },
    { sym: "AAPL", price: "224.10", delta: "+1.4%", up: true },
    { sym: "TSLA", price: "218.05", delta: "-3.2%", up: false },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Your watchlist</Label>
        <Eye className="size-4 text-muted-foreground" />
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.sym}
            className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-2.5 py-1.5 hover:bg-muted/50"
          >
            <div className="text-sm font-semibold">{r.sym}</div>
            <div className="flex items-center gap-2">
              <span className="num text-xs">{r.price}</span>
              <span
                className={`num text-xs font-semibold ${
                  r.up ? "text-primary" : "text-[color:var(--danger)]"
                }`}
              >
                {r.delta}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

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
      <ul className="mt-2 space-y-1.5">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-2.5 py-2 hover:bg-muted/50"
          >
            <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{r.name}</div>
              <div className="text-[11px] text-muted-foreground">{r.by}</div>
            </div>
            <div className="num text-sm font-semibold text-primary">{r.ret}</div>
          </li>
        ))}
      </ul>
      <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80">
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
      <div className="mt-1.5 text-sm font-semibold">House deposit</div>
      <div className="num mt-0.5 text-xl font-bold">
        $24,500 <span className="text-sm font-medium text-muted-foreground">/ $50,000</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-xs">
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
      <div className="num mt-1.5 text-2xl font-bold">$18,240</div>
      <p className="mt-1 text-xs text-muted-foreground">
        Sitting in checking at 0.01% APY. Inflation drag ≈{" "}
        <span className="num text-foreground">$547/yr</span>.
      </p>
      <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
        <div className="text-xs font-semibold text-primary">If moved to AI Portfolio</div>
        <div className="num mt-0.5 text-base font-semibold">
          +$1,824 <span className="text-xs font-medium text-muted-foreground">est. 12mo</span>
        </div>
      </div>
      <div className="mt-3">
        <PillButton icon={<ArrowRight className="size-4" />}>Move to AI Portfolio</PillButton>
      </div>
    </Card>
  );
}

function PolymarketCard() {
  const rows = [
    { q: "Fed cuts rates in Q1?", yes: 68 },
    { q: "S&P 500 > 5,800 by year-end?", yes: 54 },
    { q: "Recession called in 2026?", yes: 22 },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>Markets are betting on</Label>
        <Vote className="size-4 text-muted-foreground" />
      </div>
      <ul className="mt-2 space-y-2">
        {rows.map((r) => (
          <li key={r.q}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">{r.q}</span>
              <span className="num font-semibold text-primary">{r.yes}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${r.yes}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ScannerOpportunitiesCard() {
  const rows = [
    { sym: "AVGO", why: "AI momentum · low drawdown", score: 92 },
    { sym: "LLY", why: "Earnings acceleration", score: 88 },
    { sym: "COST", why: "Defensive quality", score: 84 },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label>AI opportunities today</Label>
        <Radar className="size-4 text-muted-foreground" />
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.sym}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-2.5 py-2 hover:bg-muted/50"
          >
            <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
              {r.score}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{r.sym}</div>
              <div className="text-[11px] text-muted-foreground">{r.why}</div>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function UpgradePreviewCard() {
  return (
    <Card className="gradient-mint" glow>
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <Label>Unlock next tier</Label>
      </div>
      <div className="mt-1.5 text-sm font-semibold">Get your AI health score</div>
      <p className="mt-1 text-xs text-muted-foreground">
        See concentration risk, drift, and rebalance suggestions tailored to your holdings.
      </p>
      <div className="mt-2">
        <PillButton size="sm" icon={<Sparkles className="size-3.5" />}>
          Run free analysis
        </PillButton>
      </div>
    </Card>
  );
}
