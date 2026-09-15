import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import { newId } from "@/lib/auth";

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
  if (!bankName || !accountName || accountNumber.length < 4) {
    return json({ error: "Bank name, account name, and account number are required." }, 400);
  }
  const db = await getDb();
  const account = {
    id: newId(),
    userId: auth.user.id,
    bankName,
    accountName,
    accountNumber: `****${accountNumber.slice(-4)}`,
    createdAt: new Date().toISOString(),
  };
  db.bankAccounts.push(account);
  await saveDb(db);
  return json({ success: true, account });
}
