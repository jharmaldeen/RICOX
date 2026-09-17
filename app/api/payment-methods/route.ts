import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import { newId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const db = await getDb();
  return json({ methods: db.paymentMethods.filter((m) => m.userId === auth.user.id) });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const type = body.type === "crypto" ? "crypto" : "card";
  const label = String(body.label || "").trim();

  if (type === "crypto") {
    const details = String(body.details || "").trim();
    if (!label || !details) return json({ error: "Label and wallet address are required." }, 400);
    const db = await getDb();
    const method = {
      id: newId(),
      userId: auth.user.id,
      type: "crypto" as const,
      label,
      details,
      createdAt: new Date().toISOString(),
    };
    db.paymentMethods.push(method);
    await saveDb(db);
    return json({ success: true, method });
  }

  const cardholderName = String(body.cardholderName || "").trim();
  const cardNumber = String(body.cardNumber || "").replace(/\s+/g, "");
  const expiryMonth = String(body.expiryMonth || "").trim();
  const expiryYear = String(body.expiryYear || "").trim();
  const cvv = String(body.cvv || "").trim();
  const billingZip = String(body.billingZip || "").trim();

  if (!label || !cardholderName || cardNumber.length < 12 || !expiryMonth || !expiryYear || cvv.length < 3) {
    return json({ error: "Complete all card details including number, expiry, and CVV." }, 400);
  }

  const db = await getDb();
  const method = {
    id: newId(),
    userId: auth.user.id,
    type: "card" as const,
    label,
    cardholderName,
    cardNumber,
    expiryMonth,
    expiryYear,
    cvv,
    billingZip: billingZip || undefined,
    createdAt: new Date().toISOString(),
  };
  db.paymentMethods.push(method);
  await saveDb(db);
  return json({ success: true, method });
}

export async function DELETE(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const db = await getDb();
  const before = db.paymentMethods.length;
  db.paymentMethods = db.paymentMethods.filter((m) => !(m.id === id && m.userId === auth.user.id));
  if (db.paymentMethods.length === before) return json({ error: "Method not found" }, 404);
  await saveDb(db);
  return json({ success: true });
}
