import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Bot, LineChart, ScanSearch, Shield } from "lucide-react";
import { tradingFaqs, tradingFeatures, tradingPairs, tradingTools } from "@/lib/data";
import { FaqList } from "@/components/FaqList";

export const metadata: Metadata = {
  title: "Trade Cryptocurrencies | RICOX",
};

export default function TradePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Advanced Trading Platform</h1>
          <p className="mt-6 text-lg text-muted">
            Trade cryptocurrencies with professional-grade tools, real-time market data, and advanced analytics.
            Join thousands of traders who trust RICOX for their trading needs.
          </p>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white">Advanced Trading Platform</h2>
            <p className="mt-4 text-muted">
              Our state-of-the-art trading platform provides all the tools you need to trade cryptocurrencies
              efficiently and securely.
            </p>
            <ul className="mt-6 space-y-3 text-muted">
              <li>Real-time market data and price charts</li>
              <li>Advanced order types and trading tools</li>
              <li>Low trading fees and high liquidity</li>
              <li>Secure and fast trade execution</li>
            </ul>
            <div className="mt-6 inline-flex rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent-2">
              Up to 50% Lower Fees
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-line">
            <img src="/images/trading-laptop.jpeg" alt="Crypto Trading Platform" className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-3xl font-bold text-white">Trading Features</h2>
          <p className="mt-3 text-center text-muted">Powerful tools and features to enhance your trading experience</p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tradingFeatures.map((feature) => (
              <div key={feature.title} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-3xl font-bold text-white">Available Trading Pairs</h2>
          <p className="mt-3 text-center text-muted">
            Trade a wide range of cryptocurrencies with competitive spreads and deep liquidity
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            {tradingPairs.map((pair) => {
              const up = pair.change.startsWith("+");
              return (
                <div
                  key={pair.pair}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface/80 px-5 py-4 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {pair.pair} {pair.trending ? <span className="text-xs text-accent-2">Trending</span> : null}
                    </p>
                    <p className="text-sm text-muted">{pair.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{pair.price}</p>
                    <p className={`text-sm ${up ? "text-green" : "text-red"}`}>
                      {pair.change} Vol: {pair.volume}
                    </p>
                  </div>
                  <Link
                    href="/auth/register"
                    className="rounded-full border border-line px-4 py-1.5 text-sm text-white hover:bg-surface-2"
                  >
                    Trade
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-3xl font-bold text-white">Trading Tools</h2>
          <p className="mt-3 text-center text-muted">
            Enhance your trading with our suite of professional tools designed to help you make informed decisions
            and execute your strategies efficiently.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tradingTools.map((tool, i) => {
              const Icon = [Bell, Bot, ScanSearch, Shield][i] ?? LineChart;
              return (
                <div key={tool.title} className="glass rounded-2xl p-6">
                  <Icon className="mb-4 h-6 w-6 text-accent-2" />
                  <h3 className="font-semibold text-white">{tool.title}</h3>
                  <p className="mt-2 text-sm text-muted">{tool.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white">Trading FAQs</h2>
          <p className="mt-3 text-center text-muted">Find answers to common questions about trading on RICOX</p>
          <div className="mt-8">
            <FaqList items={tradingFaqs} />
          </div>
        </section>
      </div>
    </div>
  );
}
