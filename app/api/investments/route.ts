import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import { newId } from "@/lib/auth";
import { deals } from "@/lib/data";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const db = await getDb();
  return json({ investments: db.investments.filter((i) => i.userId === auth.user.id) });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const dealId = String(body.dealId || "");
  const amount = Number(body.amount);
  const deal = deals.find((d) => d.id === dealId);
  if (!deal) return json({ error: "Unknown project" }, 400);
  if (!Number.isFinite(amount) || amount < 100) return json({ error: "Minimum investment is $100" }, 400);
  const db = await getDb();
  const user = db.users.find((u) => u.id === auth.user.id);
  if (!user) return json({ error: "Unauthorized" }, 401);
  if (user.balance < amount) return json({ error: "Insufficient balance. Deposit funds first." }, 400);
  user.balance -= amount;
  const investment = {
    id: newId(),
    userId: user.id,
    dealId: deal.id,
    dealName: deal.name,
    amount,
    status: "active" as const,
    createdAt: new Date().toISOString(),
  };
  db.investments.push(investment);
  db.transactions.push({
    id: newId(),
    userId: user.id,
    type: "investment",
    amount,
    status: "completed",
    method: "Balance",
    reference: deal.name,
    createdAt: new Date().toISOString(),
  });
  await saveDb(db);
  return json({ success: true, investment, balance: user.balance });
}
