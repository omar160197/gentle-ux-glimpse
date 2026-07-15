import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  Plus,
  ArrowRight,
  Bot,
  Send,
  Zap,
  Leaf,
  DollarSign,
  Trophy,
  Target,
  Flame,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/fantasy")({
  head: () => ({
    meta: [
      { title: "Fantasy Sandbox — Test ideas with $10K virtual" },
      {
        name: "description",
        content:
          "Simulate any investing idea risk-free. $10,000 virtual capital, real market logic, AI copilot commentary.",
      },
      { property: "og:title", content: "Fantasy Sandbox" },
      { property: "og:description", content: "Test market hypotheses with zero risk." },
    ],
  }),
  component: FantasyPage,
});

/* ---------- data ---------- */

type Strategy = "ai" | "dividend" | "clean" | "custom";
type Period = "1M" | "6M" | "1Y" | "3Y" | "5Y" | "10Y";

const STRATEGIES: { id: Strategy; label: string; annual: number; vol: string; sharpe: number; note: string }[] = [
  { id: "ai", label: "AI Growth", annual: 0.28, vol: "High", sharpe: 1.9, note: "Tech-heavy, NVDA/MSFT/GOOGL leaders" },
  { id: "dividend", label: "Dividend Core", annual: 0.09, vol: "Low", sharpe: 1.4, note: "Cash-flow stocks, quarterly payouts" },
  { id: "clean", label: "Clean Energy", annual: 0.14, vol: "Med-High", sharpe: 1.1, note: "Solar / EV / grid infrastructure" },
  { id: "custom", label: "Balanced 60/40", annual: 0.11, vol: "Low-Med", sharpe: 1.6, note: "60% equities, 40% bonds" },
];

const PERIODS: { id: Period; years: number }[] = [
  { id: "1M", years: 1 / 12 },
  { id: "6M", years: 0.5 },
  { id: "1Y", years: 1 },
  { id: "3Y", years: 3 },
  { id: "5Y", years: 5 },
  { id: "10Y", years: 10 },
];

const PERSONAS = [
  {
    id: "sara",
    name: "Sara",
    tag: "Paid off loan + still invested",
    line: "Split $600/mo between loan and Dividend Core.",
    result: "+$14,200 net worth in 3 yrs",
    preset: { amount: 8000, strategy: "dividend" as Strategy, period: "3Y" as Period, monthly: 300 },
  },
  {
    id: "marcus",
    name: "Marcus",
    tag: "$300/mo · 3 years",
    line: "Steady DCA into an AI Growth basket.",
    result: "+$4,850 vs savings account",
    preset: { amount: 0, strategy: "ai" as Strategy, period: "3Y" as Period, monthly: 300 },
  },
  {
    id: "priya",
    name: "Priya",
    tag: "Bought her car 8 months early",
    line: "$5K + $250/mo, Balanced 60/40 for goal.",
    result: "Hit $24K goal 8 mo ahead",
    preset: { amount: 5000, strategy: "custom" as Strategy, period: "1Y" as Period, monthly: 250 },
  },
];

const PORTFOLIOS = [
  {
    id: "ai-supercycle",
    name: "AI Supercycle",
    tickers: ["NVDA", "MSFT", "GOOGL", "AMD"],
    alloc: [40, 25, 20, 15],
    ytd: 34.2,
    value: 13420,
    color: "emerald",
  },
  {
    id: "clean-future",
    name: "Clean Future",
    tickers: ["TSLA", "ENPH", "NEE", "ICLN"],
    alloc: [35, 25, 25, 15],
    ytd: -8.1,
    value: 9190,
    color: "sky",
  },
  {
    id: "dividend-machine",
    name: "Dividend Machine",
    tickers: ["JNJ", "KO", "PG", "VZ"],
    alloc: [30, 25, 25, 20],
    ytd: 11.4,
    value: 11140,
    color: "amber",
  },
  {
    id: "btc-max",
    name: "The BTC Max",
    tickers: ["BTC", "ETH", "SOL"],
    alloc: [70, 20, 10],
    ytd: 62.8,
    value: 16280,
    color: "orange",
  },
];

const TRENDING = [
  "What if I'd bought NVDA in 2020?",
  "What if I DCA'd $500/mo into S&P for 10 years?",
  "What if I put my rent into REITs?",
  "What if I sold BTC at the last peak?",
];

/* ---------- helpers ---------- */

function projectValue(amount: number, monthly: number, annual: number, years: number) {
  const r = annual;
  const n = years;
  const lump = amount * Math.pow(1 + r, n);
  const monthlyR = r / 12;
  const months = n * 12;
  const contrib = monthly * ((Math.pow(1 + monthlyR, months) - 1) / (monthlyR || 1e-9));
  return Math.round(lump + contrib);
}

function projectSeries(amount: number, monthly: number, annual: number, years: number, points = 40) {
  const arr: number[] = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * years;
    arr.push(projectValue(amount, monthly, annual, t));
  }
  return arr;
}

function sparklinePath(vals: number[], w: number, h: number, pad = 4) {
  if (vals.length === 0) return "";
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const step = (w - pad * 2) / (vals.length - 1);
  return vals
    .map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function usd(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

/* ---------- page ---------- */

function FantasyPage() {
  const [strategy, setStrategy] = useState<Strategy>("ai");
  const [period, setPeriod] = useState<Period>("3Y");
  const [amount, setAmount] = useState(5000);
  const [monthly, setMonthly] = useState(200);

  const strat = STRATEGIES.find((s) => s.id === strategy)!;
  const years = PERIODS.find((p) => p.id === period)!.years;

  const projected = useMemo(() => projectValue(amount, monthly, strat.annual, years), [amount, monthly, strat, years]);
  const sp500 = useMemo(() => projectValue(amount, monthly, 0.09, years), [amount, monthly, years]);
  const series = useMemo(() => projectSeries(amount, monthly, strat.annual, years), [amount, monthly, strat, years]);
  const spSeries = useMemo(() => projectSeries(amount, monthly, 0.09, years), [amount, monthly, years]);

  const invested = amount + monthly * years * 12;
  const gain = projected - invested;
  const vsSp = projected - sp500;

  function applyPreset(p: { amount: number; strategy: Strategy; period: Period; monthly: number }) {
    setAmount(p.amount);
    setStrategy(p.strategy);
    setPeriod(p.period);
    setMonthly(p.monthly);
  }

  return (
    <div className="min-h-screen bg-background">
      <FantasyTopBar />
      <main className="mx-auto max-w-7xl px-4 py-5 md:px-10">
        {/* Hero header */}
        <div className="mb-5 flex flex-col items-start justify-between gap-3 border-b border-border/70 pb-4 md:flex-row md:items-end">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" /> Sandbox mode · zero risk
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Fantasy Sandbox</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Test any investing idea with $10,000 in virtual money. Real market logic, no real losses.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-card/70 p-1.5 pr-5 shadow-soft backdrop-blur">
            <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <Wallet className="size-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Virtual balance</div>
              <div className="font-display text-lg font-bold leading-tight text-foreground">$10,000.00</div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* ---- LEFT: hypothesis lab ---- */}
          <div className="space-y-5 lg:col-span-2">
            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft ring-1 ring-primary/5 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">The Hypothesis Lab</h2>
                  <p className="text-xs text-muted-foreground">Adjust the controls, watch your money re-project live.</p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
                  <Plus className="size-3.5" /> New experiment
                </button>
              </div>

              {/* Controls */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Starting amount
                  </label>
                  <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="font-display text-2xl font-bold text-foreground">{usd(amount)}</span>
                      <span className="text-[11px] text-muted-foreground">of $10,000 virtual</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      step={100}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly contribution
                  </label>
                  <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="font-display text-2xl font-bold text-foreground">{usd(monthly)}</span>
                      <span className="text-[11px] text-muted-foreground">/ month</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={25}
                      value={monthly}
                      onChange={(e) => setMonthly(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Strategy
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STRATEGIES.map((s) => {
                    const active = s.id === strategy;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setStrategy(s.id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-soft"
                            : "border-border/70 bg-background/60 text-foreground hover:border-primary/40"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Time horizon
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PERIODS.map((p) => {
                    const active = p.id === period;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPeriod(p.id)}
                        className={`rounded-lg border px-3 py-1 text-xs font-semibold transition ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live chart */}
              <div className="mt-5 rounded-xl border border-border/70 bg-background/40 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      You'd have
                    </div>
                    <div className="font-display text-3xl font-bold text-foreground">{usd(projected)}</div>
                    <div className="mt-0.5 text-xs text-primary">
                      +{usd(gain)} gain · {usd(vsSp > 0 ? vsSp : -vsSp)} {vsSp >= 0 ? "ahead of" : "behind"} S&amp;P 500
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
                      {strat.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/50"></span>
                      S&amp;P 500
                    </span>
                  </div>
                </div>

                <svg viewBox="0 0 480 140" className="mt-3 h-32 w-full">
                  <defs>
                    <linearGradient id="fantasy-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const path = sparklinePath(series, 480, 140, 6);
                    const spPath = sparklinePath(spSeries, 480, 140, 6);
                    const fill = `${path} L474,134 L6,134 Z`;
                    return (
                      <>
                        <path d={fill} fill="url(#fantasy-fill)" />
                        <path d={spPath} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
                        <path d={path} stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      </>
                    );
                  })()}
                </svg>

                <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs text-foreground">
                  <span className="mr-1.5 inline-flex items-center gap-1 font-semibold text-primary">
                    <Bot className="size-3.5" /> Copilot:
                  </span>
                  {strat.note}. Over {period}, projected volatility is {strat.vol.toLowerCase()} with a Sharpe of {strat.sharpe}.
                </div>
              </div>
            </section>

            {/* Persona cards */}
            <section>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-display text-base font-bold text-foreground">Clone a success story</h2>
                <span className="text-[11px] text-muted-foreground">Tap to load their exact setup</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.preset)}
                    className="group rounded-2xl border border-border/70 bg-card/80 p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{p.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.tag}</div>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{p.line}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
                      <span className="text-xs font-bold text-primary">{p.result}</span>
                      <ArrowRight className="size-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Portfolio grid */}
            <section>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-display text-base font-bold text-foreground">My fantasy portfolios</h2>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  <Plus className="size-3.5" /> New portfolio
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {PORTFOLIOS.map((p) => (
                  <Link
                    key={p.id}
                    to="/fantasy/$id"
                    params={{ id: p.id }}
                    className="group rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-foreground">{p.name}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.tickers.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold text-foreground">{usd(p.value)}</div>
                        <div
                          className={`text-xs font-semibold ${
                            p.ytd >= 0 ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {p.ytd >= 0 ? "+" : ""}
                          {p.ytd.toFixed(1)}% YTD
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                      {p.alloc.map((a, i) => (
                        <div
                          key={i}
                          style={{ width: `${a}%` }}
                          className={
                            [
                              "bg-primary",
                              "bg-primary/70",
                              "bg-primary/45",
                              "bg-primary/25",
                            ][i] ?? "bg-primary/20"
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{p.tickers.length} positions</span>
                      <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
                        Open details <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* ---- RIGHT: insight stack ---- */}
          <aside className="space-y-4">
            <section className="rounded-2xl bg-slate-900 p-5 text-white shadow-xl shadow-emerald-900/10">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-bold">Impact analytics</h3>
                <BarChart3 className="size-4 text-emerald-400" />
              </div>
              <div className="space-y-3 text-sm">
                <MetricRow label="Volatility" value={strat.vol} />
                <MetricRow label="Sharpe ratio" value={strat.sharpe.toFixed(2)} highlight />
                <MetricRow label="Est. annual return" value={`${(strat.annual * 100).toFixed(1)}%`} highlight />
                <MetricRow label="Total invested" value={usd(invested)} muted />
                <MetricRow label="Projected gain" value={usd(gain)} highlight />
              </div>
              <div className="mt-4 rounded-xl bg-emerald-800/40 p-3 text-[11px] leading-relaxed text-emerald-100">
                <span className="font-bold text-emerald-300">Pro insight:</span> Your "{strat.label}" scenario over {period} beats a plain savings account by roughly {usd(gain - monthly * years * 12 * 0.04)} — but expect swings.
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground">
                Trending what-ifs
              </h3>
              <div className="space-y-2">
                {TRENDING.map((q) => (
                  <button
                    key={q}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-transparent bg-background/50 px-3 py-2 text-left text-xs text-foreground transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="size-3.5 text-primary" />
                      {q}
                    </span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-soft">
              <div className="mb-1 flex items-center gap-2 text-primary">
                <Trophy className="size-4" />
                <h3 className="text-sm font-bold">Leaderboard</h3>
              </div>
              <p className="text-[11px] text-muted-foreground">Top fantasy portfolios this week</p>
              <div className="mt-3 space-y-2">
                {[
                  { rank: 1, name: "@quant_kate", return: 48.2 },
                  { rank: 2, name: "@marco_ai", return: 41.7 },
                  { rank: 3, name: "You · AI Supercycle", return: 34.2 },
                ].map((r) => (
                  <div key={r.rank} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {r.rank}
                      </span>
                      <span className="font-medium text-foreground">{r.name}</span>
                    </span>
                    <span className="font-semibold text-primary">+{r.return}%</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* Copilot dock */}
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border/70 bg-card/80 p-2 shadow-soft backdrop-blur">
          <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </div>
          <input
            placeholder="Ask copilot: What if I put $2K into clean energy and held for 5 years?"
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            Ask <Send className="size-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}

function MetricRow({
  label,
  value,
  highlight = false,
  muted = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2 last:border-none last:pb-0">
      <span className="text-xs text-emerald-300/80">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-emerald-400" : muted ? "text-emerald-100/70" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function FantasyTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 glass">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:justify-between md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Copilot Invest</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Fantasy sandbox · demo
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-2xl border border-border/70 bg-card p-1 shadow-soft">
          <Link
            to="/"
            className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
            activeOptions={{ exact: true }}
            activeProps={{ className: "rounded-xl bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary" }}
          >
            Home
          </Link>
          <Link
            to="/heatmap"
            className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
            activeProps={{ className: "rounded-xl bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary" }}
          >
            Heatmap
          </Link>
          <Link
            to="/fantasy"
            className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
            activeProps={{ className: "rounded-xl bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary" }}
          >
            Fantasy
          </Link>
        </nav>
      </div>
    </header>
  );
}
