import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CryptoPrices } from "@/components/CryptoPrices";
import { HeroVisuals } from "@/components/HeroVisuals";
import { NewsletterForm } from "@/components/NewsletterForm";
import { StatsSection } from "@/components/StatsSection";
import { deals, investors, partners, testimonials } from "@/lib/data";

const platformCards = [
  {
    title: "Vetted project listings",
    body: "Every opportunity is reviewed for technology, team, market fit, and growth potential before it appears on RICOX.",
  },
  {
    title: "Bank and crypto funding",
    body: "Deposit with traditional payment methods or digital assets, then allocate from your balance into listed projects.",
  },
  {
    title: "Unified portfolio tracking",
    body: "Monitor investments, returns, and transactions from one dashboard built for diversified crypto portfolios.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-void pb-16 pt-16 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="hero-glow starfield absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Invest with Confidence,
            <br className="hidden sm:block" /> Grow with Purpose
          </h1>
          <p className="animate-fade-in-up animation-delay-600 mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg">
            250% year-over-year growth. $750M raised. Invest in vetted cryptocurrency projects, trade digital assets,
            and own a piece of the future with ease.
          </p>
          <div className="animate-fade-in-up animation-delay-600 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="btn-glow inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white sm:px-7"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-sm font-semibold text-white hover:bg-surface"
            >
              Request a Demo
            </Link>
          </div>
        </div>
        <div className="relative px-4 sm:px-6">
          <HeroVisuals />
        </div>
      </section>

      <section className="border-y border-line bg-navy/80 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-4 sm:px-6">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center gap-3 opacity-70">
              <img src={partner.src} alt={partner.name} className="h-8 w-8 rounded-md object-contain" />
              <span className="text-sm font-semibold tracking-wide text-muted">{partner.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-void py-20 lg:py-24">
        <div className="hero-glow absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent-2">Platform</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Centralized Investment Management
            </h2>
            <p className="mt-4 text-muted">
              Collect your investments, analytics, and assets for unified tracking and management on the leading
              cryptocurrency investment platform.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {platformCards.map((card) => (
              <div key={card.title} className="glass rounded-2xl p-6 text-left">
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-void pb-8">
        <div className="starfield absolute inset-0 opacity-80" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Track Performance
              <br /> at a Glance.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Monitor growth, live markets, and project allocation from your personalized RICOX dashboard.
            </p>
            <Link
              href="/dashboard"
              className="btn-glow mt-8 inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white"
            >
              Get Started Today
            </Link>
          </div>
          <div className="relative">
            <div className="glass absolute -right-2 -top-6 z-10 hidden w-40 rounded-2xl p-3 sm:block">
              <p className="text-[11px] text-muted">Performance</p>
              <div className="mt-2 flex h-16 items-end gap-1">
                {[40, 55, 35, 70, 48, 82, 60].map((h, i) => (
                  <span
                    key={i}
                    className={`w-3 rounded-sm ${i % 2 ? "bg-green" : "bg-accent"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <CryptoPrices />
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="bg-void py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">Effortless Asset Management</h2>
            <p className="mt-2 text-sm text-muted">
              Follow top RICOX investors and see how they allocate across vetted crypto projects.
            </p>
            <div className="mt-6 space-y-4">
              {investors.map((person) => (
                <div key={person.name} className="flex items-center gap-3">
                  <img alt={person.name} src={person.image} className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{person.name}</p>
                    <p className="text-xs text-muted">{person.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green">{person.gain}</p>
                    <p className="text-xs text-muted">{person.count} investments</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="mt-6 inline-flex items-center text-sm text-accent-2">
              Join them <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Tailored Portfolio Insights</h2>
                <p className="mt-2 text-sm text-muted">Latest popular deals on RICOX.</p>
              </div>
              <Link href="/investment" className="text-sm text-accent-2">
                View all
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="rounded-xl border border-line bg-surface/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{deal.name}</p>
                      <p className="text-xs text-muted">
                        {deal.category} · {deal.roi} ROI
                      </p>
                    </div>
                    <p className="text-sm text-white">{deal.raised}</p>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-surface-2">
                    <div className="h-1.5 rounded-full bg-accent" style={{ width: `${deal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-void py-20">
        <div className="hero-glow absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Invest with a RICOX assistant
          </h2>
          <p className="mt-4 text-muted">
            Personalized insights, market alerts, and support so you can build a diversified portfolio of vetted
            cryptocurrency projects.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="glass rounded-2xl p-5 text-left">
                <p className="text-sm text-muted">&quot;{item.quote}&quot;</p>
                <p className="mt-4 text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-[#0b1230] to-void py-16">
        <div className="hero-glow absolute inset-0" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay Updated on Crypto Opportunities
          </h2>
          <p className="mt-4 text-lg text-muted">
            Get the latest investment opportunities and market insights delivered straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
