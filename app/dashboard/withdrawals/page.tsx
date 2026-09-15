"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeading } from "@/components/DashboardHeading";

export default function WithdrawalsPage() {
  const { refresh } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(form.get("amount")), method: form.get("method") }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Withdrawal failed");
    setMessage(`Withdrawal ${data.transaction.reference} submitted.`);
    await refresh();
    e.currentTarget.reset();
  }

  return (
    <div>
      <DashboardHeading
        title="Withdrawals"
        description="Withdraw your returns once your investment reaches maturity, or unused balance."
      />
      <form className="dash-panel max-w-md space-y-4 rounded-2xl p-6" onSubmit={onSubmit}>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        {message ? <p className="text-sm text-green">{message}</p> : null}
        <input name="amount" type="number" min={50} required placeholder="Amount" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <select name="method" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white">
          <option>Bank transfer</option>
          <option>USDT</option>
        </select>
        <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Request withdrawal</button>
      </form>
    </div>
  );
}
