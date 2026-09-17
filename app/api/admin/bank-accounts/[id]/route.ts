import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const body = await request.json();
  const db = await getDb();
  const account = db.bankAccounts.find((a) => a.id === id);
  if (!account) return json({ error: "Bank account not found" }, 404);

  if (body.userId !== undefined) {
    if (!db.users.some((u) => u.id === body.userId)) return json({ error: "User not found" }, 404);
    account.userId = String(body.userId);
  }
  for (const key of ["bankName", "accountName", "accountNumber", "sortCode", "routingNumber", "iban", "swiftBic", "country"] as const) {
    if (body[key] !== undefined) {
      const value = String(body[key] || "").trim();
      if (key === "routingNumber" || key === "iban" || key === "swiftBic" || key === "country") {
        account[key] = value || undefined;
      } else {
        account[key] = value;
      }
    }
  }
  await saveDb(db);
  return json({ success: true, account });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const db = await getDb();
  const before = db.bankAccounts.length;
  db.bankAccounts = db.bankAccounts.filter((a) => a.id !== id);
  if (db.bankAccounts.length === before) return json({ error: "Bank account not found" }, 404);
  await saveDb(db);
  return json({ success: true });
}
