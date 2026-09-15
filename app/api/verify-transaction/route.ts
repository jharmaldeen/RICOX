import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const reference = String(body.reference || "").trim();
  if (!reference) return json({ error: "Enter a transaction reference" }, 400);
  const db = await getDb();
  const tx = db.transactions.find(
    (item) => item.userId === auth.user.id && item.reference === reference,
  );
  if (!tx) return json({ error: "No matching transaction found" }, 404);
  tx.status = "verified";
  if (tx.type === "deposit") {
    const user = db.users.find((u) => u.id === auth.user.id);
    if (user) user.balance += tx.amount;
  }
  await saveDb(db);
  return json({ success: true, transaction: tx });
}
