"use client";

import { Minimize2, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
};

function Sparkline({ prices, up }: { prices: number[]; up: boolean }) {
  const d = useMemo(() => {
    if (!prices.length) return "";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;
    return prices
      .map((p, i) => {
        const x = (i / (prices.length - 1)) * 120;
        const y = 36 - ((p - min) / span) * 32;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [prices]);

  return (
    <svg viewBox="0 0 120 40" className="h-10 w-28" aria-hidden>
      <path d={d} fill="none" stroke={up ? "#34d399" : "#f87171"} strokeWidth="2" />
    </svg>
  );
}

export function CryptoPrices() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/prices")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { coins: Coin[] }) => {
        if (!cancelled) setCoins(data.coins || []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex flex-col space-y-1.5 p-6 pb-3 sm:pb-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center text-lg font-semibold tracking-tight text-white sm:text-xl">
            <TrendingUp className="mr-2 h-4 w-4 text-green sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Live Cryptocurrency Prices</span>
            <span className="sm:hidden">Crypto Prices</span>
          </div>
          <button
            className="h-8 self-start rounded-md px-2 text-muted hover:text-white sm:self-center sm:px-3"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="mr-1 text-xs sm:mr-2 sm:text-sm">{open ? "Minimize" : "Expand"}</span>
            <Minimize2 className="inline h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
      {open ? (
        <div className="space-y-4 px-3 pb-6 pt-0 sm:space-y-6 sm:px-6">
          {coins.length === 0 && !error ? (
            <div className="space-y-4">
              <div className="h-8 w-full animate-pulse rounded-md bg-surface-2" />
              <div className="h-48 w-full animate-pulse rounded-md bg-surface-2 sm:h-64" />
            </div>
          ) : error ? (
            <p className="text-sm text-muted">Live prices are temporarily unavailable. Please try again shortly.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-line">
              {coins.map((coin) => {
                const up = coin.price_change_percentage_24h >= 0;
                return (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-white">{coin.name}</p>
                      <p className="text-xs uppercase text-muted">{coin.symbol}</p>
                    </div>
                    <Sparkline prices={coin.sparkline_in_7d?.price?.slice(-40) ?? []} up={up} />
                    <div className="text-right">
                      <p className="font-medium text-white">
                        ${coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs ${up ? "text-green" : "text-red"}`}>
                        {up ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
