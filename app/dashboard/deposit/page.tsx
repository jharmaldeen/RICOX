"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeading } from "@/components/DashboardHeading";

export default function DepositPage() {
  const { refresh } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(form.get("amount")),
        method: form.get("method"),
        reference: form.get("reference"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Deposit failed");
    setMessage(`Deposit submitted. Reference ${data.transaction.reference}. Verify it to credit your balance.`);
    await refresh();
    e.currentTarget.reset();
  }

  return (
    <div>
      <DashboardHeading
        title="Deposit"
        description="Fund your account using cryptocurrency or traditional payment methods."
      />
      <form className="dash-panel max-w-md space-y-4 rounded-2xl p-6" onSubmit={onSubmit}>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        {message ? <p className="text-sm text-green">{message}</p> : null}
        <input name="amount" type="number" min={50} required placeholder="Amount" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <select name="method" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white">
          <option>Bank transfer</option>
          <option>USDT</option>
          <option>Bitcoin</option>
        </select>
        <input name="reference" placeholder="Optional reference / tx hash" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Submit deposit</button>
      </form>
    </div>
  );
}
