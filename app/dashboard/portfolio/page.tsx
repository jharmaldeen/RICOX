"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardHeading } from "@/components/DashboardHeading";
import { money } from "@/lib/format";

type Row = { id: string; dealName: string; amount: number; status: string };

export default function PortfolioPage() {
  const [items, setItems] = useState<Row[]>([]);
  useEffect(() => {
    fetch("/api/investments", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(d.investments || []));
  }, []);

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <DashboardHeading
        title="Portfolio"
        description="Track your investments and returns through your personalized dashboard."
      />
      <div className="dash-panel rounded-2xl p-5">
        <p className="text-xs text-muted">Allocated</p>
        <p className="mt-1 text-3xl font-semibold text-white">{money(total)}</p>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="dash-panel flex items-center justify-between rounded-2xl px-4 py-4">
            <div>
              <p className="font-medium text-white">{item.dealName}</p>
              <p className="text-xs capitalize text-muted">{item.status}</p>
            </div>
            <p className="font-medium text-white">{money(item.amount)}</p>
          </div>
        ))}
        {items.length === 0 ? (
          <div className="dash-panel rounded-2xl p-5">
            <p className="text-sm text-muted">No investments yet.</p>
            <Link href="/dashboard/investments/new" className="mt-3 inline-block text-sm text-accent-2">
              Start investing
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
