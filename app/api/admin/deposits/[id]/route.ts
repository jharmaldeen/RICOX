import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "").toLowerCase();

  const db = await getDb();
  const tx = db.transactions.find((item) => item.id === id && item.type === "deposit");
  if (!tx) return json({ error: "Deposit not found" }, 404);

  if (action === "approve" || action === "reject") {
    if (tx.status !== "pending") return json({ error: `Deposit is already ${tx.status}` }, 400);
    if (action === "approve") {
      tx.status = "verified";
      const user = db.users.find((u) => u.id === tx.userId);
      if (user) user.balance += tx.amount;
    } else {
      tx.status = "failed";
    }
    await saveDb(db);
    return json({ success: true, transaction: tx });
  }

  return json({ error: "action must be approve or reject" }, 400);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const body = await request.json();
  const db = await getDb();
  const tx = db.transactions.find((item) => item.id === id && item.type === "deposit");
  if (!tx) return json({ error: "Deposit not found" }, 404);

  const prevStatus = tx.status;
  if (body.amount !== undefined) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return json({ error: "Invalid amount" }, 400);
    tx.amount = amount;
  }
  if (body.reference !== undefined) tx.reference = String(body.reference);
  if (body.method !== undefined) tx.method = String(body.method);
  if (body.userId !== undefined) {
    if (!db.users.some((u) => u.id === body.userId)) return json({ error: "User not found" }, 404);
    tx.userId = String(body.userId);
  }
  if (body.status !== undefined) {
    const status = String(body.status);
    if (!["pending", "verified", "failed", "completed"].includes(status)) {
      return json({ error: "Invalid status" }, 400);
    }
    tx.status = status as typeof tx.status;
  }

  const user = db.users.find((u) => u.id === tx.userId);
  const wasCredited = prevStatus === "verified" || prevStatus === "completed";
  const isCredited = tx.status === "verified" || tx.status === "completed";
  if (user && wasCredited && !isCredited) user.balance -= tx.amount;
  if (user && !wasCredited && isCredited) user.balance += tx.amount;

  await saveDb(db);
  return json({ success: true, transaction: tx });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const db = await getDb();
  const tx = db.transactions.find((item) => item.id === id && item.type === "deposit");
  if (!tx) return json({ error: "Deposit not found" }, 404);

  if (tx.status === "verified" || tx.status === "completed") {
    const user = db.users.find((u) => u.id === tx.userId);
    if (user) user.balance -= tx.amount;
  }
  db.transactions = db.transactions.filter((item) => item.id !== id);
  await saveDb(db);
  return json({ success: true });
}
