"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAddress(d.settings?.btcDepositAddress || ""));
  }, []);

  const qrSrc = useMemo(() => {
    if (!address) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(address)}`;
  }, [address]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ btcDepositAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save");
        return;
      }
      setAddress(data.settings.btcDepositAddress);
      toast("BTC deposit wallet updated");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminOnly>
      <DashboardHeading
        title="Deposit wallet settings"
        description="Set the BTC address shown to users on the deposit page. The QR code updates automatically."
      />
      <div className="grid max-w-3xl gap-6 lg:grid-cols-[240px_1fr]">
        <div className="dash-panel flex flex-col items-center gap-3 rounded-2xl p-5">
          <p className="text-xs uppercase text-muted">Live QR preview</p>
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrSrc} alt="BTC QR" width={220} height={220} className="rounded-xl bg-white p-2" />
          ) : (
            <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-void text-sm text-muted">
              Enter address
            </div>
          )}
        </div>
        <form className="dash-panel space-y-4 rounded-2xl p-6" onSubmit={onSubmit}>
          {error ? <p className="text-sm text-red">{error}</p> : null}
          <label className="block text-xs text-muted">BTC deposit address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
            className="w-full rounded-xl border border-line bg-void px-3 py-2 font-mono text-xs text-white"
          />
          <button disabled={saving} className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Saving…" : "Save wallet"}
          </button>
        </form>
      </div>
    </AdminOnly>
  );
}
