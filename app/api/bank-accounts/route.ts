import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import { newId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const db = await getDb();
  return json({ accounts: db.bankAccounts.filter((a) => a.userId === auth.user.id) });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const bankName = String(body.bankName || "").trim();
  const accountName = String(body.accountName || "").trim();
  const accountNumber = String(body.accountNumber || "").trim();
  const sortCode = String(body.sortCode || "").trim();
  const routingNumber = String(body.routingNumber || "").trim();
  const iban = String(body.iban || "").trim();
  const swiftBic = String(body.swiftBic || "").trim();
  const country = String(body.country || "").trim();

  if (!bankName || !accountName || accountNumber.length < 4 || !sortCode) {
    return json({ error: "Bank name, account name, account number, and sort code are required." }, 400);
  }

  const db = await getDb();
  const account = {
    id: newId(),
    userId: auth.user.id,
    bankName,
    accountName,
    accountNumber,
    sortCode,
    routingNumber: routingNumber || undefined,
    iban: iban || undefined,
    swiftBic: swiftBic || undefined,
    country: country || undefined,
    createdAt: new Date().toISOString(),
  };
  db.bankAccounts.push(account);
  await saveDb(db);
  return json({ success: true, account });
}

export async function DELETE(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return json({ error: "Missing id" }, 400);
  const db = await getDb();
  const before = db.bankAccounts.length;
  db.bankAccounts = db.bankAccounts.filter((a) => !(a.id === id && a.userId === auth.user.id));
  if (db.bankAccounts.length === before) return json({ error: "Account not found" }, 404);
  await saveDb(db);
  return json({ success: true });
}
