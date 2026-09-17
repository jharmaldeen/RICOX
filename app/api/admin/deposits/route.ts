import { newId } from "@/lib/auth";
import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const db = await getDb();
  const deposits = db.transactions
    .filter((tx) => tx.type === "deposit")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((tx) => {
      const user = db.users.find((u) => u.id === tx.userId);
      return {
        ...tx,
        userName: user?.name || "Unknown",
        userEmail: user?.email || "",
        hasProof: Boolean(tx.proofPath),
      };
    });
  return json({ deposits, users: db.users.map((u) => ({ id: u.id, name: u.name, email: u.email })) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const userId = String(body.userId || "");
  const amount = Number(body.amount);
  const status = ["pending", "verified", "failed", "completed"].includes(body.status) ? body.status : "pending";
  const reference = String(body.reference || "").trim();
  const method = String(body.method || "BTC");

  if (!userId || !Number.isFinite(amount) || amount <= 0) {
    return json({ error: "userId and positive amount are required" }, 400);
  }

  const db = await getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return json({ error: "User not found" }, 404);

  const tx = {
    id: newId(),
    userId,
    type: "deposit" as const,
    amount,
    status: status as "pending" | "verified" | "failed" | "completed",
    method,
    reference: reference || `BTC-${newId().slice(0, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(tx);
  if (status === "verified" || status === "completed") {
    user.balance += amount;
  }
  await saveDb(db);
  return json({ success: true, transaction: tx });
}
