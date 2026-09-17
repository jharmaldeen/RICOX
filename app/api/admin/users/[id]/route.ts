import { hashPassword, publicUser } from "@/lib/auth";
import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const body = await request.json();
  const db = await getDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return json({ error: "User not found" }, 404);

  if (body.name !== undefined) user.name = String(body.name).trim();
  if (body.email !== undefined) {
    const email = String(body.email).trim().toLowerCase();
    if (db.users.some((u) => u.email === email && u.id !== id)) {
      return json({ error: "Email already in use" }, 400);
    }
    user.email = email;
  }
  if (body.role === "admin" || body.role === "user") user.role = body.role;
  if (body.balance !== undefined) {
    const balance = Number(body.balance);
    if (!Number.isFinite(balance)) return json({ error: "Invalid balance" }, 400);
    user.balance = balance;
  }
  if (body.password) {
    const password = String(body.password);
    if (password.length < 6) return json({ error: "Password must be 6+ characters" }, 400);
    user.passwordHash = await hashPassword(password);
  }

  await saveDb(db);
  return json({ success: true, user: publicUser(user) });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  if (id === auth.user.id) return json({ error: "You cannot delete your own admin account" }, 400);

  const db = await getDb();
  const before = db.users.length;
  db.users = db.users.filter((u) => u.id !== id);
  if (db.users.length === before) return json({ error: "User not found" }, 404);
  db.bankAccounts = db.bankAccounts.filter((a) => a.userId !== id);
  db.paymentMethods = db.paymentMethods.filter((m) => m.userId !== id);
  db.investments = db.investments.filter((i) => i.userId !== id);
  db.transactions = db.transactions.filter((t) => t.userId !== id);
  await saveDb(db);
  return json({ success: true });
}
