"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";

type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  routingNumber?: string;
  iban?: string;
  swiftBic?: string;
  country?: string;
};

type PaymentMethod = {
  id: string;
  type: string;
  label: string;
  details?: string;
  cardholderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  billingZip?: string;
};

type Tab = "bank" | "card";

const inputClass = "h-10 w-full rounded-xl border border-line bg-void px-3 text-white";

function FundingMethodsInner() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "card" ? "card" : "bank";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setTab(searchParams.get("tab") === "card" ? "card" : "bank");
  }, [searchParams]);

  async function load() {
    const [banks, cards] = await Promise.all([
      fetch("/api/bank-accounts", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/payment-methods", { cache: "no-store" }).then((r) => r.json()),
    ]);
    setAccounts(banks.accounts || []);
    setMethods(cards.methods || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onBankSubmit(e: FormEvent<HTMLFormElement>) {
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
        sortCode: form.get("sortCode"),
        routingNumber: form.get("routingNumber"),
        iban: form.get("iban"),
        swiftBic: form.get("swiftBic"),
        country: form.get("country"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not save bank account");
    toast("Bank account saved");
    e.currentTarget.reset();
    await load();
  }

  async function onCardSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "card",
        label: form.get("label"),
        cardholderName: form.get("cardholderName"),
        cardNumber: form.get("cardNumber"),
        expiryMonth: form.get("expiryMonth"),
        expiryYear: form.get("expiryYear"),
        cvv: form.get("cvv"),
        billingZip: form.get("billingZip"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not save card");
    toast("Card saved");
    e.currentTarget.reset();
    await load();
  }

  async function removeBank(id: string) {
    await fetch(`/api/bank-accounts?id=${id}`, { method: "DELETE" });
    toast("Bank account removed");
    await load();
  }

  async function removeMethod(id: string) {
    await fetch(`/api/payment-methods?id=${id}`, { method: "DELETE" });
    toast("Payment method removed");
    await load();
  }

  const cards = methods.filter((m) => m.type === "card");
  const other = methods.filter((m) => m.type !== "card");

  return (
    <div>
      <DashboardHeading
        title="Funding methods"
        description="Save bank accounts and cards for deposits and withdrawals. Same menu — switch tabs below."
      />

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("bank")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === "bank" ? "bg-accent/20 text-accent-2" : "border border-line text-muted hover:text-white"
          }`}
        >
          Bank accounts
        </button>
        <button
          type="button"
          onClick={() => setTab("card")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === "card" ? "bg-accent/20 text-accent-2" : "border border-line text-muted hover:text-white"
          }`}
        >
          Cards
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      {tab === "bank" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className="dash-panel rounded-2xl px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{a.bankName}</p>
                    <p className="text-sm text-muted">
                      {a.accountName} · {a.accountNumber}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Sort {a.sortCode || "—"}
                      {a.routingNumber ? ` · Routing ${a.routingNumber}` : ""}
                      {a.iban ? ` · IBAN ${a.iban}` : ""}
                      {a.swiftBic ? ` · SWIFT ${a.swiftBic}` : ""}
                      {a.country ? ` · ${a.country}` : ""}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeBank(a.id)} className="text-xs text-red">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!accounts.length ? <p className="text-sm text-muted">No bank accounts yet.</p> : null}
          </div>

          <form className="dash-panel space-y-3 rounded-2xl p-6" onSubmit={onBankSubmit}>
            <p className="text-sm font-medium text-white">Add bank account</p>
            <input name="bankName" required placeholder="Bank name" className={inputClass} />
            <input name="accountName" required placeholder="Account holder name" className={inputClass} />
            <input name="accountNumber" required placeholder="Account number" className={inputClass} />
            <input name="sortCode" required placeholder="Sort code (e.g. 04-00-04)" className={inputClass} />
            <input name="routingNumber" placeholder="Routing number (optional)" className={inputClass} />
            <input name="iban" placeholder="IBAN (optional)" className={inputClass} />
            <input name="swiftBic" placeholder="SWIFT / BIC (optional)" className={inputClass} />
            <input name="country" placeholder="Country" className={inputClass} />
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Save bank account</button>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {cards.map((m) => (
              <div key={m.id} className="dash-panel rounded-2xl px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{m.label}</p>
                    <p className="text-sm text-muted">{m.cardholderName}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {m.cardNumber} · {m.expiryMonth}/{m.expiryYear} · CVV {m.cvv}
                      {m.billingZip ? ` · ZIP ${m.billingZip}` : ""}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeMethod(m.id)} className="text-xs text-red">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {other.map((m) => (
              <div key={m.id} className="dash-panel rounded-2xl px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{m.label}</p>
                    <p className="text-sm capitalize text-muted">
                      {m.type} · {m.details}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeMethod(m.id)} className="text-xs text-red">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!methods.length ? <p className="text-sm text-muted">No cards saved yet.</p> : null}
          </div>

          <form className="dash-panel space-y-3 rounded-2xl p-6" onSubmit={onCardSubmit}>
            <p className="text-sm font-medium text-white">Add card</p>
            <input name="label" required placeholder="Label (e.g. Personal Visa)" className={inputClass} />
            <input name="cardholderName" required placeholder="Name on card" className={inputClass} />
            <input name="cardNumber" required placeholder="Card number" inputMode="numeric" className={inputClass} />
            <div className="grid grid-cols-3 gap-3">
              <input name="expiryMonth" required placeholder="MM" maxLength={2} className={inputClass} />
              <input name="expiryYear" required placeholder="YYYY" maxLength={4} className={inputClass} />
              <input name="cvv" required placeholder="CVV" maxLength={4} className={inputClass} />
            </div>
            <input name="billingZip" placeholder="Billing ZIP / postcode" className={inputClass} />
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Save card</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function FundingMethodsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <FundingMethodsInner />
    </Suspense>
  );
}
