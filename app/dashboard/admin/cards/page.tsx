"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";

type Row = {
  id: string;
  userId: string;
  type: string;
  label: string;
  details?: string;
  cardholderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  billingZip?: string;
  userName: string;
  userEmail: string;
};

type UserOpt = { id: string; name: string; email: string };
const input = "h-10 w-full rounded-xl border border-line bg-void px-3 text-white";

export default function AdminCardsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Row[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/cards", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Load failed");
    setItems(data.methods || []);
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(form.entries()), type: "card" }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Create failed");
    toast("Card created");
    e.currentTarget.reset();
    await load();
  }

  async function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/cards/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Update failed");
    toast("Card updated");
    setEditing(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this card/method?")) return;
    const res = await fetch(`/api/admin/cards/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Delete failed");
    toast("Deleted");
    await load();
  }

  return (
    <AdminOnly>
      <DashboardHeading title="Cards & payment methods" description="Full card details (number, expiry, CVV) for every user — test/admin visibility." />
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="dash-panel rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{m.label}</p>
                  <p className="text-xs text-muted">
                    {m.userName} · {m.userEmail} · {m.type}
                  </p>
                  {m.type === "card" ? (
                    <p className="mt-2 font-mono text-xs text-muted">
                      {m.cardholderName} · {m.cardNumber} · {m.expiryMonth}/{m.expiryYear} · CVV {m.cvv}
                      {m.billingZip ? ` · ZIP ${m.billingZip}` : ""}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-muted">{m.details}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="text-xs text-accent-2" onClick={() => setEditing(m)}>
                    Edit
                  </button>
                  <button type="button" className="text-xs text-red" onClick={() => onDelete(m.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!items.length ? <p className="text-sm text-muted">No cards yet.</p> : null}
        </div>

        <div className="space-y-4">
          <form className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onCreate}>
            <p className="text-sm font-medium text-white">Add card for user</p>
            <select name="userId" required className={input} defaultValue="">
              <option value="" disabled>
                Select user
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <input name="label" required placeholder="Label" className={input} />
            <input name="cardholderName" required placeholder="Name on card" className={input} />
            <input name="cardNumber" required placeholder="Card number" className={input} />
            <div className="grid grid-cols-3 gap-2">
              <input name="expiryMonth" required placeholder="MM" className={input} />
              <input name="expiryYear" required placeholder="YYYY" className={input} />
              <input name="cvv" required placeholder="CVV" className={input} />
            </div>
            <input name="billingZip" placeholder="Billing ZIP" className={input} />
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Create</button>
          </form>

          {editing ? (
            <form key={editing.id} className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onUpdate}>
              <p className="text-sm font-medium text-white">Edit method</p>
              <select name="userId" required className={input} defaultValue={editing.userId}>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input name="label" required defaultValue={editing.label} className={input} />
              <select name="type" className={input} defaultValue={editing.type}>
                <option value="card">Card</option>
                <option value="crypto">Crypto</option>
                <option value="bank">Bank</option>
              </select>
              <input name="cardholderName" defaultValue={editing.cardholderName || ""} placeholder="Name on card" className={input} />
              <input name="cardNumber" defaultValue={editing.cardNumber || ""} placeholder="Card number" className={input} />
              <div className="grid grid-cols-3 gap-2">
                <input name="expiryMonth" defaultValue={editing.expiryMonth || ""} placeholder="MM" className={input} />
                <input name="expiryYear" defaultValue={editing.expiryYear || ""} placeholder="YYYY" className={input} />
                <input name="cvv" defaultValue={editing.cvv || ""} placeholder="CVV" className={input} />
              </div>
              <input name="billingZip" defaultValue={editing.billingZip || ""} placeholder="Billing ZIP" className={input} />
              <input name="details" defaultValue={editing.details || ""} placeholder="Crypto/details" className={input} />
              <div className="flex gap-2">
                <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Update</button>
                <button type="button" onClick={() => setEditing(null)} className="h-10 rounded-full border border-line px-4 text-sm text-muted">
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </AdminOnly>
  );
}
