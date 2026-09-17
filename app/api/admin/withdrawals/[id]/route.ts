import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const body = await request.json();
  const db = await getDb();
  const tx = db.transactions.find((item) => item.id === id && item.type === "withdrawal");
  if (!tx) return json({ error: "Withdrawal not found" }, 404);

  if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return json({ error: "Invalid amount" }, 400);
    tx.amount = amount;
  }
  if (body.reference !== undefined) tx.reference = String(body.reference);
  if (body.method !== undefined) tx.method = String(body.method);
  if (body.status !== undefined) {
    const status = String(body.status);
    if (!["pending", "verified", "failed", "completed"].includes(status)) {
      return json({ error: "Invalid status" }, 400);
    }
    tx.status = status as typeof tx.status;
  }
  if (body.userId !== undefined) {
    if (!db.users.some((u) => u.id === body.userId)) return json({ error: "User not found" }, 404);
    tx.userId = String(body.userId);
  }

  await saveDb(db);
  return json({ success: true, transaction: tx });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const db = await getDb();
  const before = db.transactions.length;
  db.transactions = db.transactions.filter((item) => !(item.id === id && item.type === "withdrawal"));
  if (db.transactions.length === before) return json({ error: "Withdrawal not found" }, 404);
  await saveDb(db);
  return json({ success: true });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "").toLowerCase();
  const db = await getDb();
  const tx = db.transactions.find((item) => item.id === id && item.type === "withdrawal");
  if (!tx) return json({ error: "Withdrawal not found" }, 404);
  if (tx.status !== "pending") return json({ error: `Withdrawal is already ${tx.status}` }, 400);

  if (action === "approve") {
    tx.status = "completed";
  } else if (action === "reject") {
    tx.status = "failed";
    const user = db.users.find((u) => u.id === tx.userId);
    if (user) user.balance += tx.amount;
  } else {
    return json({ error: "action must be approve or reject" }, 400);
  }
  await saveDb(db);
  return json({ success: true, transaction: tx });
}
