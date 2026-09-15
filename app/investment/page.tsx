import type { Metadata } from "next";
import Link from "next/link";
import { Coins, Gamepad2, ImageIcon, Layers, Server, Zap } from "lucide-react";
import { categories, deals, howItWorks, investmentFaqs } from "@/lib/data";
import { FaqList } from "@/components/FaqList";

export const metadata: Metadata = {
  title: "Investment Opportunities | RICOX",
};

const icons = {
  coins: Coins,
  image: ImageIcon,
  layers: Layers,
  zap: Zap,
  gamepad: Gamepad2,
  server: Server,
};

export default function InvestmentPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Smart Investment Opportunities</h1>
          <p className="mt-6 text-lg text-muted">
            Discover vetted cryptocurrency projects with high growth potential. Our expert team curates the best
            investment opportunities in the blockchain space for maximum returns.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-center text-3xl font-bold text-white">Investment Categories</h2>
          <p className="mt-3 text-center text-muted">
            Explore different categories of cryptocurrency projects available for investment
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = icons[cat.icon as keyof typeof icons];
              return (
                <div key={cat.name} className="glass rounded-2xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{cat.name}</h3>
                  <p className="mt-2 text-sm text-muted">{cat.description}</p>
                  <p className="mt-4 text-sm font-medium text-accent-2">{cat.count} projects</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-3xl font-bold text-white">Featured Projects</h2>
          <p className="mt-3 text-center text-muted">
            Explore our carefully selected investment opportunities with high growth potential
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {deals.slice(0, 3).map((deal) => (
              <div key={deal.id} className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${deal.accent} font-bold text-white`}
                  >
                    {deal.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{deal.name}</h3>
                    <span className="text-xs text-accent-2">{deal.category}</span>
                  </div>
                </div>
                <p className="text-sm text-muted">{deal.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted">Target Raise</p>
                    <p className="font-medium text-white">{deal.target}</p>
                  </div>
                  <div>
                    <p className="text-muted">Raised</p>
                    <p className="font-medium text-white">{deal.raised}</p>
                  </div>
                  <div>
                    <p className="text-muted">Expected ROI</p>
                    <p className="font-medium text-white">{deal.roi}</p>
                  </div>
                  <div>
                    <p className="text-muted">Duration</p>
                    <p className="font-medium text-white">{deal.duration}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-surface-2">
                  <div className="h-2 rounded-full bg-accent" style={{ width: `${deal.progress}%` }} />
                </div>
                <p className="mt-2 text-right text-xs text-muted">Progress {deal.progress}%</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-3 text-center text-muted">Follow these simple steps to start investing in cryptocurrency projects</p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="glass rounded-2xl p-6">
                <div className="text-sm font-semibold text-accent-2">{item.step}</div>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/auth/register" className="btn-glow inline-flex h-11 items-center rounded-full px-6 font-medium text-white">
              Get Started
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="mt-3 text-center text-muted">Find answers to common questions about investing with RICOX</p>
          <div className="mt-8">
            <FaqList items={investmentFaqs} />
          </div>
        </section>
      </div>
    </div>
  );
}
