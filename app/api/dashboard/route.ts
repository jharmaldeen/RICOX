import { json, requireUser, safeUser } from "@/lib/api";
import { getDb } from "@/lib/db";
import { deals } from "@/lib/data";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const db = await getDb();
  const user = db.users.find((u) => u.id === auth.user.id) ?? auth.user;
  const investments = db.investments.filter((i) => i.userId === user.id);
  const transactions = db.transactions.filter((t) => t.userId === user.id);
  const invested = investments.reduce((sum, i) => sum + i.amount, 0);
  const returns = transactions.filter((t) => t.type === "return").reduce((sum, tx) => sum + tx.amount, 0);
  const withdrawals = transactions.filter((t) => t.type === "withdrawal");
  const sorted = [...transactions].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let running = 0;
  const sparkline = [0];
  for (const tx of sorted) {
    if (tx.status === "failed" || tx.status === "pending") continue;
    if (tx.type === "deposit" || tx.type === "return") running += tx.amount;
    if (tx.type === "withdrawal" || tx.type === "investment") running -= tx.amount;
    sparkline.push(Math.max(0, running));
  }

  const enriched = investments.map((inv) => {
    const deal = deals.find((d) => d.id === inv.dealId);
    const earned = transactions
      .filter((t) => t.type === "return" && t.reference === inv.dealName)
      .reduce((sum, t) => sum + t.amount, 0);
    const days = Math.max(1, Math.floor((Date.now() - new Date(inv.createdAt).getTime()) / 86_400_000));
    return {
      ...inv,
      roi: deal?.roi ?? "—",
      duration: deal?.duration ?? "—",
      category: deal?.category ?? "",
      earned,
      dailyYield: earned / days,
      days,
    };
  });

  return json({
    user: safeUser(user),
    invested,
    returns,
    activeInvestments: investments.filter((i) => i.status === "active").length,
    withdrawalCount: withdrawals.length,
    investments: enriched,
    recent: [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
    sparkline,
  });
}
