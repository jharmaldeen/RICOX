"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";
import { money, timeAgo } from "@/lib/format";

type DepositRow = {
  id: string;
  userId: string;
  amount: number;
  status: string;
  method?: string;
  reference?: string;
  proofName?: string;
  hasProof: boolean;
  userName: string;
  userEmail: string;
  createdAt: string;
};

type UserOpt = { id: string; name: string; email: string };

const input = "h-10 w-full rounded-xl border border-line bg-void px-3 text-white";

export default function AdminDepositsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<DepositRow[]>([]);
  const [users, setUsers] = useState<UserOpt[]>([]);
  const [error, setError] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editing, setEditing] = useState<DepositRow | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/deposits", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not load deposits");
      return;
    }
    setItems(data.deposits || []);
    setUsers(data.users || []);
    setError("");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, action: "approve" | "reject") {
    const res = await fetch(`/api/admin/deposits/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Action failed");
    toast(action === "approve" ? "Deposit approved" : "Deposit rejected");
    await load();
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: form.get("userId"),
        amount: Number(form.get("amount")),
        status: form.get("status"),
        reference: form.get("reference"),
        method: "BTC",
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Create failed");
    toast("Deposit created");
    e.currentTarget.reset();
    await load();
  }

  async function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/deposits/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: form.get("userId"),
        amount: Number(form.get("amount")),
        status: form.get("status"),
        reference: form.get("reference"),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Update failed");
    toast("Deposit updated");
    setEditing(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this deposit?")) return;
    const res = await fetch(`/api/admin/deposits/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Delete failed");
    toast("Deposit deleted");
    await load();
  }

  return (
    <AdminOnly>
      <DashboardHeading title="Deposits" description="Approve screenshots, create deposits on behalf of users, edit or delete records." />
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <div className="mb-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="dash-panel overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Screenshot</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((tx) => (
                  <tr key={tx.id} className="border-t border-line align-top">
                    <td className="px-4 py-3 text-muted">{timeAgo(tx.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white">{tx.userName}</div>
                      <div className="text-xs text-muted">{tx.userEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-white">{money(tx.amount)}</td>
                    <td className="px-4 py-3 capitalize text-muted">{tx.status}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{tx.reference || "—"}</td>
                    <td className="px-4 py-3">
                      {tx.hasProof ? (
                        <div>
                          <button type="button" className="text-accent-2" onClick={() => setPreviewId(previewId === tx.id ? null : tx.id)}>
                            {previewId === tx.id ? "Hide" : "View"}
                          </button>
                          {previewId === tx.id ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`/api/admin/deposits/${tx.id}/proof`} alt="proof" className="mt-2 max-h-48 max-w-[200px] rounded-xl border border-line object-contain" />
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {tx.status === "pending" ? (
                          <>
                            <button type="button" onClick={() => review(tx.id, "approve")} className="rounded-full bg-green/20 px-2 py-1 text-xs text-green">
                              Approve
                            </button>
                            <button type="button" onClick={() => review(tx.id, "reject")} className="rounded-full bg-red/20 px-2 py-1 text-xs text-red">
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
            {!items.length ? <p className="p-4 text-sm text-muted">No deposits yet.</p> : null}
          </div>
        </div>

        <div className="space-y-4">
          <form className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onCreate}>
            <p className="text-sm font-medium text-white">Add deposit for user</p>
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
            <input name="reference" placeholder="Reference / tx hash" className={input} />
            <select name="status" className={input} defaultValue="pending">
              <option value="pending">Pending</option>
              <option value="verified">Verified (credit balance)</option>
              <option value="failed">Failed</option>
            </select>
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Create deposit</button>
          </form>

          {editing ? (
            <form key={editing.id} className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onUpdate}>
              <p className="text-sm font-medium text-white">Edit deposit</p>
              <select name="userId" required className={input} defaultValue={editing.userId}>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <input name="amount" type="number" min={1} step="0.01" required defaultValue={editing.amount} className={input} />
              <input name="reference" defaultValue={editing.reference || ""} className={input} />
              <select name="status" className={input} defaultValue={editing.status}>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="completed">Completed</option>
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
