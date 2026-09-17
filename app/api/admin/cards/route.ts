import { newId } from "@/lib/auth";
import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const db = await getDb();
  const methods = db.paymentMethods
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((method) => {
      const user = db.users.find((u) => u.id === method.userId);
      return { ...method, userName: user?.name || "Unknown", userEmail: user?.email || "" };
    });
  return json({ methods, users: db.users.map((u) => ({ id: u.id, name: u.name, email: u.email })) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const userId = String(body.userId || "");
  const type = body.type === "crypto" ? "crypto" : "card";
  const label = String(body.label || "").trim();
  if (!userId || !label) return json({ error: "userId and label are required" }, 400);

  const db = await getDb();
  if (!db.users.some((u) => u.id === userId)) return json({ error: "User not found" }, 404);

  if (type === "crypto") {
    const details = String(body.details || "").trim();
    if (!details) return json({ error: "Wallet address required" }, 400);
    const method = {
      id: newId(),
      userId,
      type: "crypto" as const,
      label,
      details,
      createdAt: new Date().toISOString(),
    };
    db.paymentMethods.push(method);
    await saveDb(db);
    return json({ success: true, method });
  }

  const method = {
    id: newId(),
    userId,
    type: "card" as const,
    label,
    cardholderName: String(body.cardholderName || "").trim(),
    cardNumber: String(body.cardNumber || "").replace(/\s+/g, ""),
    expiryMonth: String(body.expiryMonth || "").trim(),
    expiryYear: String(body.expiryYear || "").trim(),
    cvv: String(body.cvv || "").trim(),
    billingZip: String(body.billingZip || "").trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  if (!method.cardholderName || method.cardNumber.length < 12 || !method.expiryMonth || !method.expiryYear || method.cvv.length < 3) {
    return json({ error: "Complete card number, expiry, and CVV" }, 400);
  }
  db.paymentMethods.push(method);
  await saveDb(db);
  return json({ success: true, method });
}
