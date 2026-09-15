import { newId } from "@/lib/auth";
import { getDb, saveDb } from "@/lib/db";
import { json } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return json({ error: "Enter a valid email" }, 400);
  const db = await getDb();
  if (!db.subscribers.some((s) => s.email === email)) {
    db.subscribers.push({ id: newId(), email, createdAt: new Date().toISOString() });
    await saveDb(db);
  }
  return json({ success: true });
}
