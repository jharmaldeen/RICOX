import { json, requireAdmin } from "@/lib/api";
import { getBtcDepositAddress, updateBtcDepositAddress } from "@/lib/deposit";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const db = await getDb();
  const address = await getBtcDepositAddress();
  return json({
    settings: { btcDepositAddress: address },
    stats: {
      users: db.users.filter((u) => u.role === "user").length,
      pendingDeposits: db.transactions.filter((t) => t.type === "deposit" && t.status === "pending").length,
      pendingWithdrawals: db.transactions.filter((t) => t.type === "withdrawal" && t.status === "pending").length,
      bankAccounts: db.bankAccounts.length,
      cards: db.paymentMethods.filter((m) => m.type === "card").length,
    },
  });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const address = String(body.btcDepositAddress || "").trim();
  if (address.length < 20) return json({ error: "Enter a valid BTC wallet address" }, 400);
  const settings = await updateBtcDepositAddress(address);
  return json({ success: true, settings });
}
