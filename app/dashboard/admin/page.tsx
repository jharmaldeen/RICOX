"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";

type Stats = {
  users: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  bankAccounts: number;
  cards: number;
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats || null);
        setAddress(d.settings?.btcDepositAddress || "");
      });
  }, []);

  return (
    <AdminOnly>
      <DashboardHeading
        title="Admin control"
        description="Manage users, deposits, withdrawals, bank accounts, cards, and the BTC deposit wallet."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Users", value: stats?.users ?? "—", href: "/dashboard/admin/users" },
          { label: "Pending deposits", value: stats?.pendingDeposits ?? "—", href: "/dashboard/admin/deposits" },
          { label: "Pending withdrawals", value: stats?.pendingWithdrawals ?? "—", href: "/dashboard/admin/withdrawals" },
          { label: "Bank accounts", value: stats?.bankAccounts ?? "—", href: "/dashboard/admin/bank-accounts" },
          { label: "Cards", value: stats?.cards ?? "—", href: "/dashboard/admin/cards" },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="dash-panel rounded-2xl p-4 hover:border-accent/40">
            <p className="text-xs text-muted">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="dash-panel mt-6 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">BTC deposit wallet</p>
            <p className="mt-1 break-all font-mono text-xs text-muted">{address || "Not set"}</p>
          </div>
          <Link
            href="/dashboard/admin/settings"
            className="btn-glow inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-white"
          >
            Edit wallet & QR
          </Link>
        </div>
      </div>
    </AdminOnly>
  );
}
