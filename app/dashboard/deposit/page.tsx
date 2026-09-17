"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";

export default function DepositPage() {
  const { refresh } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [proofName, setProofName] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/deposits", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAddress(d.address || ""))
      .catch(() => setError("Could not load BTC deposit address"));
  }, []);

  const qrSrc = useMemo(() => {
    if (!address) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(address)}`;
  }, [address]);

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const proof = form.get("proof");
    if (!(proof instanceof File) || proof.size === 0) {
      setError("Upload a screenshot of your BTC deposit before you can submit.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/deposits", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Deposit failed");
        return;
      }
      await refresh();
      toast(data.message || "Deposit submitted successfully.");
      router.push("/dashboard/transactions");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <DashboardHeading
        title="Deposit BTC"
        description="Send Bitcoin to the wallet below, then upload a screenshot of the transfer. An admin must approve before your balance is credited."
      />

      <div className="grid max-w-3xl gap-6 lg:grid-cols-[240px_1fr]">
        <div className="dash-panel flex flex-col items-center gap-3 rounded-2xl p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Scan to pay</p>
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrSrc}
              alt="BTC deposit QR code"
              width={220}
              height={220}
              className="rounded-xl bg-white p-2"
            />
          ) : (
            <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-void text-sm text-muted">
              Loading QR…
            </div>
          )}
          <p className="text-center text-xs text-muted">Bitcoin network only</p>
        </div>

        <form className="dash-panel space-y-4 rounded-2xl p-6" onSubmit={onSubmit}>
          {error ? <p className="text-sm text-red">{error}</p> : null}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">BTC wallet address</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={address || "Loading…"}
                className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-void px-3 font-mono text-xs text-white"
              />
              <button
                type="button"
                onClick={copyAddress}
                disabled={!address}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 text-sm text-white hover:bg-accent/20 disabled:opacity-50"
              >
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Amount (USD equivalent)</label>
            <input
              name="amount"
              type="number"
              min={50}
              step="0.01"
              required
              placeholder="Minimum $50"
              className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Transaction hash / note (optional)</label>
            <input
              name="reference"
              placeholder="BTC tx id"
              className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Deposit screenshot <span className="text-red">*</span>
            </label>
            <input
              name="proof"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              onChange={(e) => setProofName(e.target.files?.[0]?.name || "")}
              className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-2"
            />
            <p className="mt-1.5 text-xs text-muted">
              Required. Upload a clear screenshot of your BTC transfer before submitting.
              {proofName ? ` Selected: ${proofName}` : ""}
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !proofName}
            className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit deposit"}
          </button>
        </form>
      </div>
    </div>
  );
}
