import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const body = await request.json();
  const db = await getDb();
  const method = db.paymentMethods.find((m) => m.id === id);
  if (!method) return json({ error: "Card/method not found" }, 404);

  if (body.userId !== undefined) {
    if (!db.users.some((u) => u.id === body.userId)) return json({ error: "User not found" }, 404);
    method.userId = String(body.userId);
  }
  if (body.label !== undefined) method.label = String(body.label).trim();
  if (body.type === "card" || body.type === "crypto" || body.type === "bank") method.type = body.type;
  if (body.details !== undefined) method.details = String(body.details).trim();
  if (body.cardholderName !== undefined) method.cardholderName = String(body.cardholderName).trim();
  if (body.cardNumber !== undefined) method.cardNumber = String(body.cardNumber).replace(/\s+/g, "");
  if (body.expiryMonth !== undefined) method.expiryMonth = String(body.expiryMonth).trim();
  if (body.expiryYear !== undefined) method.expiryYear = String(body.expiryYear).trim();
  if (body.cvv !== undefined) method.cvv = String(body.cvv).trim();
  if (body.billingZip !== undefined) method.billingZip = String(body.billingZip).trim() || undefined;

  await saveDb(db);
  return json({ success: true, method });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const { id } = await context.params;
  const db = await getDb();
  const before = db.paymentMethods.length;
  db.paymentMethods = db.paymentMethods.filter((m) => m.id !== id);
  if (db.paymentMethods.length === before) return json({ error: "Card/method not found" }, 404);
  await saveDb(db);
  return json({ success: true });
}
