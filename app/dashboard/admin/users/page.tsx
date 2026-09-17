"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AdminOnly } from "@/components/AdminOnly";
import { DashboardHeading } from "@/components/DashboardHeading";
import { useToast } from "@/components/ToastProvider";
import { money } from "@/lib/format";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
};

const input = "h-10 w-full rounded-xl border border-line bg-void px-3 text-white";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await res.json();
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
        balance: Number(form.get("balance") || 0),
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Create failed");
    toast("User created");
    e.currentTarget.reset();
    await load();
  }

  async function onUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setError("");
    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      name: form.get("name"),
      email: form.get("email"),
      role: form.get("role"),
      balance: Number(form.get("balance")),
    };
    const password = String(form.get("password") || "");
    if (password) payload.password = password;
    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Update failed");
    toast("User updated");
    setEditing(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this user and related data?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Delete failed");
    toast("User deleted");
    await load();
  }

  return (
    <AdminOnly>
      <DashboardHeading title="Users" description="Create, edit, update balance, or delete user accounts." />
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="dash-panel overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-line">
                    <td className="px-4 py-3 text-white">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-muted">{u.role}</td>
                    <td className="px-4 py-3 text-white">{money(u.balance)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button type="button" className="text-xs text-accent-2" onClick={() => setEditing(u)}>
                          Edit
                        </button>
                        <button type="button" className="text-xs text-red" onClick={() => onDelete(u.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <form className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onCreate}>
            <p className="text-sm font-medium text-white">Add user</p>
            <input name="name" required placeholder="Full name" className={input} />
            <input name="email" type="email" required placeholder="Email" className={input} />
            <input name="password" type="password" required placeholder="Password" className={input} />
            <input name="balance" type="number" step="0.01" defaultValue={0} placeholder="Balance" className={input} />
            <select name="role" className={input} defaultValue="user">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">Create</button>
          </form>

          {editing ? (
            <form className="dash-panel space-y-3 rounded-2xl p-5" onSubmit={onUpdate}>
              <p className="text-sm font-medium text-white">Edit {editing.name}</p>
              <input name="name" required defaultValue={editing.name} className={input} />
              <input name="email" type="email" required defaultValue={editing.email} className={input} />
              <input name="balance" type="number" step="0.01" required defaultValue={editing.balance} className={input} />
              <select name="role" className={input} defaultValue={editing.role}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input name="password" type="password" placeholder="New password (optional)" className={input} />
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
