"use client";

import { useEffect, useState } from "react";
import { DashboardHeading } from "@/components/DashboardHeading";
import { money, timeAgo } from "@/lib/format";

type Tx = { id: string; type: string; amount: number; status: string; method?: string; reference?: string; createdAt: string };

export default function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((d) => setItems(d.transactions || []));
  }, []);

  return (
    <div>
      <DashboardHeading title="Transactions" description="Every deposit, investment, return, and withdrawal on your account." />
      <div className="dash-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="px-4 pb-3 pt-4 font-medium">Date</th>
                <th className="px-4 pb-3 pt-4 font-medium">Type</th>
                <th className="px-4 pb-3 pt-4 font-medium">Amount</th>
                <th className="px-4 pb-3 pt-4 font-medium">Status</th>
                <th className="px-4 pb-3 pt-4 font-medium">Method</th>
                <th className="px-4 pb-3 pt-4 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tx) => (
                <tr key={tx.id} className="border-t border-line">
                  <td className="px-4 py-3 text-muted">{timeAgo(tx.createdAt)}</td>
                  <td className="px-4 py-3 capitalize text-white">{tx.type}</td>
                  <td className="px-4 py-3 text-white">{money(tx.amount)}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 text-muted">{tx.method || "—"}</td>
                  <td className="px-4 py-3 text-muted">{tx.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? <p className="p-4 text-sm text-muted">No transactions yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
