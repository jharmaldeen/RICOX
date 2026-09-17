import { newId } from "@/lib/auth";
import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const db = await getDb();
  const accounts = db.bankAccounts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((account) => {
      const user = db.users.find((u) => u.id === account.userId);
      return { ...account, userName: user?.name || "Unknown", userEmail: user?.email || "" };
    });
  return json({ accounts, users: db.users.map((u) => ({ id: u.id, name: u.name, email: u.email })) });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const userId = String(body.userId || "");
  const bankName = String(body.bankName || "").trim();
  const accountName = String(body.accountName || "").trim();
  const accountNumber = String(body.accountNumber || "").trim();
  const sortCode = String(body.sortCode || "").trim();
  if (!userId || !bankName || !accountName || !accountNumber || !sortCode) {
    return json({ error: "userId, bank name, account name, number, and sort code are required" }, 400);
  }
  const db = await getDb();
  if (!db.users.some((u) => u.id === userId)) return json({ error: "User not found" }, 404);
  const account = {
    id: newId(),
    userId,
    bankName,
    accountName,
    accountNumber,
    sortCode,
    routingNumber: String(body.routingNumber || "").trim() || undefined,
    iban: String(body.iban || "").trim() || undefined,
    swiftBic: String(body.swiftBic || "").trim() || undefined,
    country: String(body.country || "").trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  db.bankAccounts.push(account);
  await saveDb(db);
  return json({ success: true, account });
}
