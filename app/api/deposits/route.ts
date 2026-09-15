import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import { newId } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const amount = Number(body.amount);
  const method = String(body.method || "Bank transfer");
  if (!Number.isFinite(amount) || amount < 50) return json({ error: "Minimum deposit is $50" }, 400);
  const db = await getDb();
  const tx = {
    id: newId(),
    userId: auth.user.id,
    type: "deposit" as const,
    amount,
    status: "pending" as const,
    method,
    reference: String(body.reference || `DEP-${newId().slice(0, 6).toUpperCase()}`),
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(tx);
  await saveDb(db);
  return json({ success: true, transaction: tx });
}
