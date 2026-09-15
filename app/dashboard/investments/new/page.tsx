"use client";

import { FormEvent, useState } from "react";
import { deals } from "@/lib/data";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeading } from "@/components/DashboardHeading";

export default function NewInvestmentPage() {
  const { refresh } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId: form.get("dealId"), amount: Number(form.get("amount")) }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not invest");
    setMessage(`Invested in ${data.investment.dealName}.`);
    await refresh();
    e.currentTarget.reset();
  }

  return (
    <div>
      <DashboardHeading
        title="New Investment"
        description="Select a vetted project and allocate funds from your balance."
      />
      <form className="dash-panel max-w-md space-y-4 rounded-2xl p-6" onSubmit={onSubmit}>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        {message ? <p className="text-sm text-green">{message}</p> : null}
        <div>
          <label className="mb-1 block text-sm text-muted">Project</label>
          <select name="dealId" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white">
            {deals.map((deal) => (
              <option key={deal.id} value={deal.id}>
                {deal.name} — {deal.category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Amount (USD)</label>
          <input name="amount" type="number" min={100} required className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        </div>
        <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Invest now</button>
      </form>
    </div>
  );
}
