"use client";

import { DollarSign, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsSection() {
  const [stats, setStats] = useState({
    investors: "0+",
    raised: "$0",
    projects: "0+",
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        const raised = Number(d.raised || 0);
        setStats({
          investors: `${d.investors}+`,
          raised: raised >= 1_000_000 ? `$${(raised / 1_000_000).toFixed(1)}M` : `$${raised.toLocaleString()}`,
          projects: `${d.projects}+`,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    { icon: Users, value: stats.investors, label: "Active Investors", sub: "Trusted by investors worldwide" },
    { icon: DollarSign, value: stats.raised, label: "Total Raised", sub: "Capital successfully deployed" },
    { icon: Target, value: stats.projects, label: "Projects Funded", sub: "Successful investment rounds" },
  ];

  return (
    <section className="relative overflow-hidden bg-void py-16">
      <div className="hero-glow absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gradient md:text-4xl">Trusted by Thousands</h2>
          <p className="mt-4 text-lg text-muted">Join our growing community of successful investors</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((stat) => (
            <div key={stat.label} className="glass group rounded-2xl p-8 text-center transition hover:border-line-strong">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="mb-2 text-4xl font-bold text-gradient md:text-5xl">{stat.value}</div>
              <div className="mb-2 text-xl font-semibold text-white">{stat.label}</div>
              <div className="text-sm text-muted">{stat.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-muted">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Growing 250% year-over-year</span>
          </div>
        </div>
      </div>
    </section>
  );
}
