"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeading } from "@/components/DashboardHeading";

export default function VerifyTransactionPage() {
  const { refresh } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/verify-transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: form.get("reference") }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Verification failed");
    setMessage(`Transaction ${data.transaction.reference} marked verified.`);
    await refresh();
  }

  return (
    <div>
      <DashboardHeading
        title="Verify Transaction"
        description="Enter the deposit reference or transaction hash to credit your balance."
      />
      <form className="dash-panel max-w-md space-y-4 rounded-2xl p-6" onSubmit={onSubmit}>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        {message ? <p className="text-sm text-green">{message}</p> : null}
        <input name="reference" required placeholder="Reference / tx hash" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Verify</button>
      </form>
    </div>
  );
}
