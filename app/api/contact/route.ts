import { newId } from "@/lib/auth";
import { getDb, saveDb } from "@/lib/db";
import { json } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const subject = String(body.subject || "").trim();
  if (!name || !email.includes("@") || !message) {
    return json({ error: "Name, email, and message are required." }, 400);
  }
  const db = await getDb();
  db.messages.push({
    id: newId(),
    name,
    email,
    subject: subject || undefined,
    message,
    createdAt: new Date().toISOString(),
  });
  await saveDb(db);
  return json({ success: true });
}
