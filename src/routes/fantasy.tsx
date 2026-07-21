import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
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
  Users,
  Lock,
  Globe,
  Clock,
  Copy,
  Share2,
  Shield,
  Award,
  Activity,
  Link2,
  Check,
  X,
  ChevronRight,
  UserPlus,
  Crown,
  Gauge,
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

/* ---- Leagues, trade desk, coach data ---- */

type LeagueKind = "public" | "private";
type League = {
  id: string;
  name: string;
  kind: LeagueKind;
  starts: string;
  endsInDays: number;
  totalDays: number;
  players: number;
  buyIn: number; // virtual
  rank: number;
  totalReturn: number; // %
  vsMkt: number; // %
  status: "live" | "upcoming";
};

const LEAGUES: League[] = [
  {
    id: "spring-global",
    name: "Spring Global Open",
    kind: "public",
    starts: "Mar 1",
    endsInDays: 12,
    totalDays: 30,
    players: 4820,
    buyIn: 10000,
    rank: 214,
    totalReturn: 12.4,
    vsMkt: 4.1,
    status: "live",
  },
  {
    id: "friends-4",
    name: "Friday Night Traders",
    kind: "private",
    starts: "Mar 8",
    endsInDays: 4,
    totalDays: 14,
    players: 6,
    buyIn: 5000,
    rank: 2,
    totalReturn: 8.7,
    vsMkt: 2.9,
    status: "live",
  },
  {
    id: "campus-nus",
    name: "NUS Investing Club",
    kind: "private",
    starts: "Mar 15",
    endsInDays: 0,
    totalDays: 60,
    players: 148,
    buyIn: 25000,
    rank: 0,
    totalReturn: 0,
    vsMkt: 0,
    status: "upcoming",
  },
];

type LeaderboardCategory = "return" | "vsmkt" | "sharpe" | "drawdown" | "risk";
const CATEGORIES: { id: LeaderboardCategory; label: string; icon: any; hint: string }[] = [
  { id: "return", label: "Highest return", icon: TrendingUp, hint: "Raw % since league start" },
  { id: "vsmkt", label: "Beats the market", icon: Zap, hint: "Alpha vs S&P 500" },
  { id: "sharpe", label: "Best risk-adjusted", icon: Gauge, hint: "Sharpe ratio" },
  { id: "drawdown", label: "Lowest drawdown", icon: Shield, hint: "Smallest peak-to-trough loss" },
  { id: "risk", label: "Bold portfolios", icon: Flame, hint: "High conviction plays" },
];

const CATEGORY_ROWS: Record<LeaderboardCategory, { rank: number; name: string; you?: boolean; metric: string }[]> = {
  return: [
    { rank: 1, name: "@quant_kate", metric: "+48.2%" },
    { rank: 2, name: "@marco_ai", metric: "+41.7%" },
    { rank: 3, name: "You · AI Supercycle", you: true, metric: "+34.2%" },
    { rank: 4, name: "@dividend_dan", metric: "+29.1%" },
  ],
  vsmkt: [
    { rank: 1, name: "@alpha_amy", metric: "+22.4% α" },
    { rank: 2, name: "You · AI Supercycle", you: true, metric: "+18.9% α" },
    { rank: 3, name: "@marco_ai", metric: "+15.2% α" },
    { rank: 4, name: "@quant_kate", metric: "+12.0% α" },
  ],
  sharpe: [
    { rank: 1, name: "@steady_sam", metric: "2.14" },
    { rank: 2, name: "@dividend_dan", metric: "1.97" },
    { rank: 3, name: "You · Dividend Machine", you: true, metric: "1.82" },
    { rank: 4, name: "@quant_kate", metric: "1.71" },
  ],
  drawdown: [
    { rank: 1, name: "@steady_sam", metric: "-3.1%" },
    { rank: 2, name: "You · Dividend Machine", you: true, metric: "-4.4%" },
    { rank: 3, name: "@bond_beth", metric: "-5.0%" },
    { rank: 4, name: "@dividend_dan", metric: "-6.2%" },
  ],
  risk: [
    { rank: 1, name: "@yolo_yuri", metric: "82 conviction" },
    { rank: 2, name: "You · BTC Max", you: true, metric: "78 conviction" },
    { rank: 3, name: "@marco_ai", metric: "71 conviction" },
    { rank: 4, name: "@alpha_amy", metric: "68 conviction" },
  ],
};

type Position = { ticker: string; name: string; qty: number; avg: number; last: number };
const INITIAL_POSITIONS: Position[] = [
  { ticker: "NVDA", name: "NVIDIA", qty: 4, avg: 720.5, last: 895.4 },
  { ticker: "MSFT", name: "Microsoft", qty: 6, avg: 402.1, last: 428.1 },
  { ticker: "VTI", name: "Vanguard Total Market", qty: 12, avg: 248.7, last: 262.3 },
];
const WATCHLIST = [
  { ticker: "AAPL", name: "Apple", last: 224.8, chg: 0.9 },
  { ticker: "GOOGL", name: "Alphabet", last: 178.5, chg: -0.4 },
  { ticker: "TSLA", name: "Tesla", last: 245.6, chg: -1.2 },
  { ticker: "AMD", name: "AMD", last: 162.7, chg: 3.2 },
];

const COACH_NOTES = [
  { good: true, text: "Adding NVDA on Mar 3 captured a +12% run — biggest single contributor this week." },
  { good: false, text: "Sitting 38% in cash cost ~$180 in missed upside vs. staying invested." },
  { good: true, text: "Your portfolio's Sharpe (1.82) beats the league median (1.41)." },
  { good: false, text: "Concentration risk: top 2 names are 65% of book. A 15% NVDA drop erases 2 weeks of gains." },
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

  // Trade desk state (virtual buy/sell)
  const [cash, setCash] = useState(3820.5);
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [tradeTicker, setTradeTicker] = useState("AAPL");
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [toast, setToast] = useState<string | null>(null);

  // League + leaderboard state
  const [activeLeagueId, setActiveLeagueId] = useState<string>(LEAGUES[0].id);
  const [category, setCategory] = useState<LeaderboardCategory>("return");
  const [showCreate, setShowCreate] = useState(false);

  const strat = STRATEGIES.find((s) => s.id === strategy)!;
  const years = PERIODS.find((p) => p.id === period)!.years;

  const projected = useMemo(() => projectValue(amount, monthly, strat.annual, years), [amount, monthly, strat, years]);
  const sp500 = useMemo(() => projectValue(amount, monthly, 0.09, years), [amount, monthly, years]);
  const series = useMemo(() => projectSeries(amount, monthly, strat.annual, years), [amount, monthly, strat, years]);
  const spSeries = useMemo(() => projectSeries(amount, monthly, 0.09, years), [amount, monthly, years]);

  const invested = amount + monthly * years * 12;
  const gain = projected - invested;
  const vsSp = projected - sp500;

  const activeLeague = LEAGUES.find((l) => l.id === activeLeagueId)!;
  const holdingsValue = positions.reduce((a, p) => a + p.qty * p.last, 0);
  const bookValue = cash + holdingsValue;
  const totalPnl = positions.reduce((a, p) => a + p.qty * (p.last - p.avg), 0);

  function applyPreset(p: { amount: number; strategy: Strategy; period: Period; monthly: number }) {
    setAmount(p.amount);
    setStrategy(p.strategy);
    setPeriod(p.period);
    setMonthly(p.monthly);
  }

  function lookupPrice(ticker: string) {
    const w = WATCHLIST.find((x) => x.ticker === ticker);
    if (w) return { name: w.name, price: w.last };
    const pos = positions.find((x) => x.ticker === ticker);
    if (pos) return { name: pos.name, price: pos.last };
    return { name: ticker, price: 100 };
  }

  function executeTrade() {
    const { name, price } = lookupPrice(tradeTicker.toUpperCase());
    const total = price * tradeQty;
    if (tradeSide === "buy") {
      if (cash < total) {
        setToast("Not enough virtual cash");
        return;
      }
      setCash((c) => c - total);
      setPositions((ps) => {
        const found = ps.find((p) => p.ticker === tradeTicker.toUpperCase());
        if (found) {
          const newQty = found.qty + tradeQty;
          const newAvg = (found.avg * found.qty + total) / newQty;
          return ps.map((p) =>
            p.ticker === found.ticker ? { ...p, qty: newQty, avg: Number(newAvg.toFixed(2)) } : p,
          );
        }
        return [...ps, { ticker: tradeTicker.toUpperCase(), name, qty: tradeQty, avg: price, last: price }];
      });
      setToast(`Bought ${tradeQty} ${tradeTicker.toUpperCase()} @ ${usd(price)}`);
    } else {
      const found = positions.find((p) => p.ticker === tradeTicker.toUpperCase());
      if (!found || found.qty < tradeQty) {
        setToast("Not enough shares to sell");
        return;
      }
      setCash((c) => c + total);
      setPositions((ps) =>
        ps
          .map((p) => (p.ticker === found.ticker ? { ...p, qty: p.qty - tradeQty } : p))
          .filter((p) => p.qty > 0),
      );
      setToast(`Sold ${tradeQty} ${tradeTicker.toUpperCase()} @ ${usd(price)}`);
    }
    setTimeout(() => setToast(null), 2500);
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

            {/* ---- Live Leagues ---- */}
            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">Live leagues</h2>
                  <p className="text-xs text-muted-foreground">
                    Everyone starts on the same day with the same virtual balance. May the best strategy win.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreate((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  <Plus className="size-3.5" /> Create league
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {LEAGUES.map((l) => {
                  const active = l.id === activeLeagueId;
                  const progress = l.status === "upcoming" ? 0 : ((l.totalDays - l.endsInDays) / l.totalDays) * 100;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setActiveLeagueId(l.id)}
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border/70 bg-background/50 hover:border-primary/30"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                          {l.kind === "private" ? (
                            <>
                              <Lock className="size-3 text-amber-500" /> Private
                            </>
                          ) : (
                            <>
                              <Globe className="size-3 text-primary" /> Public
                            </>
                          )}
                        </span>
                        {l.status === "live" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                            <span className="relative flex size-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                            </span>
                            LIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600">STARTS SOON</span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-foreground">{l.name}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Users className="size-3" /> {l.players.toLocaleString()}
                        <span>·</span>
                        <Wallet className="size-3" /> {usd(l.buyIn)}
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {l.status === "upcoming" ? `Starts ${l.starts}` : `${l.endsInDays}d left`}
                        </span>
                        {l.status === "live" && (
                          <span className="font-semibold text-foreground">
                            Rank #{l.rank} · <span className="text-primary">+{l.totalReturn}%</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showCreate && (
                <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-primary">
                    <UserPlus className="size-3.5" /> New private league
                  </div>
                  <div className="grid gap-2 md:grid-cols-4">
                    <input
                      placeholder="League name"
                      className="rounded-lg border border-border/70 bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                    <input
                      type="date"
                      className="rounded-lg border border-border/70 bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
                    />
                    <select className="rounded-lg border border-border/70 bg-background px-2 py-1.5 text-xs outline-none focus:border-primary">
                      <option>$10,000 buy-in</option>
                      <option>$25,000 buy-in</option>
                      <option>$100,000 buy-in</option>
                    </select>
                    <select className="rounded-lg border border-border/70 bg-background px-2 py-1.5 text-xs outline-none focus:border-primary">
                      <option>Stocks + ETFs</option>
                      <option>ETFs only</option>
                      <option>Long-only, no crypto</option>
                    </select>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-background px-2 py-1 text-[11px] text-muted-foreground">
                      <Link2 className="size-3" /> invite.copilotinvest.app/l/friday-{Math.floor(Math.random() * 900 + 100)}
                      <button className="ml-1 rounded p-0.5 text-muted-foreground hover:text-primary">
                        <Copy className="size-3" />
                      </button>
                    </div>
                    <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                      Create & copy link
                    </button>
                  </div>
                </div>
              )}

              {/* Categorized leaderboard for active league */}
              <div className="mt-4 rounded-xl border border-border/70 bg-background/50 p-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="text-xs font-bold text-foreground">
                    {activeLeague.name} · standings
                  </div>
                  <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                    <Share2 className="size-3" /> Share
                  </button>
                </div>
                <div className="mb-2 flex flex-wrap gap-1">
                  {CATEGORIES.map((c) => {
                    const active = c.id === category;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        title={c.hint}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="size-3" /> {c.label}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-1.5">
                  {CATEGORY_ROWS[category].map((r) => (
                    <div
                      key={r.rank}
                      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs ${
                        r.you ? "bg-primary/10 ring-1 ring-primary/30" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                            r.rank === 1
                              ? "bg-amber-400 text-amber-950"
                              : r.rank === 2
                                ? "bg-slate-300 text-slate-900"
                                : r.rank === 3
                                  ? "bg-orange-400 text-orange-950"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {r.rank === 1 ? <Crown className="size-3" /> : r.rank}
                        </span>
                        <span className={`font-medium ${r.you ? "text-primary" : "text-foreground"}`}>
                          {r.name}
                        </span>
                      </span>
                      <span className="font-bold text-foreground tabular-nums">{r.metric}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] italic text-muted-foreground">{CATEGORIES.find((c) => c.id === category)?.hint}</p>
              </div>
            </section>

            {/* ---- Trade Desk (virtual buy/sell) ---- */}
            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">Trade desk</h2>
                  <p className="text-xs text-muted-foreground">
                    Virtual buy & sell · fractional shares · long-only
                  </p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cash</div>
                    <div className="font-display text-sm font-bold text-foreground">{usd(cash)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Book</div>
                    <div className="font-display text-sm font-bold text-foreground">{usd(bookValue)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">P/L</div>
                    <div
                      className={`font-display text-sm font-bold ${
                        totalPnl >= 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {totalPnl >= 0 ? "+" : ""}
                      {usd(totalPnl)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket */}
              <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                <div className="flex flex-wrap items-end gap-2">
                  <div className="flex overflow-hidden rounded-lg border border-border/70">
                    <button
                      onClick={() => setTradeSide("buy")}
                      className={`px-3 py-1.5 text-xs font-bold ${
                        tradeSide === "buy" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeSide("sell")}
                      className={`px-3 py-1.5 text-xs font-bold ${
                        tradeSide === "sell" ? "bg-destructive text-white" : "text-muted-foreground"
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                      Ticker
                    </label>
                    <input
                      value={tradeTicker}
                      onChange={(e) => setTradeTicker(e.target.value.toUpperCase())}
                      className="w-full rounded-lg border border-border/70 bg-background px-2 py-1.5 text-sm font-bold uppercase outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                      Qty
                    </label>
                    <input
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={tradeQty}
                      onChange={(e) => setTradeQty(Number(e.target.value))}
                      className="w-full rounded-lg border border-border/70 bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-28">
                    <label className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                      Est. total
                    </label>
                    <div className="rounded-lg bg-muted px-2 py-1.5 text-sm font-semibold text-foreground">
                      {usd(lookupPrice(tradeTicker).price * tradeQty)}
                    </div>
                  </div>
                  <button
                    onClick={executeTrade}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold text-white ${
                      tradeSide === "buy" ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:opacity-90"
                    }`}
                  >
                    {tradeSide === "buy" ? "Place buy" : "Place sell"}
                  </button>
                </div>
                {toast && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                    <Check className="size-3" /> {toast}
                  </div>
                )}
              </div>

              {/* Positions + watchlist */}
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Holdings
                  </div>
                  <div className="space-y-1">
                    {positions.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border/70 p-3 text-center text-xs text-muted-foreground">
                        No positions yet. Buy something.
                      </div>
                    )}
                    {positions.map((p) => {
                      const pnl = (p.last - p.avg) * p.qty;
                      const pct = ((p.last - p.avg) / p.avg) * 100;
                      return (
                        <div
                          key={p.ticker}
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-2 py-1.5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                              {p.ticker}
                            </span>
                            <div>
                              <div className="text-[11px] font-semibold text-foreground">
                                {p.qty} @ {usd(p.avg)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">Last {usd(p.last)}</div>
                            </div>
                          </div>
                          <div
                            className={`text-right text-[11px] font-bold ${
                              pnl >= 0 ? "text-primary" : "text-destructive"
                            }`}
                          >
                            {pnl >= 0 ? "+" : ""}
                            {usd(pnl)}
                            <div className="text-[10px] font-semibold">
                              {pct >= 0 ? "+" : ""}
                              {pct.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Watchlist · one-tap trade
                  </div>
                  <div className="space-y-1">
                    {WATCHLIST.map((w) => (
                      <button
                        key={w.ticker}
                        onClick={() => {
                          setTradeTicker(w.ticker);
                          setTradeSide("buy");
                        }}
                        className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-2 py-1.5 text-xs transition hover:border-primary/40"
                      >
                        <span className="flex items-center gap-2">
                          <span className="grid size-7 place-items-center rounded-md bg-muted text-[10px] font-bold text-foreground">
                            {w.ticker}
                          </span>
                          <span className="text-[11px] text-foreground">{w.name}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-foreground">{usd(w.last)}</span>
                          <span
                            className={`text-[10px] font-bold ${
                              w.chg >= 0 ? "text-primary" : "text-destructive"
                            }`}
                          >
                            {w.chg >= 0 ? "+" : ""}
                            {w.chg.toFixed(1)}%
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ---- Public portfolio spotlight ---- */}
            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">Public portfolios · follow or copy</h2>
                  <p className="text-xs text-muted-foreground">
                    See full strategy, risk, history and league record before you copy.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    handle: "@quant_kate",
                    strat: "AI Growth · concentrated",
                    since: "Started Jan 12, 2024",
                    ret: 48.2,
                    vs: 24.1,
                    risk: "High",
                    followers: 3120,
                    wins: 4,
                    holdings: ["NVDA 35%", "MSFT 22%", "AMD 18%", "TSM 15%", "GOOGL 10%"],
                  },
                  {
                    handle: "@steady_sam",
                    strat: "Dividend + bond ballast",
                    since: "Started Aug 4, 2023",
                    ret: 14.6,
                    vs: -1.2,
                    risk: "Low",
                    followers: 1840,
                    wins: 2,
                    holdings: ["VTI 30%", "SCHD 25%", "BND 20%", "VXUS 15%", "JEPI 10%"],
                  },
                ].map((p) => (
                  <div key={p.handle} className="rounded-xl border border-border/70 bg-background/50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {p.handle[1].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{p.handle}</div>
                          <div className="text-[10px] text-muted-foreground">{p.since}</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                        <Award className="size-3" /> {p.wins}× champ
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{p.strat}</div>
                    <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2 text-center">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Return</div>
                        <div className="text-xs font-bold text-primary">+{p.ret}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">vs S&P</div>
                        <div className={`text-xs font-bold ${p.vs >= 0 ? "text-primary" : "text-destructive"}`}>
                          {p.vs >= 0 ? "+" : ""}
                          {p.vs}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Risk</div>
                        <div className="text-xs font-bold text-foreground">{p.risk}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.holdings.map((h) => (
                        <span
                          key={h}
                          className="rounded-md bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Users className="size-3" /> {p.followers.toLocaleString()} followers
                      </span>
                      <div className="flex gap-1">
                        <button className="rounded-md border border-border/70 px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-muted">
                          Follow
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90">
                          <Copy className="size-3" /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
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
