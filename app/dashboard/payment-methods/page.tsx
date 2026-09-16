"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardHeading } from "@/components/DashboardHeading";

type Method = { id: string; type: string; label: string; details: string };

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<Method[]>([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/payment-methods", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMethods(d.methods || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        label: form.get("label"),
        details: form.get("details"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not save method");
    if (data.method) setMethods((prev) => [...prev, data.method]);
    e.currentTarget.reset();
  }

  return (
    <div>
      <DashboardHeading title="Payment Methods" description="Saved bank and crypto methods for funding your account." />
      <div className="space-y-3">
        {methods.map((m) => (
          <div key={m.id} className="dash-panel rounded-2xl px-4 py-3">
            <p className="font-medium text-white">{m.label}</p>
            <p className="text-sm capitalize text-muted">
              {m.type} · {m.details}
            </p>
          </div>
        ))}
      </div>
      <form className="dash-panel mt-8 max-w-md space-y-3 rounded-2xl p-6" onSubmit={onSubmit}>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        <select name="type" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white">
          <option value="bank">Bank</option>
          <option value="crypto">Crypto</option>
        </select>
        <input name="label" required placeholder="Label" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <input name="details" required placeholder="Details" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
        <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Add method</button>
      </form>
    </div>
  );
}
