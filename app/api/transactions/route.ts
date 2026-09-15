import { json, requireUser } from "@/lib/api";
import { getDb } from "@/lib/db";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  const db = await getDb();
  return json({
    transactions: db.transactions
      .filter((t) => t.userId === auth.user.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  });
}
