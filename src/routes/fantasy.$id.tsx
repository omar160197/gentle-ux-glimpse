import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FantasyTopBar } from "./fantasy";
import {
  ArrowLeft,
  Bot,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Shield,
  Sparkles,
  Wallet,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/fantasy/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Fantasy · ${params.id} — Sandbox portfolio` },
      { name: "description", content: "Detailed fantasy portfolio with holdings, projection, and copilot commentary." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params }) => {
    const p = PORTFOLIOS[params.id];
    if (!p) throw notFound();
    return p;
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <FantasyTopBar />
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Portfolio not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This fantasy portfolio doesn't exist yet.</p>
        <Link to="/fantasy" className="mt-6 inline-flex items-center gap-1.5 text-primary hover:underline">
          <ArrowLeft className="size-4" /> Back to Fantasy
        </Link>
      </div>
    </div>
  ),
  component: FantasyDetailPage,
});

type Holding = {
  ticker: string;
  name: string;
  weight: number;
  price: number;
  change24h: number;
};

type Portfolio = {
  id: string;
  name: string;
  tagline: string;
  value: number;
  cost: number;
  ytd: number;
  annual: number;
  risk: string;
  holdings: Holding[];
  copilot: string;
};

const PORTFOLIOS: Record<string, Portfolio> = {
  "ai-supercycle": {
    id: "ai-supercycle",
    name: "AI Supercycle",
    tagline: "Concentrated bet on AI compute leaders.",
    value: 13420,
    cost: 10000,
    ytd: 34.2,
    annual: 0.28,
    risk: "High",
    copilot:
      "This basket is 85% tech and heavily correlated. In a 2022-style tech drawdown you'd have lost ~32% in six months. Great in bull cycles, brutal in rate shocks.",
    holdings: [
      { ticker: "NVDA", name: "NVIDIA", weight: 40, price: 895.4, change24h: 2.1 },
      { ticker: "MSFT", name: "Microsoft", weight: 25, price: 428.1, change24h: 0.8 },
      { ticker: "GOOGL", name: "Alphabet", weight: 20, price: 178.5, change24h: -0.4 },
      { ticker: "AMD", name: "AMD", weight: 15, price: 162.7, change24h: 3.2 },
    ],
  },
  "clean-future": {
    id: "clean-future",
    name: "Clean Future",
    tagline: "Solar, EV, and grid infrastructure.",
    value: 9190,
    cost: 10000,
    ytd: -8.1,
    annual: 0.14,
    risk: "Med-High",
    copilot:
      "Clean-energy names are rate-sensitive — they've lagged since 2022. Long horizon plays are policy-dependent. Consider pairing with dividend cash flow.",
    holdings: [
      { ticker: "TSLA", name: "Tesla", weight: 35, price: 245.6, change24h: -1.2 },
      { ticker: "ENPH", name: "Enphase Energy", weight: 25, price: 112.4, change24h: 0.6 },
      { ticker: "NEE", name: "NextEra Energy", weight: 25, price: 74.3, change24h: 0.2 },
      { ticker: "ICLN", name: "iShares Global Clean Energy", weight: 15, price: 14.1, change24h: -0.3 },
    ],
  },
  "dividend-machine": {
    id: "dividend-machine",
    name: "Dividend Machine",
    tagline: "Cash-flow stalwarts, quarterly payouts.",
    value: 11140,
    cost: 10000,
    ytd: 11.4,
    annual: 0.09,
    risk: "Low",
    copilot:
      "Steady, boring, and it works. Dividend yield ≈ 3.4%. Reinvest payouts to compound. Underperforms in raging bull markets but shines when things wobble.",
    holdings: [
      { ticker: "JNJ", name: "Johnson & Johnson", weight: 30, price: 158.2, change24h: 0.3 },
      { ticker: "KO", name: "Coca-Cola", weight: 25, price: 62.8, change24h: 0.1 },
      { ticker: "PG", name: "Procter & Gamble", weight: 25, price: 169.5, change24h: 0.5 },
      { ticker: "VZ", name: "Verizon", weight: 20, price: 41.7, change24h: -0.2 },
    ],
  },
  "btc-max": {
    id: "btc-max",
    name: "The BTC Max",
    tagline: "Crypto-heavy, high conviction.",
    value: 16280,
    cost: 10000,
    ytd: 62.8,
    annual: 0.35,
    risk: "Extreme",
    copilot:
      "This isn't investing, this is a bet. In prior cycles this exact allocation dropped 78% peak-to-trough. Only run this if you can stomach that and hold years.",
    holdings: [
      { ticker: "BTC", name: "Bitcoin", weight: 70, price: 96420, change24h: 1.9 },
      { ticker: "ETH", name: "Ethereum", weight: 20, price: 3480, change24h: 2.4 },
      { ticker: "SOL", name: "Solana", weight: 10, price: 214, change24h: 4.1 },
    ],
  },
};

function usd(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

function generateSeries(cost: number, value: number, points = 60) {
  const arr: number[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const noise = Math.sin(i * 0.7) * (value - cost) * 0.08;
    arr.push(cost + (value - cost) * t + noise);
  }
  return arr;
}

function sparklinePath(vals: number[], w: number, h: number, pad = 6) {
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

function FantasyDetailPage() {
  const p = Route.useLoaderData();
  const [weights, setWeights] = useState<number[]>(p.holdings.map((h: Holding) => h.weight));

  const total = weights.reduce((a, b) => a + b, 0);
  const series = useMemo(() => generateSeries(p.cost, p.value), [p]);
  const gain = p.value - p.cost;
  const positive = gain >= 0;

  function bump(i: number, delta: number) {
    setWeights((w) => w.map((x, idx) => (idx === i ? Math.max(0, Math.min(100, x + delta)) : x)));
  }

  return (
    <div className="min-h-screen bg-background">
      <FantasyTopBar />
      <main className="mx-auto max-w-6xl px-4 py-5 md:px-10">
        <Link
          to="/fantasy"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-3.5" /> Back to Fantasy
        </Link>

        {/* Header */}
        <div className="mt-3 flex flex-col items-start justify-between gap-4 border-b border-border/70 pb-5 md:flex-row md:items-end">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" /> Fantasy portfolio
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{p.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-2 shadow-soft">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Value</div>
              <div className="font-display text-xl font-bold text-foreground">{usd(p.value)}</div>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-2 shadow-soft">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gain</div>
              <div
                className={`inline-flex items-center gap-1 font-display text-xl font-bold ${
                  positive ? "text-primary" : "text-destructive"
                }`}
              >
                {positive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                {positive ? "+" : ""}
                {usd(gain)}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/80 px-4 py-2 shadow-soft">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Risk</div>
              <div className="font-display text-xl font-bold text-foreground">{p.risk}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Chart + copilot */}
          <div className="space-y-5 lg:col-span-2">
            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Performance (YTD)
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">
                    {p.ytd >= 0 ? "+" : ""}
                    {p.ytd.toFixed(1)}%
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Activity className="size-3.5" /> Simulated
                </span>
              </div>
              <svg viewBox="0 0 600 180" className="mt-3 h-40 w-full">
                <defs>
                  <linearGradient id="detail-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const path = sparklinePath(series, 600, 180, 8);
                  return (
                    <>
                      <path d={`${path} L592,172 L8,172 Z`} fill="url(#detail-fill)" />
                      <path d={path} stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </>
                  );
                })()}
              </svg>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-foreground">Holdings & weights</h2>
                <span className={`text-[11px] font-semibold ${total === 100 ? "text-primary" : "text-amber-600"}`}>
                  Total: {total}%
                </span>
              </div>
              <div className="space-y-2">
                {p.holdings.map((h: Holding, i: number) => (
                  <div
                    key={h.ticker}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {h.ticker}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{h.name}</span>
                        <span className="text-xs text-muted-foreground">${h.price.toLocaleString()}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${weights[i]}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => bump(i, -5)}
                        className="grid size-7 place-items-center rounded-md border border-border/70 text-muted-foreground hover:border-primary/40 hover:text-primary"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-foreground">{weights[i]}%</span>
                      <button
                        onClick={() => bump(i, 5)}
                        className="grid size-7 place-items-center rounded-md border border-border/70 text-muted-foreground hover:border-primary/40 hover:text-primary"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span
                      className={`w-14 text-right text-xs font-semibold ${
                        h.change24h >= 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {h.change24h >= 0 ? "+" : ""}
                      {h.change24h.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Save changes
                </button>
                <button className="rounded-xl border border-border/70 px-4 text-sm font-semibold text-foreground hover:bg-muted">
                  Reset
                </button>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-4">
            <section className="rounded-2xl bg-slate-900 p-5 text-white shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <Bot className="size-4 text-emerald-400" />
                <h3 className="font-display text-base font-bold">Copilot take</h3>
              </div>
              <p className="text-sm leading-relaxed text-emerald-100/90">{p.copilot}</p>
              <div className="mt-4 space-y-2 border-t border-emerald-800/40 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-300/80">Est. annual return</span>
                  <span className="font-bold text-emerald-400">{(p.annual * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300/80">Cost basis</span>
                  <span className="font-bold">{usd(p.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300/80">Diversification</span>
                  <span className="font-bold">{p.holdings.length} names</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-soft">
              <div className="mb-1 flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Safety net</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                This is virtual. No real trades happen. Move to a real portfolio only when you're ready.
              </p>
              <button className="mt-3 w-full rounded-xl border border-primary/40 bg-white/50 py-2 text-xs font-semibold text-primary hover:bg-primary/10">
                Promote to real portfolio
              </button>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Virtual balance</h3>
              </div>
              <div className="font-display text-2xl font-bold text-foreground">$10,000.00</div>
              <div className="text-[11px] text-muted-foreground">Reset anytime — this is just a sandbox.</div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
