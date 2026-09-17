"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";
import { money, timeAgo } from "@/lib/format";

type Row = {
  id: string;
  userId: string;
  amount: number;
  status: string;
  method?: string;
  reference?: string;
  userName: string;
  userEmail: string;
  createdAt: string;
};

type UserOpt = { id: string; name: string; email: string };
const input = "h-10 w-full rounded-xl border border-line bg-void px-3 text-white";

export default function AdminWithdrawalsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Row[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/withdrawals", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Load failed");
    setItems(data.withdrawals || []);
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, action: "approve" | "reject") {
    const res = await fetch(`/api/admin/withdrawals/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Action failed");
    toast(action === "approve" ? "Withdrawal approved" : "Withdrawal rejected (refunded)");
    await load();
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: form.get("userId"),
        amount: Number(form.get("amount")),
        method: form.get("method"),
        status: form.get("status"),
        reference: form.get("reference"),
        deduct: form.get("deduct") === "yes",
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Create failed");
    toast("Withdrawal created");
    e.currentTarget.reset();
    await load();
  }

  async function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/withdrawals/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: form.get("userId"),
        amount: Number(form.get("amount")),
        method: form.get("method"),
        status: form.get("status"),
        reference: form.get("reference"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Update failed");
    toast("Withdrawal updated");
    setEditing(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this withdrawal?")) return;
    const res = await fetch(`/api/admin/withdrawals/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Delete failed");
    toast("Withdrawal deleted");
    await load();
  }

  return (
    <AdminOnly>
      <DashboardHeading title="Withdrawals" description="Create, approve, edit, or delete withdrawal requests for any user." />
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="dash-panel overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((tx) => (
                  <tr key={tx.id} className="border-t border-line">
                    <td className="px-4 py-3 text-muted">{timeAgo(tx.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white">{tx.userName}</div>
                      <div className="text-xs text-muted">{tx.userEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-white">{money(tx.amount)}</td>
                    <td className="px-4 py-3 text-muted">{tx.method}</td>
                    <td className="px-4 py-3 capitalize text-muted">{tx.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {tx.status === "pending" ? (
                          <>
                            <button type="button" onClick={() => review(tx.id, "approve")} className="text-xs text-green">
                              Approve
                            </button>
                            <button type="button" onClick={() => review(tx.id, "reject")} className="text-xs text-red">
                              Reject
                            </button>
                          </>
                        ) : null}
                        <button type="button" className="text-xs text-accent-2" onClick={() => setEditing(tx)}>
                          Edit
                        </button>
                        <button type="button" className="text-xs text-red" onClick={() => onDelete(tx.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!items.length ? <p className="p-4 text-sm text-muted">No withdrawals yet.</p> : null}
          </div>
        </div>

        <div className="space-y-4">
          <form className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onCreate}>
            <p className="text-sm font-medium text-white">Add withdrawal</p>
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
            <input name="amount" type="number" min={1} step="0.01" required placeholder="Amount" className={input} />
            <select name="method" className={input} defaultValue="Bank transfer">
              <option>Bank transfer</option>
              <option>BTC</option>
              <option>USDT</option>
            </select>
            <input name="reference" placeholder="Reference" className={input} />
            <select name="status" className={input} defaultValue="pending">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <select name="deduct" className={input} defaultValue="yes">
              <option value="yes">Deduct balance now</option>
              <option value="no">Do not deduct</option>
            </select>
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Create</button>
          </form>

          {editing ? (
            <form key={editing.id} className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onUpdate}>
              <p className="text-sm font-medium text-white">Edit withdrawal</p>
              <select name="userId" required className={input} defaultValue={editing.userId}>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input name="amount" type="number" required defaultValue={editing.amount} className={input} />
              <input name="method" defaultValue={editing.method || ""} className={input} />
              <input name="reference" defaultValue={editing.reference || ""} className={input} />
              <select name="status" className={input} defaultValue={editing.status}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="verified">Verified</option>
                <option value="failed">Failed</option>
              </select>
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
