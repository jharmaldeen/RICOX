"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardHeading } from "@/components/DashboardHeading";

type Account = { id: string; bankName: string; accountName: string; accountNumber: string };

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/bank-accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/bank-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bankName: form.get("bankName"),
        accountName: form.get("accountName"),
        accountNumber: form.get("accountNumber"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not save account");
    e.currentTarget.reset();
    load();
  }

  return (
    <div>
      <DashboardHeading title="Bank Accounts" description="Manage payout accounts for withdrawals." />
      <div className="space-y-3">
        {accounts.map((a) => (
          <div key={a.id} className="dash-panel rounded-2xl px-4 py-3">
            <p className="font-medium text-white">{a.bankName}</p>
            <p className="text-sm text-muted">
              {a.accountName} · {a.accountNumber}
            </p>
          </div>
        ))}
      </div>
      <form className="dash-panel mt-8 max-w-md space-y-3 rounded-2xl p-6" onSubmit={onSubmit}>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        <input name="bankName" required placeholder="Bank name" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <input name="accountName" required placeholder="Account name" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <input name="accountNumber" required placeholder="Account number" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Add account</button>
      </form>
    </div>
  );
}
