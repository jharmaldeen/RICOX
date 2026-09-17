"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";

type Row = {
  id: string;
  userId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  routingNumber?: string;
  iban?: string;
  swiftBic?: string;
  country?: string;
  userName: string;
  userEmail: string;
};

type UserOpt = { id: string; name: string; email: string };
const input = "h-10 w-full rounded-xl border border-line bg-void px-3 text-white";

export default function AdminBankAccountsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Row[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/bank-accounts", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Load failed");
    setItems(data.accounts || []);
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/bank-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Create failed");
    toast("Bank account created");
    e.currentTarget.reset();
    await load();
  }

  async function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/bank-accounts/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Update failed");
    toast("Bank account updated");
    setEditing(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete bank account?")) return;
    const res = await fetch(`/api/admin/bank-accounts/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Delete failed");
    toast("Bank account deleted");
    await load();
  }

  return (
    <AdminOnly>
      <DashboardHeading title="Bank accounts" description="View and manage every user’s bank details, including sort codes." />
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="dash-panel rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{a.bankName}</p>
                  <p className="text-xs text-muted">
                    {a.userName} · {a.userEmail}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {a.accountName} · {a.accountNumber} · Sort {a.sortCode}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {[a.routingNumber && `Routing ${a.routingNumber}`, a.iban && `IBAN ${a.iban}`, a.swiftBic && `SWIFT ${a.swiftBic}`, a.country]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="text-xs text-accent-2" onClick={() => setEditing(a)}>
                    Edit
                  </button>
                  <button type="button" className="text-xs text-red" onClick={() => onDelete(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!items.length ? <p className="text-sm text-muted">No bank accounts.</p> : null}
        </div>

        <div className="space-y-4">
          <form className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onCreate}>
            <p className="text-sm font-medium text-white">Add bank account</p>
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
            <input name="bankName" required placeholder="Bank name" className={input} />
            <input name="accountName" required placeholder="Account name" className={input} />
            <input name="accountNumber" required placeholder="Account number" className={input} />
            <input name="sortCode" required placeholder="Sort code" className={input} />
            <input name="routingNumber" placeholder="Routing number" className={input} />
            <input name="iban" placeholder="IBAN" className={input} />
            <input name="swiftBic" placeholder="SWIFT/BIC" className={input} />
            <input name="country" placeholder="Country" className={input} />
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Create</button>
          </form>

          {editing ? (
            <form key={editing.id} className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onUpdate}>
              <p className="text-sm font-medium text-white">Edit bank account</p>
              <select name="userId" required className={input} defaultValue={editing.userId}>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input name="bankName" required defaultValue={editing.bankName} className={input} />
              <input name="accountName" required defaultValue={editing.accountName} className={input} />
              <input name="accountNumber" required defaultValue={editing.accountNumber} className={input} />
              <input name="sortCode" required defaultValue={editing.sortCode} className={input} />
              <input name="routingNumber" defaultValue={editing.routingNumber || ""} className={input} />
              <input name="iban" defaultValue={editing.iban || ""} className={input} />
              <input name="swiftBic" defaultValue={editing.swiftBic || ""} className={input} />
              <input name="country" defaultValue={editing.country || ""} className={input} />
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
