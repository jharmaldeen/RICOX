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
  const type = body.type === "crypto" ? "crypto" : "bank";
  const label = String(body.label || "").trim();
  const details = String(body.details || "").trim();
  if (!label || !details) return json({ error: "Label and details are required." }, 400);
  const db = await getDb();
  const method = {
    id: newId(),
    userId: auth.user.id,
    type: type as "bank" | "crypto",
    label,
    details,
    createdAt: new Date().toISOString(),
  };
  db.paymentMethods.push(method);
  await saveDb(db);
  return json({ success: true, method });
}
