import Link from "next/link";
import { Apple, ChevronRight, ExternalLink, TrendingUp } from "lucide-react";
import { CryptoPrices } from "@/components/CryptoPrices";
import { NewsletterForm } from "@/components/NewsletterForm";
import { StatsSection } from "@/components/StatsSection";
import { deals, investors, partners, testimonials } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-void py-16 sm:py-24 lg:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/hero-banner.jpeg')" }}
        />
        <div className="hero-glow starfield absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/75 to-void" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Invest in Vetted <span className="text-gradient">Crypto</span> Projects
            </h1>
            <p className="animate-fade-in-up animation-delay-300 mx-auto mt-6 max-w-2xl text-lg text-muted">
              250% year-over-year growth. $750M raised. Invest in the leading cryptocurrency investment
              platform. You can now own a piece of the future with ease.
            </p>
            <div className="animate-fade-in-up animation-delay-600 mx-auto mt-10 flex max-w-md justify-center gap-x-4 px-4 sm:gap-x-6 sm:px-0">
              <Link
                href="/investment"
                className="btn-glow inline-flex h-12 items-center rounded-full px-6 text-base font-medium text-white sm:px-8 sm:text-lg"
              >
                Explore Opportunities
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-base font-medium text-white hover:bg-surface sm:px-8 sm:text-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="col-span-2">
            <CryptoPrices />

            <div className="mb-12 mt-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Latest Popular Deals</h2>
                <Link className="flex items-center text-sm text-accent-2 hover:text-accent" href="/investment">
                  View all deals <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="glass overflow-hidden rounded-2xl">
                    <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-surface-2 to-navy">
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${deal.accent} text-2xl font-bold text-white shadow-lg`}
                      >
                        {deal.initials}
                      </div>
                      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs">
                        ₿
                      </div>
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs">
                        Ξ
                      </div>
                      <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-green text-xs">
                        ◎
                      </div>
                      <div className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                        {deal.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white">{deal.name}</h3>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-muted">Raised</span>
                        <span className="font-medium text-white">{deal.raised}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-sm">
                        <span className="text-muted">Target</span>
                        <span className="font-medium text-white">{deal.target}</span>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-surface-2">
                        <div className="h-2 rounded-full bg-accent" style={{ width: `${deal.progress}%` }} />
                      </div>
                      <div className="mt-2 text-right text-xs text-muted">{deal.progress}% Complete</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass mb-12 rounded-2xl p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold text-white">Build a Portfolio of Alternative Investments</h2>
                  <p className="mt-4 text-muted">
                    Diversify your portfolio with carefully vetted cryptocurrency projects. Our team of experts
                    analyzes each project for technology, team, market fit, and growth potential.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/investment"
                      className="btn-glow inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="/images/financial-calculator.jpeg"
                    alt="Financial Analysis and Calculator"
                    className="h-[300px] w-full rounded-lg object-cover"
                  />
                  <div className="absolute bottom-4 right-4 rounded-lg border border-line bg-void/90 p-3 backdrop-blur">
                    <div className="text-sm font-medium text-white">Performance</div>
                    <div className="text-2xl font-bold text-accent-2">+27.8%</div>
                    <div className="text-xs text-muted">Last quarter</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass mb-12 rounded-2xl p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="order-2 md:order-1">
                  <div className="relative mx-auto max-w-md">
                    <img
                      src="/images/trading-laptop.jpeg"
                      alt="Crypto Trading Platform"
                      className="h-[400px] w-full rounded-xl object-cover shadow-2xl"
                    />
                    <div className="absolute -right-4 -top-4 rounded-lg bg-accent p-3 text-white shadow-lg">
                      <TrendingUp />
                    </div>
                    <div className="absolute bottom-4 left-4 rounded-lg bg-green/90 px-3 py-2 backdrop-blur">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        <span className="text-sm font-medium text-white">Live Trading</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-2xl font-bold text-white">Trade With Other Investors</h2>
                  <p className="mt-4 text-muted">
                    Access our advanced trading platform to buy and sell cryptocurrencies with ease. Enjoy low
                    fees, fast execution, and a secure environment for all your trading needs.
                  </p>
                  <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Link
                      href="/auth/register"
                      className="btn-glow inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-white"
                    >
                      Invest Now
                    </Link>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://blockchain.info"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 text-sm font-medium text-white hover:bg-surface-2"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Market
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://apps.apple.com"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 text-sm font-medium text-white hover:bg-surface-2"
                    >
                      <Apple className="mr-2 h-4 w-4" />
                      iOS App
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass rounded-2xl">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Our Top Investors</h2>
                  <Link className="flex items-center text-xs text-accent-2 hover:text-accent" href="/auth/register">
                    Join them <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {investors.map((person) => (
                    <div key={person.name} className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                        <img alt={person.name} className="h-full w-full object-cover" src={person.image} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{person.name}</p>
                        <p className="text-xs text-muted">{person.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                          {person.gain}
                        </div>
                        <p className="mt-1 text-xs text-muted">{person.count} investments</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-bold text-white">What Our Users Say</h2>
                <div className="space-y-4">
                  {testimonials.map((item) => (
                    <div key={item.name} className="rounded-lg bg-surface-2 p-4">
                      <p className="text-sm text-muted">&quot;{item.quote}&quot;</p>
                      <div className="mt-4 flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                          <img alt={item.name} className="h-full w-full object-cover" src={item.image} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-muted">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-navy py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-muted">Trusted by leading crypto companies</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-16">
              {partners.map((partner) => (
                <div key={partner.name} className="flex h-12 items-center justify-center">
                  <div className="flex items-center space-x-3 opacity-70 transition-all hover:opacity-100">
                    <img src={partner.src} alt={partner.name} className="h-10 w-10 rounded-lg object-contain" />
                    <span className="text-lg font-semibold text-muted">{partner.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-[#0b1230] to-void py-16">
        <div className="hero-glow absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay Updated on Crypto Opportunities
            </h2>
            <p className="mt-4 text-lg text-muted">
              Get the latest investment opportunities and market insights delivered straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
