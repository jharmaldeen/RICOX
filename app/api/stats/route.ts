import { deals } from "@/lib/data";
import { getDb } from "@/lib/db";
import { json } from "@/lib/api";

export async function GET() {
  const db = await getDb();
  const raised = db.investments.reduce((sum, item) => sum + item.amount, 0);
  return json({
    investors: db.users.length,
    raised,
    projects: deals.length,
  });
}
