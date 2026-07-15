import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FantasyTopBar } from "./fantasy";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Flame,
  Gauge,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "Market Heatmap — Live sectors, movers & sentiment" },
      {
        name: "description",
        content:
          "Auto-refreshing market heatmap: indices, sector performance, top gainers & losers, most active tickers, and sentiment gauge.",
      },
      { property: "og:title", content: "Market Heatmap" },
      { property: "og:description", content: "Live sectors, movers, sentiment — at a glance." },
    ],
  }),
  component: HeatmapPage,
});

/* ---------- mock data ---------- */

const INDICES = [
  { name: "S&P 500", sym: "SPY", price: 752, chg: 0.36 },
  { name: "Nasdaq 100", sym: "QQQ", price: 720, chg: 1.12 },
  { name: "Dow Jones", sym: "DIA", price: 525, chg: 0.04 },
  { name: "Russell 2000", sym: "IWM", price: 295, chg: 0.35 },
  { name: "VIX", sym: "^VIX", price: 16.38, chg: -0.73 },
];

type Sector = { name: string; chg: number; size: number };
const SECTORS: Sector[] = [
  { name: "Technology", chg: 1.29, size: 6 },
  { name: "Financials", chg: 0.20, size: 4 },
  { name: "Communications", chg: -0.13, size: 4 },
  { name: "Consumer Staples", chg: -1.38, size: 3 },
  { name: "Utilities", chg: -0.07, size: 2 },
  { name: "Real Estate", chg: -0.49, size: 2 },
  { name: "Healthcare", chg: -1.93, size: 4 },
  { name: "Consumer Disc.", chg: -0.12, size: 3 },
  { name: "Industrials", chg: 0.04, size: 4 },
  { name: "Energy", chg: 0.37, size: 3 },
  { name: "Materials", chg: 0.12, size: 2 },
];

const GAINERS = [
  { sym: "SKHY", name: "SK Hynix Inc. American Depositary Shares", price: 194, chg: 27.29 },
  { sym: "CHRN", name: "ChronoScale Holdings Corporatio", price: 23.01, chg: 16.68 },
  { sym: "AXTI", name: "AXT Inc", price: 57.57, chg: 14.09 },
  { sym: "ATAI", name: "AtaiBeckley Inc.", price: 5.67, chg: 14.08 },
  { sym: "SEZL", name: "Sezzle Inc.", price: 182, chg: 13.82 },
  { sym: "TGB", name: "Trekor Metals Limited", price: 7.97, chg: 13.53 },
  { sym: "CRWD", name: "CrowdStrike Holdings, Inc.", price: 211, chg: 12.14 },
  { sym: "AAOI", name: "Applied Optoelectronics, Inc.", price: 125, chg: 12.13 },
];

const LOSERS = [
  { sym: "IBM", name: "International Business Machines", price: 217, chg: -25.21 },
  { sym: "PSNY", name: "Polestar Automotive Holding UK", price: 15.31, chg: -14.99 },
  { sym: "DNLI", name: "Denali Therapeutics Inc.", price: 22.65, chg: -14.46 },
  { sym: "ERIC", name: "Ericsson", price: 10.14, chg: -13.48 },
  { sym: "BIIB", name: "Biogen Inc.", price: 192, chg: -8.17 },
  { sym: "VIRT", name: "Virtu Financial, Inc.", price: 59.57, chg: -7.89 },
  { sym: "NBIS", name: "Nebius Group N.V.", price: 194, chg: -7.80 },
  { sym: "TDC", name: "Teradata Corporation", price: 31.42, chg: -7.48 },
];

const MOVERS = [
  { sym: "HUNTF", name: "HUNTER MARITIME ACQUISITION COR", vol: 0, price: 0.01, chg: 4900 },
  { sym: "CCCFF", name: "CARLYLE COMMODITIES CORP.", vol: 18849, price: 0.10, chg: 1900 },
  { sym: "LEAI", name: "Legacy Education Alliance, Inc.", vol: 28, price: 0.001, chg: 900 },
  { sym: "NMTRQ", name: "9 Meters Biopharma, Inc.", vol: 24, price: 0.002, chg: 900 },
  { sym: "GWSO", name: "Global Warming Solutions, Inc.", vol: 2785, price: 0.06, chg: 866.67 },
];

/* ---------- helpers ---------- */

function pct(n: number) {
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}
function usd(n: number) {
  return `$${n < 1 ? n.toFixed(2) : n.toLocaleString()}`;
}
function heatBg(chg: number) {
  const a = Math.min(1, Math.abs(chg) / 2 + 0.35);
  return chg >= 0
    ? { background: `color-mix(in oklab, hsl(var(--primary)) ${a * 90}%, white)` }
    : { background: `color-mix(in oklab, hsl(var(--destructive)) ${a * 90}%, white)` };
}
function sparkPath(vals: number[], w = 80, h = 26) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const r = max - min || 1;
  const step = w / (vals.length - 1);
  return vals
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - ((v - min) / r) * h).toFixed(1)}`)
    .join(" ");
}
function genSpark(seed: number, up: boolean) {
  const arr: number[] = [];
  let v = 50;
  for (let i = 0; i < 20; i++) {
    v += Math.sin(seed + i * 0.6) * 3 + (up ? 0.8 : -0.8) + (i > 12 && up ? 2 : 0);
    arr.push(v);
  }
  return arr;
}

/* ---------- page ---------- */

type MoverTab = "gainers" | "losers" | "active";

function HeatmapPage() {
  const [tab, setTab] = useState<MoverTab>("gainers");
  const [q, setQ] = useState("");

  const now = useMemo(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
  }, []);

  const filteredG = GAINERS.filter((x) => x.sym.toLowerCase().includes(q.toLowerCase()));
  const filteredL = LOSERS.filter((x) => x.sym.toLowerCase().includes(q.toLowerCase()));

  const sentiment = 77;
  const advancing = 10;
  const unchanged = 1;
  const declining = 3;

  return (
    <div className="min-h-screen bg-background">
      <FantasyTopBar />

      <main className="mx-auto max-w-7xl px-4 py-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-border/70 pb-4 md:flex-row md:items-end">
          <div className="min-w-0">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Flame className="size-3" /> Live market
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Market Heatmap
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Auto-refreshes every 60s · Updated {now}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter ticker…"
                className="h-8 w-44 rounded-xl border border-border/70 bg-card/80 pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border/70 bg-card/80 px-3 text-xs font-semibold text-foreground shadow-soft hover:border-primary/40 hover:text-primary">
              <RefreshCw className="size-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Indices strip */}
        <section className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
          {INDICES.map((i) => {
            const up = i.chg >= 0;
            return (
              <div
                key={i.sym}
                className="rounded-2xl border border-border/70 bg-card/80 p-3 shadow-soft transition hover:border-primary/40"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {i.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{i.sym}</div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                      up ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {pct(i.chg)}
                  </span>
                </div>
                <div className="mt-1 font-display text-lg font-bold text-foreground">
                  ${i.price.toLocaleString()}
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Left: sectors + movers */}
          <div className="space-y-5 lg:col-span-2">
            {/* Sectors heatmap */}
            <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-foreground">Sectors</h2>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Activity className="size-3.5" /> % change today
                </span>
              </div>
              <div
                className="grid gap-1.5"
                style={{
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gridAutoRows: "72px",
                }}
              >
                {SECTORS.map((s) => (
                  <div
                    key={s.name}
                    style={{ gridColumn: `span ${s.size}`, ...heatBg(s.chg) }}
                    className="flex flex-col items-center justify-center rounded-xl p-2 text-center text-white shadow-soft transition hover:brightness-105"
                  >
                    <div className="text-[11px] font-bold leading-tight md:text-xs">{s.name}</div>
                    <div className="text-[11px] font-semibold opacity-90">{pct(s.chg)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gainers + Losers */}
            <div className="grid gap-4 md:grid-cols-2">
              <MoverList title="Top Gainers" items={filteredG} positive />
              <MoverList title="Top Losers" items={filteredL} positive={false} />
            </div>

            {/* Market movers */}
            <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-base font-bold text-foreground">Market movers</h2>
                <div className="flex items-center gap-1 rounded-xl border border-border/70 bg-background/60 p-0.5">
                  {(
                    [
                      ["gainers", "Top Gainers"],
                      ["losers", "Top Losers"],
                      ["active", "Most Active"],
                    ] as [MoverTab, string][]
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                        tab === id
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-border/60">
                {MOVERS.map((m, i) => {
                  const up = m.chg >= 0;
                  const vals = genSpark(i * 1.7, up);
                  return (
                    <div key={m.sym} className="flex items-center gap-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-foreground">{m.sym}</div>
                        <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                          {m.name}
                        </div>
                      </div>
                      <svg viewBox="0 0 80 26" className="hidden h-6 w-20 sm:block">
                        <path
                          d={sparkPath(vals)}
                          stroke={up ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="w-16 text-right">
                        <div className="text-[10px] uppercase text-muted-foreground">Vol</div>
                        <div className="text-xs font-semibold text-foreground">
                          {m.vol.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <div className="text-sm font-bold text-foreground">{usd(m.price)}</div>
                        <div
                          className={`text-[11px] font-semibold ${
                            up ? "text-primary" : "text-destructive"
                          }`}
                        >
                          ↗ {pct(m.chg)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: sentiment + insights */}
          <aside className="space-y-4">
            <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5">
                  <Gauge className="size-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Market sentiment</h3>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Greed
                </span>
              </div>

              <SentimentGauge value={sentiment} />

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-primary/10 py-2">
                  <div className="text-[10px] font-semibold uppercase text-primary">↑ Advancing</div>
                  <div className="font-display text-lg font-bold text-primary">{advancing}</div>
                </div>
                <div className="rounded-xl bg-muted py-2">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground">− Unchanged</div>
                  <div className="font-display text-lg font-bold text-foreground">{unchanged}</div>
                </div>
                <div className="rounded-xl bg-destructive/10 py-2">
                  <div className="text-[10px] font-semibold uppercase text-destructive">↓ Declining</div>
                  <div className="font-display text-lg font-bold text-destructive">{declining}</div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-slate-900 p-5 text-white shadow-xl">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-400" />
                <h3 className="font-display text-sm font-bold">Copilot read</h3>
              </div>
              <p className="text-xs leading-relaxed text-emerald-100/90">
                Tech is leading (+1.29%) while defensives lag — classic risk-on tape. Watch{" "}
                <span className="font-semibold text-emerald-300">IBM (-25%)</span> for earnings
                fallout; SK Hynix strength suggests continued AI-memory demand.
              </p>
              <div className="mt-3 space-y-1.5 border-t border-emerald-800/40 pt-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-emerald-300/80">Breadth</span>
                  <span className="font-bold text-emerald-400">Bullish</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300/80">Volatility (VIX)</span>
                  <span className="font-bold">Low · 16.38</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300/80">Regime</span>
                  <span className="font-bold">Risk-on</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-soft">
              <h3 className="text-sm font-bold text-foreground">Save this view</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Get a daily heatmap digest with sector rotation & sentiment shifts.
              </p>
              <button className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                Enable daily digest
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- sub components ---------- */

function MoverList({
  title,
  items,
  positive,
}: {
  title: string;
  items: { sym: string; name: string; price: number; chg: number }[];
  positive: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
        {positive ? (
          <TrendingUp className="size-4 text-primary" />
        ) : (
          <TrendingDown className="size-4 text-destructive" />
        )}
      </div>
      <div className="divide-y divide-border/60">
        {items.map((it) => (
          <div key={it.sym} className="flex items-center gap-2 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-foreground">{it.sym}</div>
              <div className="truncate text-[11px] text-muted-foreground">{it.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">{usd(it.price)}</div>
              <div
                className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  positive
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {pct(it.chg)}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-6 text-center text-xs text-muted-foreground">No matches.</div>
        )}
      </div>
    </section>
  );
}

function SentimentGauge({ value }: { value: number }) {
  // half-circle gauge 0-100
  const cx = 100;
  const cy = 100;
  const r = 78;
  const angle = Math.PI - (value / 100) * Math.PI;
  const nx = cx + Math.cos(angle) * r;
  const ny = cy - Math.sin(angle) * r;

  return (
    <div className="relative">
      <svg viewBox="0 0 200 120" className="w-full">
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="url(#gauge-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="hsl(var(--foreground))" />
      </svg>
      <div className="absolute inset-x-0 top-6 text-center">
        <div className="font-display text-3xl font-bold text-foreground">{value}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Fear · Greed
        </div>
      </div>
    </div>
  );
}
