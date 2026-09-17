"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, TrendingUp } from "lucide-react";
import { money, timeAgo } from "@/lib/format";
import { useAuth } from "@/components/AuthProvider";

type Investment = {
  id: string;
  dealName: string;
  amount: number;
  status: string;
  createdAt: string;
  roi: string;
  duration: string;
  category: string;
  earned: number;
  dailyYield: number;
  days: number;
};

type Tx = { id: string; type: string; amount: number; status: string; method?: string; createdAt: string };

type Coin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
};

type DashboardData = {
  user: { name: string; balance: number; referralCode: string; profileImage?: string };
  invested: number;
  returns: number;
  investments: Investment[];
  recent: Tx[];
  sparkline: number[];
};

function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const d = useMemo(() => {
    if (!points.length) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    return points
      .map((p, i) => {
        const x = (i / Math.max(points.length - 1, 1)) * 220;
        const y = 64 - ((p - min) / span) * 52;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [points]);

  return (
    <svg viewBox="0 0 220 72" className={className} aria-hidden>
      <path d={d} fill="none" stroke="#34d399" strokeWidth="2.2" />
    </svg>
  );
}

function rankLabel(invested: number, balance: number) {
  const value = invested + balance;
  if (value >= 10000) return "Platinum Rank";
  if (value >= 2500) return "Gold Rank";
  return "Member";
}

export default function DashboardPage() {
  const { user: sessionUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (sessionUser?.role === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [sessionUser, authLoading, router]);

  useEffect(() => {
    if (sessionUser?.role === "admin") return;
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
    fetch("/api/prices")
      .then((r) => r.json())
      .then((d) => setCoins((d.coins || []).slice(0, 3)));
  }, [sessionUser]);

  if (authLoading || sessionUser?.role === "admin") {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!data?.user) {
    return (
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="dash-panel h-40 animate-pulse rounded-2xl lg:col-span-8" />
        <div className="dash-panel h-40 animate-pulse rounded-2xl lg:col-span-4" />
      </div>
    );
  }

  const firstName = data.user.name.split(" ")[0];
  const referralUrl =
    typeof window === "undefined"
      ? `/auth/register?ref=${data.user.referralCode}`
      : `${window.location.origin}/auth/register?ref=${data.user.referralCode}`;

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const activity = data.recent.filter((t) => t.type === "deposit" || t.type === "return" || t.type === "investment");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {activity.length ? (
          activity.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              <span className="capitalize text-white">{item.type}</span>
              <span>{money(item.amount)}</span>
              <span>{timeAgo(item.createdAt)}</span>
            </div>
          ))
        ) : (
          <div className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted">No recent activity yet</div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="dash-panel rounded-2xl p-4 sm:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{firstName}</h2>
                  <span className="mt-1 inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent-2">
                    {rankLabel(data.invested, data.user.balance)}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-muted">Your referral link</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="truncate text-xs text-white">{data.user.referralCode}</code>
                <button
                  type="button"
                  onClick={copyReferral}
                  className="btn-glow inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold text-white"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>

            <div className="dash-stake-a rounded-2xl p-4">
              <p className="text-xs text-muted">Returns</p>
              <p className="mt-2 text-2xl font-semibold text-green">{money(data.returns)}</p>
              <p className="mt-1 text-[11px] text-muted">Yield credited</p>
            </div>

            <Link href="/dashboard/portfolio" className="dash-panel group relative overflow-hidden rounded-2xl p-4">
              <p className="text-xs text-muted">Portfolio</p>
              <p className="mt-2 text-lg font-semibold text-white">Overview and insights</p>
              <p className="mt-1 text-sm text-accent-2">{money(data.invested)} allocated</p>
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-accent/20 blur-2xl transition group-hover:bg-accent/30" />
            </Link>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-white">Active investments</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {data.investments.length ? (
                data.investments.map((item, index) => (
                  <div key={item.id} className={`${index % 2 ? "dash-stake-b" : "dash-stake-a"} rounded-2xl p-5`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{item.dealName}</p>
                        <p className="mt-0.5 text-xs text-muted">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-white">{item.roi} ROI</p>
                        <p className="mt-0.5 text-[11px] capitalize text-green">{item.status}</p>
                      </div>
                    </div>
                    <dl className="mt-5 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted">Period</dt>
                        <dd className="text-white">
                          {item.duration} ({item.days} days)
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Invested</dt>
                        <dd className="text-white">{money(item.amount)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Daily yield</dt>
                        <dd className="text-white">{money(item.dailyYield)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted">Earned</dt>
                        <dd className="text-lg font-semibold text-green">+{money(item.earned)}</dd>
                      </div>
                    </dl>
                    <Link
                      href="/dashboard/portfolio"
                      className="mt-5 block text-center text-sm text-muted hover:text-accent-2"
                    >
                      See details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="dash-panel rounded-2xl p-5 md:col-span-2">
                  <p className="text-sm text-muted">No active investments yet.</p>
                  <Link href="/dashboard/investments/new" className="mt-3 inline-block text-sm text-accent-2">
                    Start investing
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="dash-panel rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Transactions</h3>
              <Link href="/dashboard/transactions" className="text-xs text-muted hover:text-accent-2">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs text-muted">
                  <tr>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((tx) => (
                    <tr key={tx.id} className="border-t border-line">
                      <td className="py-3 text-muted">{timeAgo(tx.createdAt)}</td>
                      <td className="py-3 capitalize text-white">{tx.type}</td>
                      <td className="py-3 text-white">{money(tx.amount)}</td>
                      <td className="py-3 text-muted">{tx.method || "—"}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] capitalize ${
                            tx.status === "completed" || tx.status === "verified"
                              ? "bg-green/15 text-green"
                              : tx.status === "failed"
                                ? "bg-red/15 text-red"
                                : "bg-accent/15 text-accent-2"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.recent.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-sm text-muted">
                        No transactions yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Link
            href="/dashboard/deposit"
            className="btn-glow flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold text-white"
          >
            Deposit BTC
          </Link>
          <div className="dash-panel rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted">Your total balance</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white">{money(data.user.balance)}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-green">
                <TrendingUp className="h-3.5 w-3.5" />
                {data.invested > 0 ? money(data.invested) : "—"} invested
              </span>
            </div>
            <Sparkline points={data.sparkline} className="mt-4 h-16 w-full" />
          </div>

          <div className="dash-panel rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Markets</h3>
              <Link href="/trade" className="text-xs text-muted hover:text-accent-2">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {coins.map((coin) => {
                const up = coin.price_change_percentage_24h >= 0;
                return (
                  <div key={coin.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold uppercase text-accent-2">
                        {coin.symbol.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-sm text-white">{coin.name}</p>
                        <p className="text-[11px] uppercase text-muted">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">{money(coin.current_price)}</p>
                      <p className={`text-[11px] ${up ? "text-green" : "text-red"}`}>
                        {up ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dash-panel rounded-2xl p-5">
            <p className="text-sm font-medium text-white">Invest in vetted projects</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Put your balance to work on Quantum Chain, BlockVault, and other RICOX listings.
            </p>
            <Link
              href="/dashboard/investments/new"
              className="btn-glow mt-4 inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-white"
            >
              Invest now
            </Link>
          </div>

          <div className="dash-panel rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Analytics</h3>
              <Link href="/dashboard/transactions" className="text-xs text-muted hover:text-accent-2">
                View all
              </Link>
            </div>
            <p className="text-xs text-muted">Total income</p>
            <p className="mt-1 text-2xl font-semibold text-white">{money(data.returns)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
